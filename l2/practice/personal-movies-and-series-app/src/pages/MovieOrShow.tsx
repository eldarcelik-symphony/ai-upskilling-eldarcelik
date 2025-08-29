import React, { useState, useContext, useEffect } from 'react';
import { MoviesShowsContext } from '../Context';
import { IMAGE_PATH, DEFAULT_IMAGE } from '../constants';
import { Link, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Vote from '../components/Vote';
import { IMovie, IShow } from '../types';
import { axios } from '../axios';

export default function MovieOrShow() {
  const { contentType } = useContext(MoviesShowsContext);
  const { id } = useParams();
  const [video, setVideo] = useState<string | number>();
  const [item, setItem] = useState<IMovie | IShow>();
  const ITEM_URL = `/${contentType}/${id}?append_to_response=videos`;

  useEffect(() => {
    axios
      .get(ITEM_URL)
      .then((res) => {
        const data = res.data;
        setItem(data);
        // Set video key to use in React Player url
        if (data.videos && data.videos.results && data.videos.results.length > 0) {
          setVideo(data.videos.results[0].key);
        }
      })
      .catch((error) => {
        // TODO: Handle error
        console.error('Error fetching item:', error);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Display loader if there is no item
  if (!item) {
    return <Loading />;
  }

  // If there is video, display it, otherwise display image
  const displayVideoOrImage =
    'videos' in item && item.videos.results.length > 0 ? (
      <iframe
        title='video'
        className='justify-self-center'
        width='100%'
        height='100%'
        src={`https://www.youtube.com/embed/${video}`}
        allowFullScreen
      ></iframe>
    ) : (
      <img
        className='justify-self-center'
        src={item.posterPath ? `${IMAGE_PATH}${item.posterPath}` : DEFAULT_IMAGE}
        alt={'title' in item ? item.title : item.name}
        width='400px'
        height='100%'
      />
    );

  // Display item details
  const itemDetails = (
    <div>
      <h1 className='text-primary text-3xl font-bold flex justify-between items-center'>
        {'title' in item ? item.title : item.name}
        {item.voteAverage > 0 && <Vote voteValue={Math.round(item.voteAverage * 10) / 10} />}
      </h1>
      <hr className='border-0 h-px bg-gradient-to-r from-black/75 to-transparent my-1' />
      <p className='text-xs text-gray-500 py-1 whitespace-pre-wrap'>
        {'releaseDate' in item
          ? `Release Date: ${item.releaseDate}`
          : `First Air Date: ${item.firstAirDate} \nLast Air Date: ${item.lastAirDate}`}
      </p>
      <p className='mt-4 text-lg leading-7'>
        {item.overview.length > 0 ? item.overview : 'No additional information available.'}
      </p>
    </div>
  );

  return (
    <div className='min-h-screen bg-primary pb-4'>
      <div className='w-[90vw] mx-auto mb-4 flex flex-col bg-secondary'>
        <div className='w-full bg-primary'>
          <Link to='/'>
            <button className='inline-flex items-center h-[35px] mx-[5px] px-6 py-2.5 text-base whitespace-nowrap text-center border-none rounded-lg outline-none cursor-pointer transition-all duration-200 bg-secondary text-primary hover:bg-gray-200 my-4 -ml-8'>
              &lt; Back
            </button>
          </Link>
        </div>
        <div className='grid grid-cols-2 gap-12 p-12 min-h-[550px] bg-secondary shadow-lg shadow-white/20 sm:p-8 xs:p-4'>
          {displayVideoOrImage}
          <div>{itemDetails}</div>
        </div>
      </div>
    </div>
  );
}
