import Axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
          email: cart.email,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <div className="dark-container">
        <h1 className="my-3 text-light">Preview Order</h1>
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body className="card-Body">
                <Card.Title className="text-light">Shipping</Card.Title>
                <Card.Text className="text-light">
                  <strong className="text-light">Name:</strong>{' '}
                  {cart.shippingAddress.fullName} <br />
                  <strong className="text-light">Email:</strong>{' '}
                  {cart.shippingAddress.email} <br />
                  <strong className="text-light">Address: </strong>{' '}
                  {cart.shippingAddress.address},{cart.shippingAddress.city},{' '}
                  {cart.shippingAddress.postalCode},
                  {cart.shippingAddress.country}
                </Card.Text>
                <Link className="button-light" to="/shipping">
                  Edit
                </Link>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body className="card-Body">
                <Card.Title className="text-light">Payment</Card.Title>
                <Card.Text className="text-light">
                  <strong className="text-light">Method:</strong>{' '}
                  {cart.paymentMethod}
                </Card.Text>
                <Link className="button-light" to="/payment">
                  Edit
                </Link>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body className="card-Body">
                <Card.Title className="text-light">Items</Card.Title>
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item className="card-Body" key={item._id}>
                      <Row className="align-items-center">
                        <Col md={6}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail"
                          ></img>{' '}
                          <Link
                            className="text-light"
                            to={`/product/${item.slug}`}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={3}>
                          <span className="text-light">
                            {item.quantity} Item
                          </span>
                        </Col>
                        <Col className="text-light" md={3}>
                          {item.price} ETB
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Link className="button-light" to="/cart">
                  Edit
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body className="card-Body">
                <Card.Title className="text-light">Order Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item className="card-Body">
                    <Row>
                      <Col className="text-light">Items</Col>
                      <Col className="text-light">
                        {cart.itemsPrice.toFixed(2)} ETB
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="card-Body">
                    <Row>
                      <Col className="text-light">Shipping</Col>
                      <Col className="text-light">
                        {cart.shippingPrice.toFixed(2)} ETB
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="card-Body">
                    <Row>
                      <Col className="text-light">Tax</Col>
                      <Col className="text-light">
                        {cart.taxPrice.toFixed(2)} ETB
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="card-Body">
                    <Row>
                      <Col>
                        <strong className="text-light"> Order Total</strong>
                      </Col>
                      <Col>
                        <strong className="text-light">
                          {cart.totalPrice.toFixed(2)} ETB
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="card-Body">
                    <div className="d-grid">
                      <Button
                        className="button-light"
                        type="button"
                        onClick={placeOrderHandler}
                        disabled={cart.cartItems.length === 0}
                      >
                        Place Order
                      </Button>
                    </div>
                    {loading && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
