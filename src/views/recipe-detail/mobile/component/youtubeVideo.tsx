import dynamic from "next/dynamic";
import { useMemo, useRef } from "react";

const ReactYouTube = dynamic(() => import("react-youtube"), { ssr: false });

const YoutubeVideo = ({
  videoId,
  title,
  containerRef,
  onPlayerReady,
}: {
  videoId?: string;
  title?: string;
  containerRef?: React.RefObject<HTMLDivElement>;
  onPlayerReady?: (p: YT.Player) => void;
}) => {
  const ytRef = useRef<YT.Player | null>(null);

  const opts = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      playerVars: { autoplay: 0 },
    }),
    []
  );

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-black">
      {videoId ? (
        <ReactYouTube
          videoId={videoId}
          opts={opts}
          onReady={(e) => {
            ytRef.current = e.target;
            onPlayerReady?.(e.target);
          }}
          iframeClassName="absolute top-0 left-0 w-full h-full border-0"
          title={`${title ?? ""} 동영상`}
        />
      ) : (
        <div className="w-full h-full bg-gray-100" />
      )}
    </div>
  );
};

const VideoPadding = () => {
  return <div className="w-full aspect-video" />;
};

export { YoutubeVideo, VideoPadding };
