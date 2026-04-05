import { Droplet, Users, Trophy } from "lucide-react";
import ImageRibbon from "../components/ImageRibbon";
import { Link } from "react-router-dom";
import TextRibbon from "../components/TextRibbon";
import Timeline from "../components/WaterTimeline";
import img1 from "../assets/jsh2025_winners/water1.jpeg";
import img2 from "../assets/jsh2025_winners/water2.jpeg";
import img3 from "../assets/jsh2025_winners/b1.png";
export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">

            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-white shadow">

                {/* Left Section */}
                <div className="flex items-left gap-3">
                    <img src="/logos/logo1.png" alt="logo1" className="h-12" />
                </div>

                

                {/* Title Link */}
                <a
                    href="https://bharatwin.mowr.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold text-blue-600 hover:underline"
                >
                    Jal Shakti Hackathon 2025
                </a>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                    <Link
                        to="/login"
                        className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                        Register
                    </Link>

                    <button
                        className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                        onClick={() => {
                            localStorage.removeItem("isLoggedIn");
                            window.location.href = "/";
                        }}
                    >
                        Logout
                    </button>
                </div>
                        {/* Center Menu */}
                <div className="hidden md:flex items-center gap-6 text-gray-700 font-small">
                    <a href="#about" className="hover:text-blue-600 transition">About</a>
                    <a href="#focus" className="hover:text-blue-600 transition">Focus Areas</a>
                    <a href="#problems" className="hover:text-blue-600 transition">Problem Statements</a>
                    <a href="#eligibility" className="hover:text-blue-600 transition">Eligibility</a>
                    <a href="#timeline" className="hover:text-blue-600 transition">Timeline</a>
                    <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
                    <a href="#privacy" className="hover:text-blue-600 transition">Privacy Policy</a>
                </div>
                {/* Right Section */}
                <div className="flex items-right gap-4">
                    <img src="/logos/logo2.png" alt="logo2" className="h-10" />
                    <img src="/logos/logo3.png" alt="logo3" className="h-10" />
                </div>

            </nav>

            {/* HERO */}
            <section className="pt-32 py-20 px-8">

                <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">

                    {/* LEFT: Content */}
                    <div className="flex flex-col items-start text-left gap-6 max-w-xl">

                        <h2 className="text-4xl md:text-5xl font-bold text-blue-700">
                            Jal Shakti Hackathon 2026 💧
                        </h2>

                        <p className="text-lg text-gray-600">
                            Build solutions using AI, IoT, and Data Science to solve real-world water challenges.
                        </p>

                        <Link
                            to="/login"
                            className="mt-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
                        >
                            Join Hackathon 2026
                        </Link>

                    </div>

                    {/* RIGHT: Ribbon */}
                    <div className="overflow-hidden w-full md:w-1/2">

                        <div className="flex w-[100%] animate-slideImages">

                            {[img1, img2, img3].map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt="ribbon"
                                    className="w-full h-full object-cover flex-shrink-0"
                                />
                            ))}

                        </div>

                    </div>

                </div>

            </section>

            {/* RIBBONS */}
            <TextRibbon />
            <ImageRibbon />

            {/* THEMES */}
            <section className="py-16 px-6 bg-blue-50">
                <h2 className="text-3xl font-bold text-center mb-12 animate-fadeUp">
                    Focus Areas
                </h2>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                    <div className="bg-white rounded-2xl shadow p-6 text-center">
                        <Droplet className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Water Conservation</h4>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6 text-center">
                        <Users className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Community Impact</h4>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6 text-center">
                        <Trophy className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Innovation</h4>
                    </div>

                </div>
            </section>

            {/* TIMELINE */}
            <Timeline />

            {/* FOOTER */}
            <footer className="text-center py-6 text-gray-500 text-sm">

                <div>© 2026 Jal Shakti Hackathon 2.0</div>

                <div>
                    Visitors:
                    <span className="font-bold text-blue-600 ml-1">12345</span>
                </div>

                <div>
                    Project Implementation Agency (PIA):{" "}
                    <a
                        href="https://www.nihroorkee.gov.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        National Institute of Hydrology, Roorkee
                    </a>
                </div>

            </footer>

        </div>
    );
}