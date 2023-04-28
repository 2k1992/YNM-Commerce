import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [dispatch] = useReducer(reducer);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const { data } = await axios.put(
          '/api/users/profile',
          {
            name,
            email,
            password,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({
          type: 'UPDATE_SUCCESS',
        });
        ctxDispatch({ type: 'USER_SIGNIN', payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
        toast.success('User updated successfully');
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
        });
        toast.error(getError(err));
      }
    } else {
      toast.error('Passwords do not match');
    }
  };

  return (
    <div className="dark-container container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3 text-light">User Profile</h1>

      <form onSubmit={submitHandler}>
        <div className="row">
          <div className="col-md-6">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label className="text-light">Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group className="mb-3" controlId="email">
              <Form.Label className="text-light">Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group className="mb-3" controlId="password">
              <Form.Label className="text-light">Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label className="text-light">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-center">
          <Button className="button-light px-3 m-1" type="submit">
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}
