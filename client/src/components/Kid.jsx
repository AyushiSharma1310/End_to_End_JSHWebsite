const Kid = () => {
  return (
    <div className="w-32 h-48">
      <svg viewBox="0 0 120 200" className="w-full h-full">
        
        {/* Head */}
        <circle cx="60" cy="40" r="20" fill="#f4c2a1" />

        {/* Body */}
        <rect x="40" y="60" width="40" height="60" rx="10" fill="#3b82f6" />

        {/* Arms */}
        <line x1="40" y1="70" x2="20" y2="100" stroke="#f4c2a1" strokeWidth="6" />
        <line x1="80" y1="70" x2="100" y2="100" stroke="#f4c2a1" strokeWidth="6" />

        {/* Legs */}
        <line x1="50" y1="120" x2="50" y2="170" stroke="#1f2937" strokeWidth="6" />
        <line x1="70" y1="120" x2="70" y2="170" stroke="#1f2937" strokeWidth="6" />

        {/* Eyes */}
        <circle cx="52" cy="35" r="2" fill="#000" />
        <circle cx="68" cy="35" r="2" fill="#000" />

      </svg>
    </div>
  );
};

export default Kid;