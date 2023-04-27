import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
}
// function Pay({ order }) {
//   const {
//     shippingAddress: { fullName },
//     user: { email },
//     _id: orderId,
//     totalPrice: amount,
//   } = order;

//   return (
//     <div>
//       <form method="POST" action="https://api.chapa.co/v1/hosted/pay">
//         <input
//           type="hidden"
//           name="public_key"
//           value="CHAPUBK_TEST-GqnUAdPyZFp0PnxJqd8gUFV2Xod0iOCL"
//         />
//         <input type="hidden" name="tx_ref" value={orderId} />
//         <input type="hidden" name="amount" value={amount} />
//         <input type="hidden" name="currency" value="ETB" />
//         <input type="hidden" name="email" value={email} />
//         <input type="hidden" name="first_name" value={fullName.split(' ')[0]} />
//         <input type="hidden" name="last_name" value={fullName.split(' ')[1]} />
//         <input type="hidden" name="title" value="Let us do this" />
//         <input
//           type="hidden"
//           name="description"
//           value="Paying with Confidence with chapa"
//         />
//         <input
//           type="hidden"
//           name="logo"
//           value="https://yourcompany.com/logo.png"
//         />
//         <input
//           type="hidden"
//           name="callback_url"
//           value="https://example.com/callbackurl"
//         />
//         <input type="hidden" name="return_url" value="https://localhost:3000" />
//         <input type="hidden" name="meta[title]" value="test" />
//         <button className="button-light w-100" type="submit">
//           Pay With Chapa
//         </button>
//       </form>
//     </div>
//   );
// }

export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
      successPay: false,
      loadingPay: false,
    });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/signin');
    }
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <div className="container dark-container">
        <h1 className="my-3 light-text">Order {orderId}</h1>
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body className="card-Body">
                <Card.Title className="light-text">Shipping</Card.Title>
                <Card.Text className="light-text">
                  <strong className="light-text">Name:</strong>{' '}
                  {order.shippingAddress.fullName} <br />
                  <strong className="light-text">Email:</strong>{' '}
                  {order.shippingAddress.email} <br />
                  <strong className="light-text">Address: </strong>{' '}
                  {order.shippingAddress.address},{order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                </Card.Text>
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Delivered at {order.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Delivered</MessageBox>
                )}
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body className="card-Body">
                <Card.Title className="light-text">Payment</Card.Title>
                <Card.Text className="light-text">
                  <strong className="light-text">Method:</strong>{' '}
                  {order.paymentMethod}
                </Card.Text>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paid at {order.paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Paid</MessageBox>
                )}
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body className="card-Body">
                <Card.Title className="light-text">Items</Card.Title>
                <ListGroup variant="flush">
                  {order.orderItems.map((item) => (
                    <ListGroup.Item className="card-Body" key={item._id}>
                      <Row className="align-items-center">
                        <Col md={6}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid light-text rounded img-thumbnail"
                          ></img>{' '}
                          <Link
                            className="light-text"
                            to={`/product/${item.slug}`}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col className="light-text" md={3}>
                          <span>{item.quantity}</span>
                        </Col>
                        <Col className="light-text" md={3}>
                          ${item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3">
              <Card.Body className="card-Body">
                <Card.Title className="light-text">Order Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item className="card-Body">
                    <Row>
                      <Col className="light-text">Items</Col>
                      <Col className="light-text">
                        ${order.itemsPrice.toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="card-Body">
                    <Row>
                      <Col className="light-text">Shipping</Col>
                      <Col className="light-text">
                        ${order.shippingPrice.toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="card-Body">
                    <Row>
                      <Col className="light-text">Tax</Col>
                      <Col className="light-text">
                        ${order.taxPrice.toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="card-Body">
                    <Row>
                      <Col>
                        <strong className="light-text"> Order Total</strong>
                      </Col>
                      <Col>
                        <strong className="light-text">
                          {order.totalPrice.toFixed(2)} ETB
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {/* <ListGroup.Item className="card-Body d-flex justify-content-center">
                    
                    <Pay order={order} />
                  </ListGroup.Item> */}
                  {!order.isPaid && (
                    <ListGroup.Item className="card-Body">
                      {isPending ? (
                        <LoadingBox />
                      ) : (
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      )}
                      {loadingPay && <LoadingBox></LoadingBox>}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
