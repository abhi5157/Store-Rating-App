const express = require("express");
const { auth, isAdmin } = require("../middleware/auth");
const { Store, User, Rating } = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

// Get all stores
router.get("/", auth, async (req, res) => {
  try {
    const { name, address } = req.query;
    const where = {};

    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["name", "email"],
        },
      ],
      order: [["name", "ASC"]],
    });

    // If user is logged in, include their rating for each store
    const storesWithUserRating = await Promise.all(
      stores.map(async (store) => {
        const userRating = await Rating.findOne({
          where: {
            storeId: store.id,
            userId: req.user.id,
          },
        });

        return {
          ...store.toJSON(),
          userRating: userRating ? userRating.rating : null,
        };
      })
    );

    res.json(storesWithUserRating);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stores", error: error.message });
  }
});

// Create new store (admin only)
router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Store owner not found" });
    }

    // Update user role to store_owner if not already
    if (owner.role !== "store_owner") {
      owner.role = "store_owner";
      await owner.save();
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId,
    });

    res.status(201).json(store);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating store", error: error.message });
  }
});

// Get store details
router.get("/:id", auth, async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["name", "email"],
        },
        {
          model: Rating,
          include: [
            {
              model: User,
              attributes: ["name", "email"],
            },
          ],
        },
      ],
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Check if user has rated this store
    const userRating = await Rating.findOne({
      where: {
        storeId: store.id,
        userId: req.user.id,
      },
    });

    res.json({
      ...store.toJSON(),
      userRating: userRating ? userRating.rating : null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching store details", error: error.message });
  }
});

// Get store owner dashboard
router.get("/owner/dashboard", auth, async (req, res) => {
  try {
    if (req.user.role !== "store_owner") {
      return res.status(403).json({ message: "Access denied" });
    }

    const store = await Store.findOne({
      where: { ownerId: req.user.id },
      include: [
        {
          model: Rating,
          include: [
            {
              model: User,
              attributes: ["name", "email"],
            },
          ],
        },
      ],
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const totalRatings = store.Ratings.length;
    const averageRating =
      totalRatings > 0
        ? store.Ratings.reduce((acc, curr) => acc + curr.rating, 0) /
          totalRatings
        : 0;

    res.json({
      store,
      statistics: {
        totalRatings,
        averageRating,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching store owner dashboard",
      error: error.message,
    });
  }
});

// Update store (admin only)
router.put("/:id", auth, isAdmin, async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.findByPk(req.params.id);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Validate store name length
    if (name && (name.length < 20 || name.length > 60)) {
      return res
        .status(400)
        .json({ message: "Store name must be between 20 and 60 characters" });
    }

    // Update store owner if provided
    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner) {
        return res.status(404).json({ message: "Store owner not found" });
      }

      // Update user role to store_owner if not already
      if (owner.role !== "store_owner") {
        owner.role = "store_owner";
        await owner.save();
      }
    }

    await store.update({
      name: name || store.name,
      email: email || store.email,
      address: address || store.address,
      ownerId: ownerId || store.ownerId,
    });

    res.json(store);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating store", error: error.message });
  }
});

// Delete store (admin only)
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Delete all ratings associated with the store
    await Rating.destroy({ where: { storeId: store.id } });

    // Delete the store
    await store.destroy();

    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting store", error: error.message });
  }
});

module.exports = router;
