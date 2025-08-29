import React from 'react';
import { Link } from 'react-router-dom';

export default function Error() {
  return (
    <div className='flex flex-col justify-center items-center mx-auto my-[150px] text-6xl sm:text-3xl sm:whitespace-nowrap'>
      <h1>Error 404</h1>
      <h6>Page Not Found</h6>
      <button className='mt-8'>
        <Link to='/' className='text-primary underline hover:text-danger transition-colors'>
          Back to Home Page
        </Link>
      </button>
    </div>
  );
}
