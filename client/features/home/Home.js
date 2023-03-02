import React from 'react';
import { useSelector } from 'react-redux';

/**
 * COMPONENT
 */
const Home = (props) => {
  const username = useSelector((state) => state.auth.me);

  return (
    <div>
      <h3>Welcome</h3>
    </div>
  );
};

export default Home;
