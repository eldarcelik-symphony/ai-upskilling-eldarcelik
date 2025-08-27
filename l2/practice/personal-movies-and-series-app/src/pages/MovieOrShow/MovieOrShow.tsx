import React, { useState, useContext, useEffect } from 'react';
import { MoviesShowsContext } from '../../Context';
import { API_KEY, IMAGE_PATH, DEFAULT_IMAGE } from '../../constants';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import Vote from '../../components/Vote/Vote';
import './MovieOrShow.css';

export default function MovieOrShow(props: any) {
  const { contentType } = useContext(MoviesShowsContext);
  const [id] = useState(props.match.params.id);
  const [video, setVideo] = useState<string | number>();
  const [item, setItem] = useState<any>();
  const ITEM_URL = `https://api.themoviedb.org/3/${contentType}/${id}?api_key=${API_KEY}&append_to_response=videos`;

  useEffect(() => {
    fetch(ITEM_URL)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
        // Set video key to use in React Player url
        setVideo(data.videos.results[0].key);
      })
      .catch((error) => {
        // TODO: Handle error
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Display loader if there is no item
  if (!item) {
    return <Loading />;
  }

  // If there is video, display it, otherwise display image
  const displayVideoOrImage =
    item.videos.results.length === 0 ? (
      <img
        className='center-media picture'
        src={item.poster_path ? `${IMAGE_PATH}${item.poster_path}` : DEFAULT_IMAGE}
        alt={item.title || item.name}
        width='400px'
        height='100%'
      />
    ) : (
      <iframe
        title='video'
        className='center-media video'
        width='100%'
        height='100%'
        src={`https://www.youtube.com/embed/${video}`}
        frameBorder='0'
        allowFullScreen
      ></iframe>
    );

  // Display item details
  const itemDetails = (
    <div>
      <h1 className='item-title'>
        {item.name || item.title}
        {item.vote_average > 0 && <Vote voteValue={Math.round(item.vote_average * 10) / 10} />}
      </h1>
      <hr />
      <p className='release'>
        {item.release_date
          ? `Release Date: ${item.release_date}`
          : `First Air Date: ${item.first_air_date} \nLast Air Date: ${item.last_air_date}`}
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
