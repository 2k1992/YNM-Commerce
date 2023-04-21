import React from 'react';
import { ProgressBar } from 'react-bootstrap';

export default function CheckoutSteps(props) {
  const steps = [
    { title: 'Sign-In', href: '/signin', active: props.step1 },
    { title: 'Address', href: '/shipping', active: props.step2 },
    { title: 'Payment', href: '/payment', active: props.step3 },
    { title: 'Place Order', href: '/placeorder', active: props.step4 },
  ];

  const completedSteps = steps.filter((step) => step.active).length - 1;
  const progress = (completedSteps / (steps.length - 1)) * 100;

  return <ProgressBar now={progress} label={' '} className="checkout-steps" />;
}
