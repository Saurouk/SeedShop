const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config');

/* ===== Connexion ===== */
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT || dbConfig.dialect,
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log('Connexion à la base de données réussie !'))
  .catch(err => console.error('Erreur de connexion à la base :', err));

/* ===== Chargement des modèles ===== */
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User         = require('./user.model')        (sequelize, DataTypes);
db.Category     = require('./category.model')    (sequelize, DataTypes);
db.Product      = require('./product.model')     (sequelize, DataTypes);
db.Blog         = require('./blog.model')        (sequelize, DataTypes);
db.Comment      = require('./comment.model')     (sequelize, DataTypes);
db.Like         = require('./like.model')        (sequelize, DataTypes);
db.Report       = require('./report.model')      (sequelize, DataTypes);
db.Cart         = require('./cart.model')        (sequelize, DataTypes);
db.Order        = require('./order.model')       (sequelize, DataTypes);
db.OrderItem    = require('./orderItem.model')   (sequelize, DataTypes);
db.Wishlist     = require('./wishlist.model')    (sequelize, DataTypes);
db.Rental       = require('./rental.model')      (sequelize, DataTypes);
db.RentalOrder  = require('./rentalOrder.model') (sequelize, DataTypes);
db.Newsletter   = require('./newsletter.model')  (sequelize, DataTypes);
db.Message      = require('./message.model')     (sequelize, DataTypes); 

/* ===== Associations (appel une seule fois chacun) ===== */
if (db.Product.associate)      db.Product.associate(db);
if (db.Blog.associate)         db.Blog.associate(db);
if (db.Comment.associate)      db.Comment.associate(db);
if (db.Like.associate)         db.Like.associate(db);
if (db.Report.associate)       db.Report.associate(db);
if (db.Cart.associate)         db.Cart.associate(db);
if (db.Order.associate)        db.Order.associate(db);
if (db.OrderItem.associate)    db.OrderItem.associate(db);
if (db.Wishlist.associate)     db.Wishlist.associate(db);
if (db.Rental.associate)       db.Rental.associate(db);
if (db.RentalOrder.associate)  db.RentalOrder.associate(db);
if (db.Message.associate)      db.Message.associate(db); 

/* ===== Synchronisation ===== */
db.sequelize.sync({ alter: true }).then(() => {
  console.log('Modèles synchronisés avec la base de données.');
});

module.exports = db;
