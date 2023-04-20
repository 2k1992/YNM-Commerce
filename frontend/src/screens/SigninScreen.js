import { Link, useLocation } from 'react-router-dom';
import {
  Container,
  Form,
  Button,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { EnvelopeFill, LockFill } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';

export default function SigninScreen() {
  const { search } = useLocation(); // hook from react-router-dom
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  return (
    <Container className="dark-container small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3 SI-title">Sign In</h1>
      <Form>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label className="light-text">Email</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <EnvelopeFill />
            </InputGroup.Text>
            <FormControl type="email" required />
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label className="light-text">Password</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <LockFill />
            </InputGroup.Text>
            <FormControl type="password" required />
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
