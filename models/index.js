const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config');

// Initialiser la connexion
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,
  }
);

// Tester la connexion
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie !');
  })
  .catch((err) => {
    console.error('Erreur de connexion à la base :', err);
  });

// Initialiser l'objet db
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Charger les modèles
db.User = require('./user.model')(sequelize, DataTypes);
db.Category = require('./category.model')(sequelize, DataTypes);
db.Product = require('./product.model')(sequelize, DataTypes);
db.Blog = require('./blog.model')(sequelize, DataTypes);
db.Comment = require('./comment.model')(sequelize, DataTypes);
db.Like = require('./like.model')(sequelize, DataTypes);
db.Report = require('./report.model')(sequelize, DataTypes); // ✅ ajout du modèle Report

// Appliquer les associations
if (db.Product.associate) db.Product.associate(db);
if (db.Blog.associate) db.Blog.associate(db);
if (db.Comment.associate) db.Comment.associate(db);
if (db.Like.associate) db.Like.associate(db);
if (db.Report.associate) db.Report.associate(db); // ✅ association Report → User, Blog, Comment

// Synchroniser les tables
db.sequelize.sync({ alter: true }).then(() => {
  console.log('Modèles synchronisés avec la base de données.');
});

module.exports = db;
