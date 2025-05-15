const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

// User-Store relationship (for store owners)
User.hasMany(Store, { foreignKey: "ownerId" });
Store.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// User-Rating relationship
User.hasMany(Rating, { foreignKey: "userId" });
Rating.belongsTo(User, { foreignKey: "userId" });

// Store-Rating relationship
Store.hasMany(Rating, { foreignKey: "storeId" });
Rating.belongsTo(Store, { foreignKey: "storeId" });

module.exports = {
  User,
  Store,
  Rating,
};
