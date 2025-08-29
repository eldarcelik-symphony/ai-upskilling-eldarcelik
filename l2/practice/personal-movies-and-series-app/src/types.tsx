export interface IData {
  id: number;
  overview: string;
  voteAverage: number;
  posterPath: string | null;
}

export interface IShow extends IData {
  name: string;
  firstAirDate: string;
  lastAirDate: string;
}

interface IVideos {
  results: Array<Object>;
}

export interface IMovie extends IData {
  title: string;
  videos: IVideos;
  releaseDate: string;
}

export interface IReviewAuthorDetails {
  name: string;
  username: string;
  avatarPath: string | null;
  rating: number | null;
}

export interface IReview {
  author: string;
  authorDetails: IReviewAuthorDetails;
  content: string;
  createdAt: string;
  id: string;
  updatedAt: string;
  url: string;
}

export interface IReviewsResponse {
  id: number;
  page: number;
  results: IReview[];
  totalPages: number;
  totalResults: number;
}

export type AppContextInterface = {
  movies: IMovie[];
  setMovies: (value: IMovie[]) => void;
  shows: IShow[];
  setShows: (value: IShow[]) => void;
  activeQueryType: string;
  loading: boolean;
  setLoading: (value: boolean) => void;
  contentType: string;
  setContentType: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
};

export type NavbarState = {
  moviesActive: boolean;
  showsActive: boolean;
};
