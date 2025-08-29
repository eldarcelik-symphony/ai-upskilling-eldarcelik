import React from 'react';
import LoadingGif from '../../assets/loading.gif';

export default function Loading() {
  return (
    <div className='flex justify-center my-[150px] mx-auto'>
      <img src={LoadingGif} alt='loading' height='100px' width='100px' />
    </div>
  );
}
