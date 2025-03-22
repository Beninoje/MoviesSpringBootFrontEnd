import { useEffect, useState } from "react";

import { Movie } from "../types";
import { fetchAllMovieFromWishlist, fetchMovies, fetchSingleMovie } from "../actions";


export function useMovies(page?:number,movieId?:number,clerkId?:string) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [wishlist, setWishlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const getMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchMovies(page!,10);
        setMovies(data.movies);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError("Failed to fetch movies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, [page]);
  useEffect(() => {
    if (!movieId) return; // Prevent fetching if no movieId

    const getMovie = async () => {
      try {
        setLoading(true);
        const movieIdNumber = Number(movieId)
        const fetchedMovie = await fetchSingleMovie(movieIdNumber);
        setMovie(fetchedMovie);
      } catch (err) {
        setError("Failed to fetch movie");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getMovie();
  }, [movieId]);
  useEffect(() => {
    if (!clerkId) return; // Prevent fetching if no movieId

    const getAllMoviesFromWishlist = async () => {
      try {
        setLoading(true);
        const fetchedMovie = await fetchAllMovieFromWishlist(clerkId);
        setWishlist(fetchedMovie);
      } catch (err) {
        setError("Failed to fetch movie");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getAllMoviesFromWishlist();
  }, []);


  return { movies, loading, error,movie, totalPages, wishlist };
}
