import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { EnvelopeFill, LockFill } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation(); // hook from react-router-dom
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="dark-container small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3 SI-title">Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label className="light-text">Email</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <EnvelopeFill />
            </InputGroup.Text>
            <Form.Control
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label className="light-text">Password</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <LockFill />
            </InputGroup.Text>
            <Form.Control
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>
        </Form.Group>
        <div className="mb-3 d-flex justify-content-center ">
          <Button className="button-light" type="submit">
            Sign In
          </Button>
        </div>
        <div className="mb-3 text-light d-flex justify-content-center">
          <Link className="light-text" to={`/signup?redirect=${redirect}`}>
            Create New Account
          </Link>
        </div>
      </Form>
    </Container>
  );
}
