// Charger les variables d'environnement depuis .env
require('dotenv').config();

// Importer Sequelize + modèles
const db = require('./models');

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware pour lire les requêtes JSON
app.use(express.json());

// Importer les routes
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const blogRoutes = require('./routes/blog.routes');
const commentRoutes = require('./routes/comment.routes');
const likeRoutes = require('./routes/like.routes'); // ✅ ajout des routes Like
const reportRoutes = require('./routes/report.routes'); // ✅ ajout des routes Report
const cartRoutes = require('./routes/cart.routes'); // ✅ ajout des routes Cart
const orderRoutes = require('./routes/order.routes'); // ✅ ajout des routes Order

// Utiliser les routes
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/blogs', blogRoutes);
app.use(commentRoutes);
app.use(likeRoutes);
app.use(reportRoutes); // ✅ ajouté pour les signalements
app.use(cartRoutes); // ✅ ajouté pour le panier
app.use('/orders', orderRoutes); // ✅ ajouté pour les commandes

// Route d’accueil
app.get('/', (req, res) => {
  res.send('Bienvenue sur SeedShop API !');
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
