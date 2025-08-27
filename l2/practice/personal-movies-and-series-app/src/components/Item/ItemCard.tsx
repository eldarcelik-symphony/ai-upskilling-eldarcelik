import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MoviesShowsContext } from '../../Context';
import { IMAGE_PATH, DEFAULT_IMAGE } from '../../constants';
import Vote from '../../components/Vote/Vote';
import './ItemCard.css';

export default function ItemCard({ item }: any) {
  const { contentType } = useContext(MoviesShowsContext);
  const { id, poster_path, title, name, vote_average } = item;

  return (
    <Link to={`/${contentType}/${item.id}`} className='no-decoration'>
      <div key={id} className='item item-container'>
        <img className='image' src={poster_path ? `${IMAGE_PATH}${poster_path}` : DEFAULT_IMAGE} alt={name || title} />

        <div className='title-container'>
          <h1 className='title'>{title || name}</h1>
          {vote_average > 0 && <Vote voteValue={Math.round(vote_average * 10) / 10} />}
        </div>
      </div>
    </Link>
  );
}
