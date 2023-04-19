import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ProductScreen() {
  // to get the slug from the url and show it in the screen
  // use a hook from react-router-dom
  // the name of the hook is useParams
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row className="mt-3">
        <Col md={4}>
          <img
            className="img-large"
            src={product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item className="cardBody">
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item className="cardBody">
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item className="cardBody">
              {' '}
              Pirce : {product.price} ETB
            </ListGroup.Item>
            <ListGroup.Item className="cardBody">
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card className="card">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="cardBody">
                  <Row>
                    <Col>Price:</Col>
                    <Col>{product.price} ETB</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="cardBody">
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Out of stock</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item className="cardBody">
                    <div className="d-grid">
                      <Button className="button" variant="primary">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
