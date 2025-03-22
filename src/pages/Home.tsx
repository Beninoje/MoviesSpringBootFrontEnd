import { Link } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import api from "../api/axiosConfig";
import { toast } from "sonner"
import { useUser } from "@clerk/clerk-react";
import { Movie } from "@/types";
import { BASE_API_URL } from "@/constants";


const Home = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { movies, loading, error, totalPages } = useMovies(currentPage);
  const [isWishList,setIsWishList] = useState<Map<number,boolean>>(new Map());
  const {user} = useUser(); 
  const clerkId = user?.id;
  useEffect(() => {
    // Fetch wishlist on mount and set wishlistMovies state
    if (user) {
      fetchWishlist(clerkId!);
    }
  }, [user]);

  const fetchWishlist = async (clerkId:string) => {
    try {
      const response = await api.get(`${BASE_API_URL}/users/wishlist?clerkId=${clerkId}`);
      if (response.status === 200) {
        // Map movie IDs to true to represent that they are in the wishlist
        const wishlistMap = new Map();
        response.data.forEach((movie:Movie) => {
          wishlistMap.set(movie.movieId, true);
        });
        setIsWishList(wishlistMap);
      }
    } catch (error) {
      console.log("Error fetching wishlist", error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const getPaginationNumbers = () => {
    const pages = [];
    
    if (currentPage <= 3) {
      pages.push(1, 2, 3, "...",totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }

    return pages;
  };

  const addMovieToWishList = async (movie:Movie) => {
    try {
      if (!user) {
        toast("Please sign in to add movies to your wishlist");
        return;
      }
      const movieData = {
        clerkId: user.id,  // Send clerkId in the body, not as a query parameter
        movie: movie
      };

      const response = await api.post(`http://localhost:8080/api/v1/users/wishlist`, movieData);

      if(response.status === 200)
      {
        toast("Movie Successfully Added to Wishlists")
        setIsWishList((prev) => new Map(prev).set(movie.movieId, true));
      }
      else{
        if (response.data === "Cannot add the same movie") {
          toast("Cannot add the same movie");
        } else {
          toast("Something went wrong");
        }
      }
    } catch (error) {
      console.log("Error adding movie to wishlist", error)
    }
  }
  const removeMoviefromWishlist = async(movie:Movie) => {
    try {
      if (!user) {
        toast("Please sign in to remove movies from your wishlist");
        return;
      }
      const movieData = {
        clerkId: user.id,  // Send clerkId in the body, not as a query parameter
        movie: movie
      };

      const response = await api.delete(`http://localhost:8080/api/v1/users/wishlist`, {
        data:movieData
      });

      if(response.status === 200)
      {
        toast("Movie Successfully Remove From Wishlists")
        setIsWishList((prev) => {
            const newWishList = new Map(prev);
            newWishList.delete(movie.movieId);
            return newWishList;
          }
        );
      }
      else{
        if (response.data === "Cannot remove the same movie") {
          toast("Cannot remove the same movie");
        } else {
          toast("Something went wrong");
        }
      }
    } catch (error) {
      console.log("Error removing movie from wishlist", error)
    }
  }


  return (
    <div className="px-10">
      <h1>Movies</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <ul className="grid grid-cols-8 gap-4 container mx-auto">
            {movies.map((movie) => {
                const isInWishlist = isWishList.get(movie.movieId); // Check if the movie is in the wishlist
                return (
                  <div className="relative flex flex-col justify-center items-center col-span-1 rounded-xl bg-zinc-900" key={movie.movieId}>
                    <img src={movie.posterLink} alt="" className="w-full h-[300px] rounded-xl" />
                    <Link to={`/${movie.movieId}`} className="flex flex-1 flex-col w-full hover:underline px-4 pb-4">
                      <h2 className="font-semibold pt-3 truncate w-full text-xl text-white">{movie.title}</h2>
                      <span className="text-zinc-300 w-full text-xs">{movie.genre}</span>
                    </Link>
                    <div className="absolute top-2 right-2">
                      {isInWishlist ? (
                        <Button
                        className={`bg-white hover:bg-zinc-200 shadow-md cursor-pointer rounded-full w-8 h-8`}
                        onClick={() => removeMoviefromWishlist(movie)}
                      >
                        <Check className="text-black"/>
                      </Button>
                        
                      ): (
                        <Button
                        className={`bg-zinc-700 hover:bg-zinc-600 shadow-md cursor-pointer rounded-full w-8 h-8`}
                        onClick={() => addMovieToWishList(movie)}
                        
                        >
                        <Plus />
                      </Button>
                      )}
                      
                    </div>
                  </div>
                );
              })}
          </ul>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem onClick={handlePreviousPage} className="cursor-pointer  !rounded-lg">
                  <PaginationPrevious className="hover:!bg-zinc-600"/>
                </PaginationItem>

                {getPaginationNumbers().map((page, index) =>
                  typeof page === "number" ? (
                    <PaginationItem
                      key={index}
                      onClick={() => setCurrentPage(page)}
                      className={`cursor-pointer   rounded-lg ${page === currentPage ? "bg-zinc-700 " : ""}`}
                    >
                      <PaginationLink className="!text-white hover:!bg-zinc-500">{page}</PaginationLink>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={index}>
                      <PaginationEllipsis className="text-white"/>
                    </PaginationItem>
                  )
                )}

                <PaginationItem onClick={handleNextPage} className="cursor-pointer !rounded-lg">
                  <PaginationNext className="hover:!bg-zinc-600"/>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
