import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { Search } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import api from "../../api/axiosConfig";
import { BASE_API_URL } from '@/constants'
import { Movie } from '@/types'
type Props = {}

const Header = (props: Props) => {
  const { user } = useUser();
  const [isRegistered, setIsRegistered] = useState(false);
  const location = useLocation();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults,setSearchResults] = useState<Movie[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {

      const userRegistered = localStorage.getItem(`user_registered_${user.id}`);
      
      if (!userRegistered) {
        handleUserSignUp();
      }
    }
  }, [user]);

  useEffect(() => {

    setSearchInput("");
    setSearchResults([]);
  }, [location.pathname]); 

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchInput("");
        setSearchResults([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserSignUp = async () => {
    if (user) {
      try {
        const response = await api.post(`http://localhost:8080/api/v1/users/webhook`, {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
        });

        console.log('User registered successfully:', response.data);
        
        // Store in localStorage to prevent duplicate calls
        localStorage.setItem(`user_registered_${user.id}`, "true");
        setIsRegistered(true);
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  };
  const fetchSearchData = async (value:string) => {
    if (!value.trim()) { 
      setSearchResults([]); 
      return;  
    }
    const results = await api.get(`${BASE_API_URL}/movies/search`,{
      params:{query:value}
    })
    setSearchResults(results.data.slice(0, 6));
    console.log(results.data)
  }
  const handleSearch = (value:string) => {
    setSearchInput(value)
    fetchSearchData(value)


  }

  const handleSearchPage = (value:string) => {
    if (value.trim()) {
      navigate(`/find?query=${encodeURIComponent(value)}`);
    }
  }

  return (
    <header className='bg-zinc-800'>
        <nav className='flex justify-between items-center w-full container mx-auto py-5'>
            <div className="flex items-center gap-12 ">
                <div className="">
                    <Link to="/" className='text-white font-semibold text-lg'>
                        SceneScreen
                    </Link>
                </div>
                <div ref={searchContainerRef} className="bg-white px-4 py-1 relative !rounded-md w-[600px] flex items-center justify-between">
                    <input 
                      placeholder='Search Here...' 
                      className='bg-white w-full outline-none' 
                      value={searchInput}
                      onChange={(e)=> handleSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearchPage(searchInput);
                        }
                      }}
                    />
                    <Button onClick={() => handleSearchPage(searchInput)} className='bg-transparent hover:bg-transparent cursor-pointer'>
                        <Search className='text-zinc-500 !w-5 !h-5'/>
                    </Button>
                    <div className={`${searchInput ? 'flex' : 'hidden'} flex flex-col  absolute top-12 left-0 w-full bg-zinc-800 z-10  rounded-md `}>
                      {searchResults.map((item)=>(
                        <Link to={`/${item.movieId}`} className="p-4 flex justify-start items-center gap-2 py-3 border-b border-zinc-600 transition-all ease-in-out duration-100 hover:bg-zinc-700">
                          <div className="">
                            <img src={item.posterLink} alt="" className='w-13 rounded-md'/>
                          </div>
                          <div className="">
                            <h2 className='text-zinc-100 font-bold'>{item.title}</h2>
                            <span className='text-zinc-400'>{item.releaseYear}</span>
                          </div>
                          
                        </Link>
                      ))}
                      <Link to={`/find?query=${encodeURIComponent(searchInput)}`} className="p-2 text-white text-sm transition-all ease-in-out duration-100 hover:bg-zinc-700">
                        See all the results for "{searchInput}"
                      </Link>
                    </div>
                </div>
                
            </div>
            <div className="">
              <ul>
                <li>
                  <Link to="/wish-list" className='text-white'>Wish List</Link>
                </li>
              </ul>
            </div>
            
            <div className="">
              <SignedOut>
                <SignInButton >
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
                        Sign In
                    </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>  
            </div>
        </nav>
        
    </header>
  )
}

export default Header