import { HomeIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const LeftSidebar = () => {
  return (
    <div className="h-full flex flex-col gap-2">

        {/* Navigation menu */}

        <div className="rounded-lg bg-zinc-900 p-4">
            <div className="space-y-2">
                <Link to={"/"}
                className={cn(
                    buttonVariants({
                        variant:"ghost",
                        className:"w-full justify-start text-white hover:bg-zinc hover:bg-zinc-800",
                    }))}>
                <HomeIcon className="mr-2 size-5" />
                <span className="hidden md:inline">Home</span>
                </Link>
            </div>


        </div>


    </div>
  )
}

export default LeftSidebar