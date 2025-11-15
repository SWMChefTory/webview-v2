import dynamic from "next/dynamic";
const ReactYouTube = dynamic(() => import("react-youtube"), { ssr: false });
import { useRef, useMemo, useEffect, useImperativeHandle, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export type VideoRefProps = {
  seekTo: ({ time }: { time: number }) => void;
  pause: () => void;
  play: () => void;
  getDuration: () => number | undefined;
//   setGroup: ({ start, end }: { start: number; end: number }) => void;
};

//TODO VideoRef가 로드되지 않았을 때는 어떻게 처리할 것인가??
export const Video = ({
  videoId,
  title,
  isLandscape = false,
  ref,
  onRefReady,
  onInternallyChangeTime,
}: {
  videoId?: string;
  title?: string;
  isLandscape?: boolean;
  ref: React.RefObject<VideoRefProps | null>;
  onRefReady: ()=>void;
  onInternallyChangeTime: (time: number) => void; //내부적으로 바꾸는 현재 유튜브 시간, external바꾸면 무한 루프 위험.
}) => {
  const ytRef = useRef<YT.Player | null>(null);
//   const startRef = useRef<number | null>(null);
//   const endRef = useRef<number | null>(null);
  const [isYtRefReady,setIsYtRefReady] = useState(false); 

  useImperativeHandle(ref, () => {
    return {
      seekTo: ({ time }) => {
        ytRef.current?.seekTo(time, true);
      },
      pause: () => {
        ytRef.current?.pauseVideo();
      },
      play: () => {
        ytRef.current?.playVideo();
      },
      getDuration: () => {
        return ytRef.current?.getDuration();
      },
    //   setGroup: ({ start, end }) => {
    //     console.log("호출!",start,end);
    //     startRef.current = start;
    //     endRef.current = end;
    //   },
    };
  });


//   const handleReady = () => {
//     ytRef.current = event.target;
//     setIsReady(true);
//   };
  
//   useEffect(() => {
//     if (isReady && ref.current) {
//       onRefReady?.();
//     }
//   }, [isReady, ref.current]);

  useEffect(() => {
    if (!ref.current) return;
  
    if(isYtRefReady){
        onRefReady();
    }
  }, [isYtRefReady, ref.current]);

  //   const handleRepeatInGroup = useCallback(
  //     (currentTime: number) => {
  //       if (currentIndex >= steps.length) {
  //         return;
  //       }
  //       const firstStepDetail = steps[currentIndex].details[0];
  //       if (!firstStepDetail) {
  //         return;
  //       }
  //       const start = firstStepDetail.start;
  //       const end =
  //         currentIndex + 1 < steps.length
  //           ? steps[currentIndex + 1].details[0].start
  //           : videoRef.current?.getDuration();
  //       if (!end) {
  //         return;
  //       }
  //     },
  //     [currentIndex, steps]
  //   );

  useEffect(() => {
    let rafId: number;
    function loop() {
      const currentTime = ytRef.current?.getCurrentTime();
      if (currentTime !== undefined) {
        // if (currentTime >= endRef.current || currentTime < startRef.current) {
        //   ytRef.current?.seekTo(startRef.current,true);
        // }
        onInternallyChangeTime(currentTime);
      }
      rafId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [onInternallyChangeTime]);

  const opts = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      autoPlay: 1,
      playerVars: { autoplay: 0 },
      modestbranding: 1,
      rel: 0,
    }),
    []
  );

  return (
    <div className="relative w-full aspect-video bg-black">
      {videoId ? (
        <ReactYouTube
          videoId={videoId}
          opts={opts}
          onReady={(e) => {
            ytRef.current = e.target;
            setIsYtRefReady(true);
          }}
          iframeClassName="absolute inset-0"
          title={`${title ?? ""} 동영상`}
        />
      ) : (
        <Skeleton className="absolute inset-0" />
      )}
    </div>
  );
};
