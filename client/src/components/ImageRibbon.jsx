import React from "react";
import { useNavigate } from "react-router-dom";

import img1 from "../assets/jsh2025_winners/water1.jpeg";
import img2 from "../assets/jsh2025_winners/water2.jpeg";
import img3 from "../assets/jsh2025_winners/water3.jpeg";
import img4 from "../assets/jsh2025_winners/water4.jpeg";
import img5 from "../assets/jsh2025_winners/b1.png";

export default function ImageRibbon() {
  const navigate = useNavigate();

  const images = [img1, img2, img3, img4, img5];
  const loopImages = [...images, ...images];

  return (
    <div
      onClick={() => navigate("/gallery")}
      className="overflow-hidden bg-blue-50 py-2 cursor-pointer group"
    >
      <div className="flex animate-scroll whitespace-nowrap w-max group-hover:[animation-play-state:paused]">
        
        {loopImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="ribbon"
            className="h-[300px] w-auto object-cover"
          />
        ))}

      </div>

      {/* 🔥 Optional overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
        <span className="bg-black/50 text-white px-4 py-2 rounded-lg font-semibold">
          View Jal Shakti Hackathon 2025 Award Ceremony Gallery
        </span>
      </div>
    </div>
  );
}