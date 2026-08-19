import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, Music, Users } from "lucide-react";
import { useEffect } from "react";

const FriendsActivity = () => {
  const { users, fetchUsers } = useChatStore();
  const { user } = useUser();

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  // Temporary value until the real activity functionality is added
  const isPlaying = true;

  return (
    <div className="h-full bg-zinc-900 rounded-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-zinc-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Users className="size-5 shrink-0 text-emerald-400" />
          <h2 className="font-semibold text-sm">What they're listening to</h2>
        </div>
      </div>

      {!user && <LoginPrompt />}

      {user && (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {/* User Avatar with Status */}
                  <div className="relative flex-shrink-0">
                    <Avatar className="size-10 border border-zinc-800">
                      <AvatarImage src={user.imageUrl} alt={user.fullName} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>

                    {isPlaying && (
                      <div
                        className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 bg-emerald-500 animate-pulse"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm text-white truncate">
                        {user.fullName}
                      </span>
                      {isPlaying && (
                        <Music className="size-3 text-emerald-400 shrink-0" />
                      )}
                    </div>

                    {isPlaying ? (
                      <div className="space-y-2">
                        {/* Album Art (Optional) */}
                        <div className="w-full h-12 bg-zinc-800 rounded overflow-hidden flex items-center gap-2 p-1.5">
                          <div className="w-10 h-10 bg-zinc-700 rounded flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-white truncate">
                              Cardigan
                            </div>
                            <div className="text-xs text-zinc-400 truncate">
                              Taylor Swift
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-zinc-400">Idle</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default FriendsActivity;

const LoginPrompt = () => (
  <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
    <div className="relative">
      <div
        className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg opacity-75 animate-pulse"
        aria-hidden="true"
      />

      <div className="relative bg-zinc-900 rounded-full p-4">
        <HeadphonesIcon className="size-8 text-emerald-400" />
      </div>
    </div>

    <div className="space-y-2 max-w-[250px]">
      <h3 className="text-lg font-semibold text-white">
        See What Friends Are Playing
      </h3>

      <p className="text-sm text-zinc-400">
        Login to discover what music your friends are enjoying right now
      </p>
    </div>
  </div>
);
