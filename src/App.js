import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import NewMovie from './NewMovie';
import Movies from './Movies';
import EditMovie from './EditMovie';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/movie/edit/:id">
          <EditMovie />
        </Route>
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
