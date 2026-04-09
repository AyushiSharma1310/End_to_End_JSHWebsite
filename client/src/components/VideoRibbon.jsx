import React, { useRef } from "react";
import video from "../assets/video.mp4";

const VideoRibbon = () => {
  const videoRef = useRef(null);

  return (
    <div className="flex justify-center items-center px-4 py-4 bg-gradient-to-r from-blue-900 to-blue-500 rounded-2xl shadow-lg overflow-hidden relative ">
      <div className="bg-black rounded-2xl shadow-lg overflow-hidden relative flex justify-center items-center">
        {/* Video */}
        <video
          ref={videoRef}
          src={video}
          loop
          playsInline
          controls
          className="object-cover rounded-3xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default VideoRibbon;