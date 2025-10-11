import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Fire from "./assets/fire.png";

export function HorizontallyLongRecipes() {
  return (
    <div>
        <div className="h-12"/>
        <div className="pl-4 flex items-center gap-2">
        <div className="text-2xl font-semibold">일반 레시피</div>
        <img src={Fire.src} className="size-6" />
        </div>
        <div className="h-3"/>
      <ScrollArea className="whitespace-nowrap w-[100vw]">
        <div className="pl-4 flex flex-row gap-2 whitespace-normal min-w-[100.5vw]">
            <div className="w-[320] h-[180] overflow-hidden rounded-md">
              <img
                src="https://picsum.photos/id/237/200/300"
                className="block w-full h-full object-cover "
              />
            </div>
            <div className="w-[320] h-[180] overflow-hidden rounded-md">
              <img
                src="https://picsum.photos/id/237/200/300"
                className="block w-full h-full object-cover "
              />
            </div>
            <div className="w-[320] h-[180] overflow-hidden rounded-md">
              <img
                src="https://picsum.photos/id/237/200/300"
                className="block w-full h-full object-cover "
              />
            </div>
        </div>
        
        <ScrollBar orientation="horizontal" className="opacity-0  z-10" />
      </ScrollArea>
      
    </div>
  );
}