// import { Skeleton } from "@/components/ui/skeleton"

// export function LoadingCard() {
//   return (
//     <div className="flex flex-col space-y-3">
//       <Skeleton className="pb-[153%] rounded-xl" />
//       {/* <div className="space-y-2">
//         <Skeleton className="h-4 w-[250px]" />
//         <Skeleton className="h-4 w-[200px]" />
//       </div> */}
//     </div>
//   )
// }
import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500  animate-pulse" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-40 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded" />
        <Skeleton className="h-4 w-32 bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500 rounded" />
      </div>
    </div>
  )
}