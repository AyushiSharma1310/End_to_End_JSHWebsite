import { useState } from "react";
import kidImg from "../assets/kid.png";

const timelineData = [
  { date: "1 May 2026", title: "Registrations Open" },
  { date: "30 June 2026", title: "Registrations Close" },
  { date: "1 July 2026", title: "Hackathon Begins" },
  { date: "09-10 July 2026", title: "Proposal Presentation" },
  { date: "01 August 2026", title: "Results Announced" },
  { date: "15 August 2026", title: "Award Ceremony" },
  { date: "31 August 2026", title: "PoC Submission" },
];

const WaterTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const waterLevel = ((activeIndex + 1) / timelineData.length) * 100;

  return (
    <div className="group px-6 pt-8 pb-8 text-center "
    style={{ backgroundImage: "url('/bg8.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
>
     
      <div className="flex flex-col md:flex-row items-center justify-center gap-28">

        {/* LEFT: Visual */}
        <div className="flex items-end gap-8">

          {/* 🚰 Tap + Bucket */}
          <div className="flex flex-col items-center">

            {/* Tap */}
            <div className="relative">
              <div className="w-20 h-8 bg-gray-700 rounded"></div>
              <div className="w-8 h-14 bg-gray-700 mx-auto"></div>

              {/* Water stream */}
              <div className="absolute top-full left-1/2 -translate-x-1/2">
                <div className="w-3 h-40 bg-blue-400 animate-pulse rounded-full"></div>
              </div>
            </div>

            {/* Bucket */}
            <div className="relative mt-32 w-52 h-72 border-4 border-gray-700 rounded-b-3xl overflow-hidden bg-white">

              {/* Water fill */}
              <div
                className="absolute bottom-0 w-full bg-blue-500 transition-all duration-700 ease-in-out"
                style={{ height: `${waterLevel}%` }}
              />

              {/* Stage + Date */}
              <div className="absolute top-4 w-full text-center px-2">
                <div className="text-sm text-blue-700 font-semibold">
                  Event Stage
                </div>

                <div className="text-lg font-semibold">
                  {timelineData[activeIndex].title}
                </div>

                <div
                  className={`text-lg font-bold ${
                    waterLevel > 80 ? "text-white" : "text-black"
                  }`}
                >
                  {timelineData[activeIndex].date}
                </div>
              </div>

            </div>
          </div>

          {/* 🧒 Kid (OUTSIDE bucket) */}
          <img
            src={kidImg}
            alt="Kid collecting water"
            className="w-36 h-52 object-contain -mb-2 animate-bounce"
          />

        </div>

        {/* RIGHT: Timeline */}
        <div className="flex flex-col gap-4">
          {timelineData.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`text-left px-6 py-4 text-lg font-medium rounded-lg border transition ${
                index <= activeIndex
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-blue-100"
              }`}
            >
              <div className="font-semibold">{item.title}</div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default WaterTimeline;