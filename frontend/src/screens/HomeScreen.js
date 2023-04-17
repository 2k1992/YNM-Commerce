import { Button } from 'react-bootstrap';
import data from '../data';
import { CartFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

export default function HomeScreen() {
  return (
    <div>
      <h1>Featured Products</h1>
      <div className="products">
        {/* to get the data from data.js and display it  */}
        {data.products.map((product) => (
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
