import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
  }, [fetchAlbumById, albumId]);

  if (isLoading || !currentAlbum) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-zinc-400">Loading album...</p>
      </div>
    );
  }

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum?.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentAlbumPlaying) {
      togglePlay();
    } else {
      playAlbum(currentAlbum?.songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;
    playAlbum(currentAlbum?.songs, index);
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        {/* Main Content */}
        <div className="relative min-h-full">
          {/* Background Gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-zinc-900/80 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Album Header Section */}
            <div className="flex flex-col sm:flex-row p-4 sm:p-8 gap-6 sm:gap-8 pb-8">
              {/* Album Cover */}
              <div className="flex-shrink-0">
                <img
                  src={currentAlbum?.imageUrl}
                  alt={currentAlbum?.title}
                  className="w-40 h-40 sm:w-56 sm:h-56 shadow-2xl rounded-lg object-cover"
                />
              </div>

              {/* Album Info */}
              <div className="flex flex-col justify-end flex-1">
                <p className="text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wide">
                  Album
                </p>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold my-4 text-white leading-tight">
                  {currentAlbum?.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-300">
                  <span className="font-semibold text-white">
                    {currentAlbum?.artist}
                  </span>
                  <span className="text-zinc-400">•</span>
                  <span>{currentAlbum?.songs.length} songs</span>
                  <span className="text-zinc-400">•</span>
                  <span>{currentAlbum?.releaseYear}</span>
                </div>
              </div>
            </div>

            {/* Play Button Section */}
            <div className="px-4 sm:px-8 pb-6 flex items-center gap-4">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-green-500 hover:bg-green-400 text-black hover:scale-105 transition-all duration-200 flex-shrink-0"
              >
                {isPlaying &&
                currentAlbum?.songs.some(
                  (song) => song._id === currentSong?._id
                ) ? (
                  <Pause className="h-6 w-6 sm:h-7 sm:w-7" />
                ) : (
                  <Play className="h-6 w-6 sm:h-7 sm:w-7" />
                )}
              </Button>
            </div>

            {/* Songs Table Section */}
            <div className="bg-black/30 backdrop-blur-sm">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-[40px_2fr_1fr_80px] gap-4 px-6 sm:px-8 py-4 text-xs sm:text-sm text-zinc-400 border-b border-white/5 font-medium">
                <div className="text-center">#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div className="flex justify-end items-center gap-2">
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              {/* Songs List */}
              <div className="px-4 sm:px-8 py-2">
                <div className="space-y-1 sm:space-y-2">
                  {currentAlbum?.songs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)}
                        className="grid grid-cols-[40px_1fr_80px] sm:grid-cols-[40px_2fr_1fr_80px] gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 text-sm text-zinc-400 hover:bg-white/10 rounded-md group cursor-pointer transition-colors duration-150"
                      >
                        {/* Index / Play Icon */}
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <span className="text-sm text-green-500">♫</span>
                          ) : (
                            <span className="group-hover:hidden text-xs text-zinc-500">
                              {index + 1}
                            </span>
                          )}
                          {!isCurrentSong && (
                            <Play className="h-4 w-4 hidden group-hover:block text-zinc-300" />
                          )}
                        </div>

                        {/* Song Title and Artist */}
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="h-8 w-8 sm:h-10 sm:w-10 rounded object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div
                              className={`font-medium truncate ${
                                isCurrentSong
                                  ? "text-green-400"
                                  : "text-white group-hover:text-white"
                              }`}
                            >
                              {song.title}
                            </div>
                            <div className="text-xs text-zinc-500 truncate hidden sm:block">
                              {song.artist}
                            </div>
                          </div>
                        </div>

                        {/* Release Date - Hidden on Mobile */}
                        <div className="hidden sm:flex items-center text-zinc-400 text-xs">
                          {song.createdAt.split("T")[0]}
                        </div>

                        {/* Duration */}
                        <div className="flex items-center justify-end">
                          {formatDuration(song.duration)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;
