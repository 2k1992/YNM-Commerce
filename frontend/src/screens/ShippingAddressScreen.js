import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);
  const [email, setEmail] = useState(shippingAddress.email || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
        email,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        email,
      })
    );
    navigate('/payment');
  };
  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>

      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container dark-container">
        <h1 className="my-3 light-text">Shipping Address</h1>
        <Form onSubmit={submitHandler}>
          <div className="row">
            <div className="col-12 col-md-6">
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label className="light-text">Full Name</Form.Label>
                <Form.Control
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-12 col-md-6">
              <Form.Group className="mb-3" controlId="address">
                <Form.Label className="light-text">Address</Form.Label>
                <Form.Control
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <Form.Group className="mb-3" controlId="city">
                <Form.Label className="light-text">City</Form.Label>
                <Form.Control
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-12 col-md-6">
              <Form.Group className="mb-3" controlId="postalCode">
                <Form.Label className="light-text">Postal Code</Form.Label>
                <Form.Control
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <Form.Group className="mb-3" controlId="country">
                <Form.Label className="light-text">Country</Form.Label>
                <Form.Control
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-12 col-md-6">
              <Form.Group className="mb-3" controlId="email">
                <Form.Label className="light-text">Email</Form.Label>
                <Form.Control
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
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
