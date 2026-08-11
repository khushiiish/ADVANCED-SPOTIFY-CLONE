import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";

const MainLayout = () => {
	return (
		<div className='h-screen bg-black text-white flex p-2 gap-2 overflow-hidden'>
			{/* Left sidebar */}
			<div className='w-[280px] h-full shrink-0 flex flex-col'>
				<LeftSidebar />
			</div>

			{/* Main content */}
			<div className='flex-1 h-full overflow-hidden rounded-lg bg-zinc-900'>
				<Outlet />
			</div>
		</div>
	);
};

export default MainLayout;
