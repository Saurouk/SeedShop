// On importe Express
const express = require('express');

// initialise l'application
const app = express();

// Définir le port sur lequel le serveur va écouter
const PORT = 3000;

// Middleware pour lire les requêtes en JSON
app.use(express.json());

// Route d'accueil : http://localhost:3000
app.get('/', (req, res) => {
  res.send('Bienvenue sur SeedShop API !');
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
