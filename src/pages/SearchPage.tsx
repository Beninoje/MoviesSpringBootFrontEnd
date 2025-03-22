import { BASE_API_URL } from '@/constants';
import { Movie } from '@/types';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from "../api/axiosConfig";

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('query'); 

  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedResults, setDisplayedResults] = useState<Movie[]>([]); // To store results to display
  const [hasMore, setHasMore] = useState(true); // To stop fetching if all results are loaded

  // Fetch all search results
  const fetchSearchData = async () => {
    if (!searchQuery || !hasMore) return;
    try {
      setIsLoading(true);
      const response = await api.get(`${BASE_API_URL}/movies/search?query=${searchQuery}`);
      setSearchResults(response.data); // Store all results
      setDisplayedResults(response.data.slice(0, 6)); // Display the first 6
    } catch (error) {
      console.log("Error fetching results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery?.trim()) {
      setDisplayedResults([]); 
      setHasMore(true); 
      fetchSearchData();
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight &&
        !isLoading && 
        displayedResults.length < searchResults.length 
      ) {
        setDisplayedResults((prevResults) => {
          const newResults = [...prevResults, ...searchResults.slice(prevResults.length, prevResults.length + 6)];
          return newResults;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [displayedResults, isLoading, searchResults]);

  return (
    <div className='container mx-auto'>
      <div className="py-12">
        {searchQuery ? (
          <h2 className='text-zinc-100 text-5xl font-semibold'>Search results for: "{searchQuery}"</h2>
        ) : (
          <div>
            <h2 className='text-zinc-100 text-5xl font-semibold'>Search ScreenScene</h2>
            <p className='text-zinc-300 pt-2'>Search ScreenScene by typing a word or phrase in the search box at the top of this page.</p>
          </div>
        )}
      </div>

      <div className="pt-12">
        <div className="flex items-center gap-3">
          <div className="bg-blue-400 w-1 h-12"></div>
          <h3 className='text-2xl text-white'>Movies</h3>
        </div>
      </div>

      <div className="py-6">
        {displayedResults.map((item) => (
          <Link key={item.movieId} to={`/${item.movieId}`} className="p-4 flex justify-start items-center gap-2 py-3 border-b border-zinc-600 transition-all ease-in-out duration-100 hover:bg-zinc-700">
            <img src={item.posterLink} alt="" className='w-13 rounded-md'/>
            <div>
              <h2 className='text-zinc-100 font-bold'>{item.title}</h2>
              <span className='text-zinc-400'>{item.releaseYear}</span>
            </div>
          </Link>
        ))}

        {isLoading && (
          <div className="flex justify-center items-center py-6">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
