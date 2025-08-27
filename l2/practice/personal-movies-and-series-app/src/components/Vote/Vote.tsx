import React from 'react';
import './Vote.css';

type VoteProps = {
  voteValue: number;
};

export default function Vote({ voteValue }: VoteProps) {
  return (
    <p className='vote-average'>
      <i className='fas fa-star'></i>
      {voteValue}
    </p>
  );
}
