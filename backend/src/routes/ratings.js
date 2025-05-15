const express = require("express");
const { auth } = require("../middleware/auth");
const { Rating, Store, User } = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

// Submit or update a rating
router.post("/:storeId", auth, async (req, res) => {
  try {
    const { rating } = req.body;
    const { storeId } = req.params;

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Check if user has already rated this store
    let userRating = await Rating.findOne({
      where: {
        userId: req.user.id,
        storeId,
      },
    });

    if (userRating) {
      // Update existing rating
      userRating.rating = rating;
      await userRating.save();
    } else {
      // Create new rating
      userRating = await Rating.create({
        userId: req.user.id,
        storeId,
        rating,
      });
    }

    // Update store's average rating
    const allRatings = await Rating.findAll({
      where: { storeId },
    });

    const averageRating =
      allRatings.reduce((acc, curr) => acc + curr.rating, 0) /
      allRatings.length;
    store.averageRating = averageRating;
    await store.save();

    res.json({
      rating: userRating,
      averageRating: store.averageRating,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting rating", error: error.message });
  }
});

// Get ratings for a store
router.get("/store/:storeId", auth, async (req, res) => {
  try {
    const { storeId } = req.params;

    const ratings = await Rating.findAll({
      where: { storeId },
      include: [
        {
          model: User,
          attributes: ["name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(ratings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching ratings", error: error.message });
  }
});

// Get user's ratings
router.get("/user", auth, async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Store,
          attributes: ["name", "address", "averageRating"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(ratings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user ratings", error: error.message });
  }
});

module.exports = router;
