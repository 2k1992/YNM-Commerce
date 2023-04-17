import express from 'express';
import data from './data.js';

const app = express();

app.get('/api/products', (red, res) => {
  res.send(data.products);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http:${port}`);
});
