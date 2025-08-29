import React from 'react';

type VoteProps = {
  voteValue: number;
};

export default function Vote({ voteValue }: VoteProps) {
  return (
    <p className='flex flex-col items-center text-danger text-base'>
      <i className='fas fa-star'></i>
      {voteValue}
    </p>
  );
}
