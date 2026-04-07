import React, { useRef } from "react";
import video from "../assets/video.mp4";

const VideoRibbon = () => {
  const videoRef = useRef(null);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full h-[350px] bg-black rounded-3xl shadow-lg overflow-hidden relative">
        {/* Video */}
        <video
          ref={videoRef}
          src={video}
          loop
          playsInline
          controls
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default VideoRibbon;