import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import NewMovie from './NewMovie';
import Movies from './Movies';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/movie/new">
          <NewMovie />
        </Route>
        <Route exact path="/">
          <Movies />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
