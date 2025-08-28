import React, { useState, useContext, useEffect } from 'react';
import { MoviesShowsContext } from '../../Context';
import { IMAGE_PATH, DEFAULT_IMAGE } from '../../constants';
import { Link, useParams } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import Vote from '../../components/Vote/Vote';
import { IMovie, IShow } from '../../types';
import { axios } from '../../axios';
import './MovieOrShow.css';

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
        className='center-media video'
        width='100%'
        height='100%'
        src={`https://www.youtube.com/embed/${video}`}
        allowFullScreen
      ></iframe>
    ) : (
      <img
        className='center-media picture'
        src={item.posterPath ? `${IMAGE_PATH}${item.posterPath}` : DEFAULT_IMAGE}
        alt={'title' in item ? item.title : item.name}
        width='400px'
        height='100%'
      />
    );

  // Display item details
  const itemDetails = (
    <div>
      <h1 className='item-title'>
        {'title' in item ? item.title : item.name}
        {item.voteAverage > 0 && <Vote voteValue={Math.round(item.voteAverage * 10) / 10} />}
      </h1>
      <hr />
      <p className='release'>
        {'releaseDate' in item
          ? `Release Date: ${item.releaseDate}`
          : `First Air Date: ${item.firstAirDate} \nLast Air Date: ${item.lastAirDate}`}
      </p>
      <p className='overview'>{item.overview.length > 0 ? item.overview : 'No additional information available.'}</p>
    </div>
  );

  return (
    <div className='bcg'>
      <div className='content-container'>
        <div style={{ background: '#1c2237' }}>
          <Link to='/'>
            <button className='button-back'>&lt; Back</button>
          </Link>
        </div>
        <div className='item-content'>
          {displayVideoOrImage}
          <div>{itemDetails}</div>
        </div>
      </div>
    </div>
  );
}
