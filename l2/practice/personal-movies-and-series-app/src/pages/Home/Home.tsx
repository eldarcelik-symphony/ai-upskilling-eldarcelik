import React, { useContext } from 'react';
import { MoviesShowsContext } from '../../Context';
import Navbar from '../../components/Navbar/Navbar';
import ItemCard from '../../components/Item/ItemCard';
import Loading from '../../components/Loading/Loading';
import { CONTENT_TYPE } from '../../constants';
import { IShow, IMovie } from '../../types';

export default function Home() {
  const { movies, shows, contentType, loading } = useContext(MoviesShowsContext);
  const data = contentType === CONTENT_TYPE.TV_SHOW ? (shows as IShow[]) : (movies as IMovie[]);

  // Display movies/tv shows as item cards
  // @ts-ignore
  const items = data.map((item) => {
    return <ItemCard key={item.id} item={item} />;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <section className='w-[90vw] mx-auto my-[35px] grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-y-10 gap-x-12 justify-items-center'>
        {items}
      </section>
    </>
  );
}
