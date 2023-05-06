import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container dark-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3 SI-title">Payment Method</h1>
        <Form onSubmit={submitHandler}>
          {/* <div className="mb-3 ">
            <Form.Check
              className="light-text radio"
              type="radio"
              id="Chapa"
              label="Chapa"
              value="Chapa"
              checked={paymentMethodName === 'Chapa'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div> */}
          <div className="mb-3">
            <Form.Check
              className="light-text radio"
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              className="light-text radio"
              type="radio"
              id="Cash"
              label="Cash on delivery"
              value="Cash"
              checked={paymentMethodName === 'Cash'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3 d-flex justify-content-center">
            <Button className="button-light" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
