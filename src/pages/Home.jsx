import React from 'react';

import { Cards, Page } from '../components';

const Home = () => (
  <Page
    content={
      <React.Fragment>
        <Cards />
      </React.Fragment>
    }
  />
);

export default Home;
