import React, { useState } from 'react';
import Pay from './Pay';

function PaymentForm() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    amount: '',
  });
  const handleSubmit = (e) => {
    e.preventDefault(); // Send form data to backend API
    fetch('/api/pay', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(`Error: ${error}`));
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <form onSubmit={handleSubmit}>
      <Pay formData={formData} handleChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}
export default PaymentForm;
