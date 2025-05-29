// Charger les variables d'environnement depuis .env
require('dotenv').config();

// Importer Sequelize + modèles (connexion)
const db = require('./models');

const express = require('express');
const app = express();
const PORT = 3000;

// Importer la tâche cron (mise à jour statuts commandes)
const statusUpdater = require('./cron/statusUpdater');

// Middleware JSON
app.use(express.json());

/* ========== Import des routes ========== */
const productRoutes   = require('./routes/product.routes');
const userRoutes      = require('./routes/user.routes');
const categoryRoutes  = require('./routes/category.routes');
const blogRoutes      = require('./routes/blog.routes');
const commentRoutes   = require('./routes/comment.routes');
const likeRoutes      = require('./routes/like.routes');
const reportRoutes    = require('./routes/report.routes');
const cartRoutes      = require('./routes/cart.routes');
const orderRoutes     = require('./routes/order.routes');
const wishlistRoutes  = require('./routes/wishlist.routes');   // ✅ routes Wishlist

/* ========== Montage des routes ========== */
app.use('/products',  productRoutes);
app.use('/users',     userRoutes);
app.use('/categories', categoryRoutes);
app.use('/blogs',     blogRoutes);

app.use(commentRoutes);       // préfixes intégrés dans les fichiers
app.use(likeRoutes);
app.use(reportRoutes);
app.use(cartRoutes);
app.use('/orders', orderRoutes);
app.use(wishlistRoutes);      // ✅ wishlist (préfixe /wishlist dans le fichier)


// Démarrer la tâche cron (mise à jour des statuts)
statusUpdater.start();

/* Route d’accueil */
app.get('/', (_req, res) => {
  res.send('Bienvenue sur SeedShop API !');
});

/* Lancer le serveur */
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
