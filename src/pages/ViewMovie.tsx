import React from 'react'
import { useParams } from 'react-router-dom'
import { useMovies } from '../hooks/useMovies';

type Props = {}

const ViewMovie = (props: Props) => {
    const {movieId} = useParams();
    const movieIdNumber = Number(movieId);
    const { movie, loading, error } = useMovies(undefined,movieIdNumber);

    if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
      }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Movie Details</h1>
        {movie ? (
            <div className="mt-4">
            <img
                src={movie.posterLink}
                alt="Movie Poster"
                className="w-full max-w-md rounded-lg shadow-lg"
            />
            <h2 className="text-xl font-semibold mt-2">{movie.title}</h2>
            <p className="text-gray-600">{movie.releaseYear}</p>
            </div>
        ): (
            <p>{error}</p>
        )}
      
    </div>
  )
}

export default ViewMovie