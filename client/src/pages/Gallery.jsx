import { Link } from "react-router-dom";
import img1 from "../assets/jsh2025_winners/water1.jpeg";
import img2 from "../assets/jsh2025_winners/water2.jpeg";
import img3 from "../assets/jsh2025_winners/water3.jpeg";
import img4 from "../assets/jsh2025_winners/water4.jpeg";
import img5 from "../assets/jsh2025_winners/b1.png";

export default function Gallery() {
  const images = [img1, img2, img3, img4, img5];

  return (
    <section className="min-h-screen bg-blue-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-blue-900">Gallery</h1>
          <Link
            to="/"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>

        <p className="mb-8 text-gray-700">
          Jal Shakti Hackathon moments and winner highlights.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((src, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg"
            >
              <img
                src={src}
                alt={`Gallery image ${index + 1}`}
                className="h-64 w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
