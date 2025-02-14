export {};

declare global {
  interface IBackendResponse<T> {
    error?: string | string[];
    statusCode: number | string;
    msg: string;
    message?: string;
    data: T;
  }
  interface IRes {
    error?: string | string[];
    statusCode: number | string;
    message?: string;
  }
  interface ILogin {
    id: string;
    fullName: string;
    phone: string;
    address: string;
    accessToken: string;
    refresh_token: string;
    roles: string[];
    email: string;
    createdAt: string;
    updatedAt: string;
  }
  interface IUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }
  interface IModelPaginate<T> {
    error?: string | string[];
    statusCode: number | string;
    msg: string;
    pagination: {
      currentPage: number;
      limit: number;
      totalPage: number;
      totalItems: number;
    };
    data: T[];
  }
  interface ICountry {
    _id: string;
    name: string;
    slug: string;
  }
  interface IMovies {
    // actorName: string;
    _id?: string;
    name: string;
    engName: string;
    imdb: string;
    tmdb: string;
    kkslug: string;
    nguoncslug: string;
    ophimslug: string;
    content: string;
    type: string;
    status: string;
    poster_url: string;
    thumb_url: string;
    chieurap: boolean;
    hot: boolean;
    trailer_url: string;
    time: string;
    episode_current: string;
    episode_total: string;
    season_current: string;
    season_total: string;
    quality: string;
    lang: string;
    year: number;
    country: ICountry[];
    genres: ICountry[];
    actor: number[];
    createdAt: string;
    updatedAt: string;
  }
  interface IEpisodes {
    _id: string;

    movieId: string;
    serverName: string;
    serverData: {
      name: string;
      slug: string;
      sub: string;
      link: string;
    }[];
    createdAt: string;
    updatedAt: string;
  }
}
