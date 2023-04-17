import { Button } from 'react-bootstrap';
// import data from '../data';
import { CartFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomeScreen() {
  // useState is a react hook
  // we'll use it to return a variable (products) and a function(setProducts)
  // to update this variable
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/api/products');
      setProducts(result.data); // result.data is the products in the backend
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>Featured Products</h1>
      <div className="products">
        {/* to get the data from data.js and display it  */}
        {products.map((product) => (
          <div className="product" key={product.slug}>
            <Link to={`/product/${product.slug}`}>
              <img src={product.image} alt={product.name} />
            </Link>
            <div className="product-info">
              <Link to={`/product/${product.slug}`}>
                <p>{product.name}</p>
              </Link>
              <p>
                <strong>{product.price}ETB</strong>
              </p>
              <Button variant="primary">
                <CartFill /> Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
