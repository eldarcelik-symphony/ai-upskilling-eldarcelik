import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MoviesShowsContext } from '../Context';
import { IMAGE_PATH, DEFAULT_IMAGE } from '../constants';
import Vote from './Vote';
import { IMovie, IShow } from '../types';

type ItemCardProps = {
  item: IMovie | IShow;
};

export default function ItemCard({ item }: ItemCardProps) {
  const { contentType } = useContext(MoviesShowsContext);
  const { id, posterPath, voteAverage } = item;

  return (
    <Link to={`/${contentType}/${item.id}`} className='no-underline'>
      <div
        key={id}
        className='bg-primary flex flex-col w-[450px] h-full text-center cursor-pointer shadow-[0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)] max-w-[300px] transition-all duration-200 ease-in-out hover:scale-110'
      >
        <img
          className='h-[450px]'
          src={posterPath ? `${IMAGE_PATH}${posterPath}` : DEFAULT_IMAGE}
          alt={'title' in item ? item.title : item.name}
        />

        <div className='flex justify-between px-4 py-2'>
          <h1 className='break-words text-secondary pr-3 text-2xl font-semibold'>
            {'title' in item ? item.title : item.name}
          </h1>
          {voteAverage > 0 && <Vote voteValue={Math.round(voteAverage * 10) / 10} />}
        </div>
      </div>
    </Link>
  );
}
