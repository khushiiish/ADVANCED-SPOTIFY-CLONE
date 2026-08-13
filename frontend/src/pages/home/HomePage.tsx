import Topbar from '@/components/Topbar'
import { useMusicStore } from '@/stores/useMusicStore'
import { useEffect } from 'react'



const HomePage = () => {
  const{
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
  

  }=useMusicStore();

  useEffect(()=>{
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  },[fetchFeaturedSongs,fetchMadeForYouSongs,fetchTrendingSongs]);
  console.log({isLoading,madeForYouSongs,featuredSongs,trendingSongs});
  
  return (
    <div className="h-full overflow-hidden rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar />
    </div>
  )
}

export default HomePage