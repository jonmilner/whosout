import React from 'react';
import ReactDOM from 'react-dom';
import {
  browserHistory as history,
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Home from './pages/Home';

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route component={Home} />
    </Switch>
  </Router>
);

ReactDOM.render(<Routes />, document.getElementById('root'));
