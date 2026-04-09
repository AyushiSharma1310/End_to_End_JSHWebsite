import { Droplet, Users, GlassWater, CircleCheckBig, ChevronLeft, ChevronRight, Trophy, Waves, Recycle, CloudRain, Leaf, Cpu, Sprout, Mountain, Building } from "lucide-react";
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
        {
            title: "P01: Development of an application for on-the-spot assessment of Rooftop Rainwater Harvesting potential and system design.",
            subpoints: [
                "Development of an application for estimation of rooftop runoff yield and storage requirements. The system shall generate harvesting potential and site-specific design parameters considering rainfall statistics, sub surface details, groundwater table, roof area, and demand."
            ],
        },
        {
            title: "P02:Development of a small-scale cost-effective and sustainable plastic waste disposal system.",
            subpoints: [
                "Development of a decentralized, low-cost system for segregation, volume reduction, and environmentally compliant processing of plastic waste. The solution shall emphasize energy efficiency, minimal secondary emissions, and operational scalability. These systems are useful to minimise soil and water contamination."
            ],
        },
        {
            title: "P03: Development of a floating sensor-based system for automated recording of river water levels and quality, and its transmission.",
            subpoints: ["Design of a floating sensor for continuous measurement of river water levels and physicochemical parameters. The system shall enable wireless transmission/telemetry/IoT, and centralized data management."],
        },
        {
            title: "P04: Smart river water level and quality surveillance system with UAVs.",
            subpoints: [
                "Development of an unmanned aerial vehicle (UAV) enabled monitoring framework for acquisition of river stage and in-situ water quality parameters through image processing. The system shall integrate onboard sensors, real-time telemetry, and processing modules to derive the river water level and quality parameters."
            ],
        },
        {
            title: "P05: Development of a decentralized wastewater treatment system for safe disposal and reuse.",
            subpoints: [
                "Development of decentralized wastewater treatment system is for safe disposal of grey and black water. The system shall ensure compliance with the Government of India guidelines and standards. These systems reduce significant pollution load on rivers, water bodies and groundwater."
            ],
        },
        {
            title: "P06: Development of a portable device for the detection of chemical and bacteriological water quality parameters.",
            subpoints: [
                "Development of a portable device for the detection of chemical and bacteriological water quality parameters. The system shall enable real-time monitoring and data transmission for informed decision-making."
            ],
        },
        {
            title: "P07: Development of an early warning system for Glacial Lake Outburst Floods (GLOFs) and urban flooding.",
            subpoints: [
                "Development of an integrated early warning system combining remote sensing, hydrodynamic modelling, IoT and real-time data. The system shall enable predictive risk assessment, alerts/warnings, and decision support."
            ],
        },
        {
            title: "P08: Development of a system for assessing Water Use Efficiency (WUE) for irrigation systems, individual houses, apartments, gated communities, and industries.",
            subpoints: [
                "Development of a system for assessment of water use efficiency across irrigation, residential, and industrial sectors. The system shall integrate metering data/releases/supply, usage, and performance indicators to suggest optimized water management."
            ],
        },
        {
            title: "P09: Development of advanced tools and techniques for the management of water resources and safe drinking water.",
            subpoints: [
                "Development of advanced tools/techniques and decision-support systems for water resources management and ensuring safe drinking water. The system shall leverage modelling, IoT, AI and real-time data for generating best management scenarios."
            ],
        },
        {
            title: "P10: Development of Energy Efficient Sludge Drying and Thickening System.",
            subpoints: [
                "Development of an energy-efficient sludge drying and thickening system for wastewater treatment. The system shall ensure optimal performance while minimizing energy consumption and environmental impact."
            ],
        },
        {
            title: "P11: Development of a Solution for Characterization of Sludge.",
            subpoints: [
                "Characterization of sludge is very important for deciding upon its end use. System is to be developed for complete characterization of sludge instantaneously and bringing out different metals present in it, it can help in deciding the final use of sludge. In case complete characterization is difficult, the presence of heavy metal may be brought out by the system."
            ],
        },
        {
            title: "P12: Development of Process for FCO Compliant Soil Conditioner from Sludge.",
            subpoints: [
                "The use of sludge as a soil conditioner to enrich the soil nutrients and help in improving the productivity is an aspirational goal. An efficient cost effective process/technology may be developed for producing FCO compliant sludge."
            ],
        },


    ];

    const guidelines = [
        "Ensure that all submitted proposals clearly define the problem statement and proposed solution with measurable impact.",

        "Participants must register individually or in teams before submitting any project-related documents or prototypes.",

        "All submissions should strictly adhere to the prescribed format and include relevant documentation, datasets, and references.",

        "Teams are encouraged to focus on innovative, scalable, and sustainable solutions aligned with real-world challenges.",

        "Any form of plagiarism or use of unauthorized third-party content will lead to immediate disqualification.",

        "Participants must ensure that their solutions are technically feasible and can be implemented within practical constraints.",

        "Regular updates and progress submissions may be required during different phases of the hackathon timeline.",

        "Teams should be prepared to present their solutions with a working prototype or a well-defined simulation model.",

        "Judging criteria will include innovation, feasibility, impact, scalability, and presentation quality.",
        "Judging criteria will include innovation, feasibility, impact, scalability, and presentation quality."];


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
    const [activeGuideline, setActiveGuideline] = useState(0);

    const [visibleGuidelines, setVisibleGuidelines] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleGuidelines((prev) => {
                if (prev.length >= guidelines.length) {
                    clearInterval(interval);
                    return prev;
                }
                return [...prev, guidelines[prev.length]];
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">

            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-white shadow">

                <div className="flex items-left gap-3">
                    <Link to="https://www.jalshakti-dowr.gov.in/" target="_blank" rel="noopener noreferrer">
                        <img src="/logos/logo1.png" alt="logo1" className="h-12" />
                    </Link>
                </div>

                <div className="flex items-center gap-3 text-gray-700 font-mediium">
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
                <div className="group mb-12 text-center">
                    <h2 className="text-3xl font-bold text-blue-900">
                        Hackathon Highlights
                    </h2>
                    <p className="mx-auto mt-2 max-w-3xl overflow-hidden text-sm leading-relaxed text-blue-900/80 opacity-0 transition-all duration-300 max-h-0 group-hover:max-h-24 group-hover:opacity-100">
                        Key benefits for participants including rewards, grant support, and national-level visibility for impactful water innovation.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]">
                        <Droplet className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Rs. 1  Lakh Reward</h4>
                        <p className="text-sm text-gray-600 mt-2">
                            Reward to Hackathon Winners for developing Proof-of-Concept (PoC) in water-related innovations tackling water challenges.
                        </p>
                    </div>

                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]">
                        <Users className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Grant-in-aid</h4>
                        <p className="text-sm text-gray-600 mt-2">
                            Dedicated funding for developing full scale prototypes/technology.
                        </p>
                    </div>

                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]">
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
                <div className="group mb-12 text-center">
                    <h2 className="text-3xl font-bold text-yellow-900">
                        Focus Areas
                    </h2>
                    <p className="mx-auto mt-2 max-w-3xl overflow-hidden text-sm leading-relaxed text-yellow-900 opacity-0 transition-all duration-300 max-h-0 group-hover:max-h-24 group-hover:opacity-100">
                        Priority domains where teams can frame high-impact solutions in assessment, efficiency, resilience, monitoring, and water quality.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]">
                        <CircleCheckBig className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Water Resources Assessment and Management</h4>
                    </div>

                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]">
                        <Recycle className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Waste-water Management</h4>
                    </div>

                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]">
                        <CloudRain className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Climate Resilience and Adaptation</h4>
                    </div>

                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]">
                        <Leaf className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Water Use Efficiency and Circular Economy</h4>
                    </div>
                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]">
                        <Cpu className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Smart Water Grids, Internet of Things, and data-driven water (surface and ground) management approaches</h4>
                    </div>
                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]">
                        <Mountain className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Efficient Irrigation, Precision Agriculture and Rainwater Harvesting</h4>
                    </div>
                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]">
                        <Waves className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">River Basin & Flood Management, Glacial Lake Outburst Floods</h4>
                    </div>
                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]">
                        <Building className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg">Hydrological modelling inclusive of Urban Hydrology</h4>
                    </div>
                    <div className="bg-white/90 rounded-2xl shadow p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]">
                        <GlassWater className="mx-auto mb-4 text-blue-500" size={40} />
                        <h4 className="font-semibold text-lg"> Quality of Water and related issues</h4>
                    </div>

                </div>
            </section>

            {/* PROBLEM STATEMENTS */}
            <section id="problems"
                className="pt-24 pb-4 px-8 bg-cover bg-center"
                style={{ backgroundImage: "url('../public/bg4.png')" }}>
                <div className="w-full max-w-9xl mx-auto">
                    <div className="group mb-10 text-center">
                        <h2 className="text-3xl font-bold mb-2 pt-6 text-white">
                            Problem Statements
                        </h2>
                        <p className="max-w-3xl mx-auto text-gray-600 overflow-hidden opacity-0 transition-all duration-300 max-h-0 group-hover:max-h-20 group-hover:opacity-100 pt-2 pb-6 text-sm text-white/90">
                            Applicants may formulate their problem statements by identifying water-related issues, preferably aligned with the given Focus Areas. A few identified problem statements are provided below, which may also be used as a basis for developing new ideas.
                        </p>
                    </div>

                    <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-6 shadow-sm">
                        <div className="space-y-3">
                            {problemStatements.map((statement, index) => {
                                const title =
                                    typeof statement === "string" ? statement : statement.title;
                                const description =
                                    typeof statement === "string"
                                        ? ""
                                        : statement.paragraph || statement.subpoints?.join(" ");

                                return (
                                    <div
                                        key={index}
                                        className={`group rounded-2xl border border-amber-900/30 px-5 py-4 shadow-md ${index % 2 === 0 ? "rotate-[0.4deg]" : "-rotate-[0.4deg]"
                                            }`}
                                        style={{
                                            background:
                                                "linear-gradient(180deg, #B8793D 0%, #A66A35 50%, #8D582C 100%)",
                                        }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <span className="min-w-[84px] pt-0.5 text-sm font-bold text-amber-100">
                                                Prob {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <p className="text-sm font-semibold leading-relaxed text-amber-50">
                                                {title}
                                            </p>
                                            <span className="ml-auto text-amber-100 transition-transform duration-200 group-hover:rotate-180">
                                                ▾
                                            </span>
                                        </div>

                                        {description && (
                                            <p className="max-h-0 overflow-hidden pl-[100px] text-xs leading-relaxed text-amber-100 opacity-0 transition-all duration-300 group-hover:mt-3 group-hover:max-h-40 group-hover:opacity-100">
                                                {description}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>


            {/* GUIDELINES */}
            <section id="guidelines" className="py-16 px-6 relative bg-cover bg-center"
                style={{ backgroundImage: "url('/bg6.jpeg')" }}
            >
                <div className="group max-w-6xl mx-auto text-center">

                    <h2 className="text-3xl font-bold mb-2 pt-6 text-blue-900">
                        Guidelines
                    </h2>
                    <p className="max-w-3xl mx-auto text-blue-900 overflow-hidden opacity-0 transition-all duration-300 max-h-0 group-hover:max-h-20 group-hover:opacity-100 pt-2 pb-6 text-sm">
                        Open to students, professionals, startups, and innovators across India. Teams must demonstrate innovation, feasibility, and scalability.
                    </p>
                    <div className="grid grid-cols-2 gap-6">

                        {/* LEFT COLUMN */}
                        <div className="space-y-4">
                            {visibleGuidelines
                                .filter((_, i) => i % 2 === 0)
                                .map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/90 backdrop-blur-md p-4 rounded-xl text-sm text-left
shadow-md transition-all duration-300 ease-in-out
hover:scale-105 hover:shadow-[0_0_25px_rgba(29,78,216,0.7)]"
                                    >
                                        <span className="font-semibold text-blue-700">
                                            Guideline {index * 2 + 1}:
                                        </span>{" "}
                                        {item}
                                    </div>
                                ))}
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-4">
                            {visibleGuidelines
                                .filter((_, i) => i % 2 !== 0)
                                .map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/90 backdrop-blur-md p-4 rounded-xl text-sm text-left
shadow-md transition-all duration-300 ease-in-out
hover:scale-105 hover:shadow-[0_0_25px_rgba(29,78,216,0.7)]"
                                    >
                                        <span className="font-semibold text-blue-700">
                                            Guideline {index * 2 + 2}:
                                        </span>{" "}
                                        {item}
                                    </div>
                                ))}
                        </div>

                    </div>

                </div>
            </section>

            {/* ELIGIBILITY */}
            <section id="eligibility" className="py-16 px-6 text-center">
                <div className="group">
                    <h2 className="text-3xl font-bold mb-2">Eligibility</h2>
                    <p className="max-w-3xl mx-auto text-gray-600 overflow-hidden opacity-0 transition-all duration-300 max-h-0 group-hover:max-h-20 group-hover:opacity-100">
                        Open to students, professionals, startups, and innovators across India. Teams must demonstrate innovation, feasibility, and scalability.
                    </p>
                </div>
            </section>

            {/* TIMELINE */}
            <section id="timeline">
                <div className="group px-6 pt-8 text-center">
                    <h2 className="text-3xl font-bold mb-2">Timeline</h2>
                    <p className="mx-auto max-w-3xl text-gray-600 overflow-hidden opacity-0 transition-all duration-300 max-h-0 group-hover:max-h-20 group-hover:opacity-100">
                        Track the end-to-end schedule from registrations to evaluation and final outcomes.
                    </p>
                </div>
                <Timeline />
            </section>

            {/* CONTACT */}
            <section id="contact" className="py-16 px-6 text-center bg-blue-50">
                <div className="group">
                    <h2 className="text-3xl font-bold mb-2">Contact</h2>
                    <p className="text-gray-600 overflow-hidden opacity-0 transition-all duration-300 max-h-0 group-hover:max-h-20 group-hover:opacity-100">
                        Reach out to the organizing team for any queries or support regarding the hackathon.
                    </p>
                </div>
            </section>

            {/* PRIVACY */}
            <section id="privacy" className="py-16 px-6 text-center">
                <div className="group">
                    <h2 className="text-3xl font-bold mb-2">Privacy Policy</h2>
                    <p className="text-gray-600 overflow-hidden opacity-0 transition-all duration-300 max-h-0 group-hover:max-h-20 group-hover:opacity-100">
                        Participant data will be handled securely and used strictly for hackathon purposes in compliance with government data policies.
                    </p>
                </div>
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
