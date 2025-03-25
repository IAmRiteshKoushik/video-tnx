"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  videoUrl480p: string;
  videoUrl720p: string;
}

export default function VideoPlayer({
  videoUrl480p,
  videoUrl720p,
}: VideoPlayerProps) {
  const [resolution, setResolution] = useState<"480p" | "720p">("720p");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const handleResolutionChange = (newResolution: "480p" | "720p") => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setResolution(newResolution);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-black">
        <video
          ref={videoRef}
          src={resolution === "480p" ? videoUrl480p : videoUrl720p}
          className="h-full w-full"
          controls
          autoPlay={true}
        >
          <track kind="captions" />
        </video>
      </div>
      <div className="flex justify-center gap-4 p-4">
        <Button
          variant={resolution === "480p" ? "default" : "outline"}
          onClick={() => handleResolutionChange("480p")}
        >
          480p
        </Button>
        <Button
          variant={resolution === "720p" ? "default" : "outline"}
          onClick={() => handleResolutionChange("720p")}
        >
          720p
        </Button>
      </div>
    </div>
  );
}
