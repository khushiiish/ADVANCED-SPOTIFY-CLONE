import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import { useEffect, useState } from "react";

const MainLayout = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<div className='h-screen bg-black text-white flex flex-col'>
			<AudioPlayer />

			<ResizablePanelGroup orientation='horizontal' className='flex-1 flex h-full overflow-hidden p-2'>
				{/* Left sidebar */}
				<ResizablePanel defaultSize="20%" minSize={isMobile ? "0%" : "15%"} maxSize="30%" className="min-w-0">
					<LeftSidebar />
				</ResizablePanel>

				<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

				{/* Main content */}
				<ResizablePanel defaultSize={isMobile ? "80%" : "60%"} className="min-w-0 overflow-hidden">
					<Outlet />
				</ResizablePanel>

				{/* Right sidebar */}
				{!isMobile && <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />}
				{!isMobile && (
					<ResizablePanel defaultSize="20%" minSize="15%" maxSize="25%" className="min-w-0">
						<FriendsActivity />
					</ResizablePanel>
				)}
			</ResizablePanelGroup>

			<PlaybackControls />
		</div>
	);
};
export default MainLayout;
