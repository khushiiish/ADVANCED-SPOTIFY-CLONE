import { useMusicStore } from "@/stores/useMusicStore";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import PlayButton from "@/pages/home/components/PlayButton";

const FeaturedSection = () => {
  const { isLoading, featuredSongs, error } = useMusicStore();

  if (isLoading) return <FeaturedGridSkeleton />;

  if (error) {
    return <p className="text-red-500 mb-4 text-lg">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {featuredSongs.slice(0, 6).map((song) => (
        <div
          key={song._id}
          className="relative group cursor-pointer bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all"
        >
          {/* Album Cover */}
          <div className="relative mb-4">
            <div className="aspect-square rounded-md shadow-lg overflow-hidden">
              <img
                src={song.imageUrl}
                alt={song.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <PlayButton song={song} />
          </div>

          {/* Song Info */}
          <div>
            <h3 className="font-medium mb-1 truncate text-white">
              {song.title}
            </h3>
            <p className="text-sm text-zinc-400 truncate">
              {song.artist}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedSection;
