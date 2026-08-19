import { HomeIcon, Library, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { useMusicStore } from "@/stores/useMusicStore";
import type { Album } from "@/types";

const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  const location = useLocation();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const isNavActive = (path: string) => location.pathname === path;

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation Menu */}
      <div className="rounded-lg bg-zinc-900 p-4 flex-shrink-0">
        <div className="space-y-2">
          {/* Home Link */}
          <Link
            to="/"
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "w-full justify-start text-white hover:bg-zinc-800 transition-colors duration-150",
              isNavActive("/") && "bg-zinc-800"
            )}
          >
            <HomeIcon className="mr-3 h-5 w-5" />
            <span className="font-medium">Home</span>
          </Link>

          {/* Messages Link */}
          <Link
            to="/chat"
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "w-full justify-start text-white hover:bg-zinc-800 transition-colors duration-150",
              isNavActive("/chat") && "bg-zinc-800"
            )}
          >
            <MessageCircle className="mr-3 h-5 w-5" />
            <span className="font-medium">Messages</span>
          </Link>
        </div>
      </div>

      {/* Playlists Section */}
      <div className="flex-1 rounded-lg bg-zinc-900 p-4 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2 flex-shrink-0">
          <div className="flex items-center text-white">
            <Library className="h-5 w-5 mr-2" />
            <span className="font-semibold text-sm">Playlists</span>
          </div>
        </div>

        {/* Albums/Playlists List */}
        <ScrollArea className="flex-1">
          <div className="space-y-2 pr-4">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : albums.length > 0 ? (
              albums.map((album: Album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/60 transition-colors duration-150 group cursor-pointer"
                >
                  {/* Album Cover */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={album.imageUrl}
                      alt={album.title}
                      className="h-12 w-12 rounded-md object-cover shadow-md"
                    />
                  </div>

                  {/* Album Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white truncate group-hover:text-white transition-colors">
                      {album.title}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                      {album.artist}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-zinc-500">No albums yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSidebar;
