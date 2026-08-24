import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore"

const UsersList = () => {
    const { users,selectedUser,isLoading,setSelectedUser,onlineUsers }=useChatStore();


  return (
    <div className="border-r border-zinc-800">
        <div className="flex flex-col h-full">
            <ScrollArea className="h-[calc(100vh-280px)]">

                <div className="space-y-2 p-4">
                    {isLoading ? (
                        <UsersListSkeleton />
                    ):(
                        users.map((user)=>(
                            <div key={user._id}>
                                </div>
                        ))
                    )}


                </div>
            </ScrollArea>


        </div>


    </div>
  )
}

export default UsersList