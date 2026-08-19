import type { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};

const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
  if (isLoading) return <SectionGridSkeleton />;

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Button
          variant="link"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Show all
        </Button>
      </div>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {songs.map((song) => (
          <div
            key={song._id}
            className="bg-zinc-800/40 p-4 rounded-lg hover:bg-zinc-700/60 transition-all duration-200 group cursor-pointer"
          >
            {/* Album Cover */}
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden bg-zinc-800">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {/* Play Button Overlay */}
              <PlayButton song={song} />
            </div>

            {/* Song Info */}
            <div className="space-y-1">
              <h3 className="font-semibold text-white truncate group-hover:text-white transition-colors">
                {song.title}
              </h3>
              <p className="text-sm text-zinc-400 truncate group-hover:text-zinc-300 transition-colors">
                {song.artist}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;
