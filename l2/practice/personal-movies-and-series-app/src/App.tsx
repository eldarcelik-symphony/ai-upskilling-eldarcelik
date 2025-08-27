import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { MoviesShowsProvider } from './Context';
import Home from './pages/Home/Home';
import MovieOrShow from './pages/MovieOrShow/MovieOrShow';
import Error from './pages/Error/Error';
import './App.css';

function App() {
  return (
    <>
      <MoviesShowsProvider>
        <Router>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/:content/:id' component={MovieOrShow} />
            <Route component={Error} />
          </Switch>
        </Router>
      </MoviesShowsProvider>
    </>
  );
}

export default App;
