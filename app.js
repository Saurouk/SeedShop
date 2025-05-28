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

// Utiliser les routes
app.use('/products', productRoutes);
app.use('/users', userRoutes);

// Route d’accueil
app.get('/', (req, res) => {
  res.send('Bienvenue sur SeedShop API !');
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
