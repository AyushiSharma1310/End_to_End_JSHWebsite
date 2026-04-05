const links = [
  { label: "⚠ Important Update: Jal Shakti Hackathon 2026 to begin soon. Registration opens next week.", href: "#alert1" },
  { label: "🚧 Maintenance Notice", href: "#alert2" },
  { label: "📢 Jal Shakti Hackathon 2025 results announced. Kindly login to the portal with your credentials for further details. ", href: "#alert3" },
];

const TextRibbon = () => {
  return (
    <div className="sticky top-16 z-40 bg-yellow-400 text-black py-3 overflow-hidden">
      
      <div className="flex whitespace-nowrap animate-scroll hover:[animation-play-state:paused]">
        
        {/* Repeat multiple times for seamless loop */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-10 px-6">
            {links.map((link, index) => (
              <a
                key={`${i}-${index}`}
                href={link.href}
                className="font-semibold hover:underline shrink-0"
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}

      </div>

    </div>
  );
};

export default TextRibbon;