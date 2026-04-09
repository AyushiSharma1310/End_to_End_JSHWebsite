import { Droplet, Users, GlassWater, CircleCheckBig, Trophy, Waves, Recycle, CloudRain, Leaf, Cpu, Sprout, Mountain, Building } from "lucide-react";
import ImageRibbon from "../components/ImageRibbon";
import { Link } from "react-router-dom";
import TextRibbon from "../components/TextRibbon";
import Timeline from "../components/WaterTimeline";
import VideoRibbon from "../components/VideoRibbon";
import { useState, useEffect } from "react";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [visibleMenuCount, setVisibleMenuCount] = useState(5);

    const menuOptions = [
        { id: "about", label: "About" },
        { id: "focus", label: "Focus Areas" },
        { id: "problems", label: "Problem Statements" },
        { id: "eligibility", label: "Eligibility" },
        { id: "timeline", label: "Timeline" },
        { id: "contact", label: "Contact" },
        { id: "gallery", label: "Gallery" },
        { id: "privacy", label: "Privacy Policy" },
    ];

    const problemStatements = [
        "Smart village-level water budgeting with live supply-demand forecasting.",
        "Low-cost IoT leak detection for rural and urban distribution pipelines.",
        "AI-based groundwater recharge zone mapping for district planning.",
        "Real-time water quality anomaly detection for drinking water networks.",
        "Flood early-warning dashboards integrating rainfall, river, and reservoir data.",
        "Decision support for reservoir release optimization during extreme weather.",
        "Wastewater reuse planning for agriculture and peri-urban communities.",
        "Precision irrigation advisory using weather, soil, and crop-stage intelligence.",
        "Urban stormwater harvesting and recharge optimization for dense cities.",
        "Drought vulnerability scoring and intervention prioritization at block level.",
        "Citizen reporting platform for local water issues with verified escalation.",
        "Digital twin framework for basin-scale integrated water resource management.",
    ];

    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        const role = localStorage.getItem("userRole");
        setIsLoggedIn(loggedIn);
        setUserRole(role);
    }, []);

    useEffect(() => {
        const updateMenuDensity = () => {
            const width = window.innerWidth;

            if (width < 768) {
                setVisibleMenuCount(0);
            } else if (width < 1024) {
                setVisibleMenuCount(3);
            } else if (width < 1280) {
                setVisibleMenuCount(4);
            } else {
                setVisibleMenuCount(5);
            }
        };

        updateMenuDensity();
        window.addEventListener("resize", updateMenuDensity);

        return () => window.removeEventListener("resize", updateMenuDensity);
    }, []);

    const visibleOptions = menuOptions.slice(0, visibleMenuCount);
    const dropdownOptions = menuOptions.slice(visibleMenuCount);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">

            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-white shadow">
                
                <div className="flex items-left gap-3">
                    <Link to="https://www.jalshakti-dowr.gov.in/" target="_blank" rel="noopener noreferrer">
                        <img src="/logos/logo1.png" alt="logo1" className="h-12" />
                    </Link>
                </div>

                <div className="flex items-center gap-3 text-gray-700 font-small">
                    <div className="hidden md:flex items-center gap-6">
                        {visibleOptions.map((option) => (
                            <a key={option.id} href={`#${option.id}`} className="hover:text-blue-600">
                                {option.label}
                            </a>
                        ))}
                    </div>
                    {dropdownOptions.length > 0 && (
                        <div className="relative">
                        <button
                            type="button"
                            className="px-2 text-lg leading-none hover:text-blue-600"
                            aria-label="More menu options"
                            onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                        >
                            ⋮
                        </button>
                        {isMoreMenuOpen && (
                            <div className="absolute right-0 mt-2 w-44 rounded-lg border bg-white shadow-md py-2 z-50">
                                {dropdownOptions.map((option) => (
                                    <a
                                        key={option.id}
                                        href={`#${option.id}`}
                                        className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600"
                                        onClick={() => setIsMoreMenuOpen(false)}
                                    >
                                        {option.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                    )}
                </div>

                <a
                    href="https://bharatwin.mowr.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold text-blue-600 hover:underline"
                >
                    Jal Shakti Hackathon 2025
                </a>

                <div className="flex items-center gap-2">
                    {!isLoggedIn && (
                        <>
                            <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700">
                                Register
                            </Link>
                            <Link to="/login" className="bg-gray-600 text-white px-5 py-2 rounded-xl hover:bg-gray-700">
                                Login
                            </Link>
                        </>
                    )}

                    {(userRole === "admin" || userRole === "owner") && (
                        <Link to="/admin" className="bg-green-600 text-white px-5 py-2 rounded-xl">
                            Dashboard
                        </Link>
                    )}

                    {isLoggedIn && (
                        <button
                            className="bg-red-600 text-white px-5 py-2 rounded-xl"
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = "/";
                            }}
                        >
                            Logout
                        </button>
                    )}
                </div>

                <div className="flex items-right gap-4">
                    <Link to="https://nihroorkee.gov.in/" target="_blank" rel="noopener noreferrer">
                        <img src="/logos/logo2.png" alt="logo2" className="h-10" />
                    </Link>
                    <Link to="https://nihroorkee.gov.in/" target="_blank" rel="noopener noreferrer">
                        <img src="/logos/logo3.png" alt="logo3" className="h-10" />
                    </Link>
                </div>
            </nav>

            {/* HERO */}
            <section 
                id="about"
                className="pt-24 pb-4 px-8 bg-cover bg-center"
                style={{ backgroundImage: "url('../public/bg1.png')" }}
            >
                <div className="max-w-1xl mx-auto grid md:grid-cols-2 gap-1 items-center justify-center ">

                    <div className="flex flex-col items-start text-left gap-6 w-full px-full py-4 shadow-lg rounded-2xl">
                        <h2 className="text-5xl font-bold text-blue-900">
                            Jal Shakti Hackathon 2026 💧
                        </h2>

                        <p className="text-base font-bold text-gray-800 leading-relaxed"
>
                            Bharat WIN is a national initiative of the Department of Water Resources, River Development and Ganga Rejuvenation, Ministry of Jal Shakti, Government of India , aimed at driving meaningful and technology-led transformation in India's water sector. The mission is to accelerate innovation by connecting scientific research, entrepreneurship, and grassroots initiatives to ensure accessibility, affordability, and sustainability. The initiative strengthens the research and innovation ecosystem by providing both institutional and financial support, encouraging development of technologies that can be tested, scaled, and deployed in real-world settings to solve critical water challenges. <br /><br />To nurture innovation, DoWR, RD & GR, MoJS, will organize Jal Shakti Hackathons under Bharat WIN Initiative and invite calls for proposals that inspire creative solutions in priority areas such as water resource management, wastewater treatment, water-use efficiency, climate resilience, flood management, smart monitoring systems, precision agriculture, and urban hydrology. The National Institute of Hydrology (NIH), Roorkee, has been designated as Project Implementation Agency (PIA) for this initiative. The Hackathon winners will be awarded Rs 1 lakh for developing Proof-of-Concept (PoC). The selected proposals will be evaluated further for grant-in-aid.
                        </p>

                        <Link
                            to="/login"
                            className="mt-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
                        >
                            Apply Now
                        </Link>
                    </div>

                    <div className="">
                        <div className="w-full h-full bg-gradient-to-r from-blue-900 to-blue-500 rounded-2xl shadow-lg overflow-hidden relative flex justify-center items-center">
                            <VideoRibbon />
                        </div>
                    </div>
                </div>
            </section>

            {/* RIBBONS */}
            <section id="gallery" className="bg-blue-50">
                <TextRibbon />
                <ImageRibbon />
            </section>
            {/* Hackathon Highlights */}
            <section 
                id="focus"
                className="py-16 px-6 bg-cover bg-center"
                style={{ backgroundImage: "url('../public/bg3.jpg')" }}
            >
                <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
                    Hackathon Highlights
                </h2>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
                        <Droplet className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Rs. 1  Lakh Reward</h4>
                        <p className="text-sm text-gray-600 mt-2">
                            Reward to Hackathon Winners for developing Proof-of-Concept (PoC) in water-related innovations tackling water challenges.
                        </p>
                    </div>

                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
                        <Users className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Grant-in-aid</h4>
                        <p className="text-sm text-gray-600 mt-2">
                            Dedicated funding for developing full scale prototypes/technology.
                        </p>
                    </div>

                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
                        <Trophy className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Gain Recognition and Exposure</h4>
                        <p className="text-sm text-gray-600 mt-2">
                            Showcase your extraordinary AI, IoT, and smart water infrastructure solutions to policy makers.
                        </p>
                    </div>

                </div>
            </section>
            {/* FOCUS AREAS */}
            <section 
                id="focus"
                className="py-16 px-6 bg-cover bg-center"
                style={{ backgroundImage: "url('../public/bg2.jpg')" }}
            >
                <h2 className="text-3xl font-bold text-center mb-12 text-white">
                    Focus Areas
                </h2>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
                        <CircleCheckBig className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Water Resources Assessment and Management</h4>
                    </div>

                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
                        <Recycle className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Waste-water Management</h4>
                    </div>

                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
                        <CloudRain className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Climate Resilience and Adaptation</h4>
                    </div>    
                    
                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
                        <Leaf className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Water Use Efficiency and Circular Economy</h4>
                    </div>    
                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
                        <Cpu className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Smart Water Grids, Internet of Things, and data-driven water (surface and ground) management approaches</h4>
                    </div>    
                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
                        <Mountain className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Efficient Irrigation, Precision Agriculture and Rainwater Harvesting</h4>
                    </div>    
                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
                        <Waves className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">River Basin & Flood Management, Glacial Lake Outburst Floods</h4>
                    </div>    
                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
                        <Building className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Hydrological modelling inclusive of Urban Hydrology</h4>
                    </div>    
                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
                        <GlassWater className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg"> Quality of Water and related issues</h4>
                    </div>    
                    
                </div>
            </section>

            {/* PROBLEM STATEMENTS */}
            <section id="problems"
                className="pt-24 pb-4 px-8 bg-cover bg-center"
                style={{ backgroundImage: "url('../public/bg4.png')" }}>
                <div className="w-full max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-3 text-center bg-amber-100 p-4 rounded-full">
                        Problem Statements
                    </h2>
                    <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto text-sm leading-relaxed bg-amber-50 p-4 rounded-lg shadow-sm">
                        12 challenge logs for participants to pick from.
                    </p>
                    
                    <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-6 shadow-sm">
                        <div className="space-y-3">
                            {problemStatements.map((statement, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-4 rounded-full border border-amber-900/30 px-5 py-4 shadow-md ${
                                        index % 2 === 0 ? "rotate-[0.4deg]" : "-rotate-[0.4deg]"
                                    }`}
                                    style={{
                                        background:
                                            "linear-gradient(180deg, #B8793D 0%, #A66A35 50%, #8D582C 100%)",
                                    }}
                                >
                                    <span className="min-w-[84px] text-sm font-bold text-amber-100">
                                        Prob {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <p className="text-sm text-amber-50">{statement}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ELIGIBILITY */}
            <section id="eligibility" className="py-16 px-6 text-center">
                <h2 className="text-3xl font-bold mb-6">Eligibility</h2>
                <p className="max-w-3xl mx-auto text-gray-600">
                    Open to students, professionals, startups, and innovators across India.
                    Teams must demonstrate innovation, feasibility, and scalability.
                </p>
            </section>

            {/* TIMELINE */}
            <section id="timeline">
                <Timeline />
            </section>

            {/* CONTACT */}
            <section id="contact" className="py-16 px-6 text-center bg-blue-50">
                <h2 className="text-3xl font-bold mb-6">Contact</h2>
                <p className="text-gray-600">
                    Reach out to the organizing team for any queries or support regarding the hackathon.
                </p>
            </section>

            {/* PRIVACY */}
            <section id="privacy" className="py-16 px-6 text-center">
                <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>
                <p className="text-gray-600">
                    Participant data will be handled securely and used strictly for hackathon purposes
                    in compliance with government data policies.
                </p>
            </section>

            {/* FOOTER */}
            <footer className="text-center py-6 text-gray-500 text-sm">
                <div>© 2026 Jal Shakti Hackathon 2.0 | Ministry of Jal Shakti, Government of India</div>

                <div>
                    Total Visitors:
                    <span className="font-bold text-blue-600 ml-1">12,345+</span>
                </div>

                <div>
                    Nodal Implementation Partner:{" "}
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
