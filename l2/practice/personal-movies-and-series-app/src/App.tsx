import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MoviesShowsProvider } from './Context';
import Home from './pages/Home';
import MovieOrShow from './pages/MovieOrShow';
import Error from './pages/Error';

function App() {
  return (
    <>
      <MoviesShowsProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/:content/:id' element={<MovieOrShow />} />
            <Route path='*' element={<Error />} />
          </Routes>
        </Router>
      </MoviesShowsProvider>
    </>
  );
}

export default App;
