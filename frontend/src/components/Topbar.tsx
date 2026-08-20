import { SignedOut, UserButton } from '@clerk/clerk-react';
import { LayoutDashboardIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import SignInOAuthButtons from './SignInOAuthButtons';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

const Topbar = () => {
  const { isAdmin } = useAuthStore();

  return (
    <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10 rounded-lg border border-zinc-800/50">
      {/* Left Side - Logo */}
      <div className="flex gap-2 items-center flex-shrink-0">
        <img src='/spotify.png' className='size-8' alt='Spotify logo' />
        <span className="font-bold text-lg text-white">Spotify</span>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Admin Dashboard Button */}
        {isAdmin && (
          <Link
            to="/admin"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "gap-2 text-sm font-medium border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-white"
            )}
          >
            <LayoutDashboardIcon className="size-4 text-emerald-400" />
            <span className="hidden sm:inline">Admin Dashboard</span>
            <span className="sm:hidden">Admin</span>
          </Link>
        )}

        {/* Auth Buttons */}
        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>

        {/* User Menu */}
        <UserButton />
      </div>
    </div>
  );
};

export default Topbar;
