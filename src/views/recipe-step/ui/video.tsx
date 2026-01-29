import dynamic from "next/dynamic";
const ReactYouTube = dynamic(() => import("react-youtube"), { ssr: false });
import { useRef, useMemo, useEffect, useImperativeHandle } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export type VideoRefProps = {
  seekTo: ({ time }: { time: number }) => void;
  pause: () => void;
  play: () => void;
  getDuration: () => number | undefined;
};

//TODO VideoRef가 로드되지 않았을 때는 어떻게 처리할 것인가??
export const Video = ({
  videoId,
  title,
  isLandscape = true,
  ref,
  isShorts = false,
  onInternallyChangeTime,
}: {
  videoId?: string;
  title?: string;
  isLandscape?: boolean;
  ref: React.RefObject<VideoRefProps | null>;
  isShorts?: boolean;
  onInternallyChangeTime: (time: number) => void; //내부적으로 바꾸는 현재 유튜브 시간, external바꾸면 무한 루프 위험.
}) => {
  const ytRef = useRef<YT.Player | null>(null);

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
    };
  });

  useEffect(() => {
    let rafId: number;
    function loop() {
      const currentTime = ytRef.current?.getCurrentTime();
      if (typeof currentTime === "number") {
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
      playerVars: { autoplay: 0, rel: 0 },
      modestbranding: 1,
      rel: 0,
    }),
    []
  );

  if (isShorts) {
    return (
      <div className={`flex shrink-0 relative w-full h-[64%]`}>
        {videoId ? (
          <ReactYouTube
            videoId={videoId}
            opts={opts}
            onReady={(e) => {
              ytRef.current = e.target;
            }}
            iframeClassName="absolute inset-0 z-0"
            title={`${title ?? ""} 동영상`}
          />
        ) : (
          <Skeleton className="absolute inset-0" />
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex z-[0] shrink-0 ${
        isLandscape
          ? "w-[64%] lg:w-[60%] h-full items-center justify-center"
          : "w-full"
      }`}
    >
      <div className="relative w-full aspect-video lg:rounded-lg lg:overflow-hidden">
        {videoId ? (
          <ReactYouTube
            videoId={videoId}
            opts={opts}
            onReady={(e) => {
              ytRef.current = e.target;
            }}
            iframeClassName="absolute inset-0 z-0"
            title={`${title ?? ""} 동영상`}
          />
        ) : (
          <Skeleton className="absolute inset-0" />
        )}
      </div>
    </div>
  );
};
