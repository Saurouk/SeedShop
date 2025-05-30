// Charger les variables d'environnement
require('dotenv').config();

// Connexion + définition & synchro des modèles (index.js)
require('./models');

const express = require('express');
const app = express();
const PORT = 3000;

/* ===== Cron : mise à jour statuts commandes ===== */
const statusUpdater = require('./cron/statusUpdater');

/* ===== Middleware ===== */
app.use(express.json());

/* ===== Imports de routes ===== */
const productRoutes   = require('./routes/product.routes');
const userRoutes      = require('./routes/user.routes');
const categoryRoutes  = require('./routes/category.routes');
const blogRoutes      = require('./routes/blog.routes');
const commentRoutes   = require('./routes/comment.routes');
const likeRoutes      = require('./routes/like.routes');
const reportRoutes    = require('./routes/report.routes');
const cartRoutes      = require('./routes/cart.routes');
const orderRoutes     = require('./routes/order.routes');
const wishlistRoutes  = require('./routes/wishlist.routes');
const rentalRoutes    = require('./routes/rental.routes'); // ✅ Location

/* ===== Montage des routes avec préfixes clairs ===== */
app.use('/products',    productRoutes);
app.use('/users',       userRoutes);
app.use('/categories',  categoryRoutes);
app.use('/blogs',       blogRoutes);
app.use('/comments',    commentRoutes);      // ✅ Ajout du préfixe
app.use('/likes',       likeRoutes);         // ✅ Ajout du préfixe
app.use('/reports',     reportRoutes);       // ✅ Ajout du préfixe
app.use('/cart',        cartRoutes);         // ✅ Ajout du préfixe
app.use('/orders',      orderRoutes);
app.use('/wishlist',    wishlistRoutes);     // ✅ Ajout du préfixe
app.use('/rentals',     rentalRoutes);       // ✅ OK

/* ===== Tâche Cron ===== */
statusUpdater.start();

/* ===== Accueil ===== */
app.get('/', (_req, res) => {
  res.send('Bienvenue sur SeedShop API !');
});

/* ===== Lancement serveur ===== */
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
