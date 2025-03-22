import { useMovies } from '@/hooks/useMovies'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from "../api/axiosConfig";
type Props = {}

const WishLists = (props: Props) => {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState<any[]>([]);
  useEffect(() => {
      const fetchWishlist = async () => {
        try {
          const response = await api.get(`http://movies-springboot-api-env.eba-bus5biay.us-east-2.elasticbeanstalk.com/api/v1/users/wishlist?clerkId=${user!.id}`);
          if (response.status === 200) {
            setWishlist(response.data);
          }
        } catch (error) {
          console.log("Error fetching wishlist", error);
        }
      };
      fetchWishlist();
    
  }, [user]); 

  return (
    <div className='container mx-auto'>
      <div className="py-12">
        <h2 className='text-4xl font-semibold text-zinc-100'>WishLists</h2>
        <p className='text-zinc-300'>View all your favourite movies</p>
      </div>
      
      <ul className='flex justify-between items-center'>
        {wishlist.map((item)=>(
          <li className="" key={item.movieId}>
            <img src={item.posterLink} alt="" className='w-[150px]' />
            <Link to={`/${item.movieId}`} className="flex flex-1 flex-col w-full hover:underline px-4 pb-4">
              <h2 className="font-semibold pt-3 truncate w-full text-xl text-white">{item.title}</h2>
              <span className="text-zinc-300 w-full text-xs">{item.genre}</span>
            </Link>
          </li>
        ))}
      </ul>
      
    </div>
  )
}

export default WishLists