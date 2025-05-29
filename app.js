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
const commentRoutes = require('./routes/comment.routes'); // ✅ ajouté

// Utiliser les routes
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/blogs', blogRoutes);
app.use(commentRoutes); // ✅ ajouté pour les commentaires

// Route d’accueil
app.get('/', (req, res) => {
  res.send('Bienvenue sur SeedShop API !');
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
