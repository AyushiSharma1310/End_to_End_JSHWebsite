import React, { useRef, useState } from "react";
import video from "../assets/video.mp4";

const VideoRibbon = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full h-[350px] bg-white rounded-3xl shadow-lg overflow-hidden relative">
        {/* Video */}
        <video
          ref={videoRef}
          src={video}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Mute/Unmute button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 bg-white bg-opacity-70 rounded-full p-2 shadow-lg hover:bg-opacity-100 transition"
        >
          {isMuted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 9l5 5m0 0l-5 5m5-5H9"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 9l5 5m0 0l-5 5m5-5H9"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoRibbon;