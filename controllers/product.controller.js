exports.getAllProducts = (req, res) => {
  res.json([
    { id: 1, name: 'Tomates', category: 'Légumes', price: 3.5 },
    { id: 2, name: 'Pommes', category: 'Fruits', price: 2.2 },
  ]);
};
