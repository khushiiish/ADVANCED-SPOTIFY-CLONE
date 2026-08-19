import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer"
import  PlaybackControls  from "./components/PlaybackControls";
import { useEffect, useState } from "react";



const MainLayout = () => {
	const [isMobile,setIsMobile]=useState(false);

	useEffect(()=>{
		const checkMobile=()=>{
			setIsMobile(window.innerWidth<768);

		};
		checkMobile();
		window.addEventListener("resize",checkMobile);
		return ()=> window.removeEventListener("resize",checkMobile);
	},[])
	return (
		<div className='h-screen bg-black text-white flex flex-col p-2 gap-2'>
			<AudioPlayer />
			<div className='flex-1 flex overflow-hidden gap-2'>
				{/* Left sidebar */}
				<div className='w-[280px] shrink-0 flex flex-col'>
					<LeftSidebar />
				</div>

				{/* Main content */}
				<div className='flex-1 overflow-hidden rounded-lg bg-zinc-900'>
					<Outlet />
				</div>

				{/* Right sidebar - Friends Activity */}
				{!isMobile && (
					<div className='w-[280px] shrink-0 flex flex-col'>
						<FriendsActivity />
					</div>
				)}
			</div>
			
			<PlaybackControls />
		</div>
		
	);
};

export default MainLayout;
