

import api from "../api/axiosConfig";
import { BASE_API_URL } from "../constants";

export const fetchMovies = async (page:number,limit:number) => {
    try {
        const res = api.get(`${BASE_API_URL}/movies?page=${page}&limit=${limit}`)
        return (await res).data;    
    } catch (error) {
        console.log("Error fetching movies: ", error)
        throw error;
    }
};
export const fetchSingleMovie = async (movieId:number) => {
    try {
        const res = api.get(`${BASE_API_URL}/movies/${movieId}`)
        return (await res).data;
    } catch (error) {
        console.log("Error fetching movie", error)
        throw error;
    }
};
// http://localhost:8080/api/v1/users/wishlist?clerkId=user_2uT49gV4cLGUYPZQEjHvSevNPsz
export const fetchAllMovieFromWishlist = async (clerkId:string) => {
    try {
        const res = api.get(`${BASE_API_URL}/users/wishlist?clerkId=${clerkId}`)
        return (await res).data;
    } catch (error) {
        console.log("Error fetching movie", error)
        throw error;
    }
};