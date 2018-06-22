import React from 'react';

import { Cards, Page } from '../components';

const Home = () => (
  <Page
    content={
      <React.Fragment>
        <Cards
          statuses={[
            { name: 'In a meeting', color: 'red', emoji: '🗓' },
            { name: 'Working remotely', color: 'blue', emoji: '🏠' },
            { name: 'Vacationing', color: 'green', emoji: '🌴' }
          ]}
        />
      </React.Fragment>
    }
  />
);

export default Home;
