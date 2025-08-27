export type ContextProps = {
  children: React.ReactNode;
};

export interface IData {
  id: number;
  overview: string;
  vote_average: number;
  poster_path: string | null;
}

export interface IShow extends IData {
  name: string;
  first_air_date: string;
  last_air_date: string;
}

interface IVideos {
  results: Array<Object>;
}

export interface IMovie extends IData {
  title: string;
  videos: IVideos;
  release_date: string;
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
