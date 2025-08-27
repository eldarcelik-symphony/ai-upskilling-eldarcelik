import React from 'react';
import { Link } from 'react-router-dom';
import './Error.css';

export default function Error() {
  return (
    <div className='error'>
      <h1>Error 404</h1>
      <h6>Page Not Found</h6>
      <button>
        <Link to='/' className='error-button'>
          Back to Home Page
        </Link>
      </button>
    </div>
  );
}
