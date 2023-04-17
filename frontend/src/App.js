import { Button } from 'react-bootstrap';
import { CartFill } from 'react-bootstrap-icons';
import logo from './assets/image/logo.png';
import data from './data';
function App() {
  return (
    <div>
      <header>
        <a href="/">
          <img alt="logo" src={logo} />
        </a>
      </header>
      <main>
        <h1>Featured Products</h1>
        <div className="products">
          {data.products.map((product) => (
            <div className="product" key={product.slug}>
              <a href={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </a>
              <div className="product-info">
                <a href={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </a>
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
      </main>
    </div>
  );
}

export default App;
