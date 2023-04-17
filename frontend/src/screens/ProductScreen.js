import React from 'react';
import { useParams } from 'react-router-dom';
// to get the slug from the url and show it in the screen
// use a hook from react-router-dom
// the name of the hook is useParams
export default function ProductScreen() {
  const params = useParams();
  // using constructing assignment to get slug from params
  const { slug } = params;
  return (
    <div>
      <h1>{slug}</h1>
    </div>
  );
}
