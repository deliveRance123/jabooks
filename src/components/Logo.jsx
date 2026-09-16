export default function Logo({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-xl shadow-md ${className}`}
    >
      <defs>
        {/* Background Gradient */}
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B0F19" />
          <stop offset="50%" stopColor="#111827" />
          <stop offset="100%" stopColor="#070A11" />
        </linearGradient>

        {/* Gold Emblem Gradient */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* Subtle Inner Glow */}
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#78350F" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Outer Hexagon / Architectural Shield Background */}
      <rect x="2" y="2" width="96" height="96" rx="24" fill="url(#bgGrad)" stroke="url(#borderGrad)" strokeWidth="3" />

      {/* Geometric Open Book Spine Wings */}
      <path
        d="M26 68C34 65 44 65 50 69C56 65 66 65 74 68V34C66 31 56 31 50 35C44 31 34 31 26 34V68Z"
        fill="url(#goldGrad)"
        fillOpacity="0.15"
        stroke="url(#goldGrad)"
        strokeWidth="2"
      />

      {/* Central Monogram: Stylized Intertwined "J" & "A" with Quill Apex */}
      {/* 'A' Arch */}
      <path
        d="M50 22L33 64H41L50 41L59 64H67L50 22Z"
        fill="url(#goldGrad)"
      />

      {/* 'A' Crossbar fused with Crown */}
      <path
        d="M40 52H60"
        stroke="#0B0F19"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* 'J' Sinuous Loop curving from top through center */}
      <path
        d="M50 28V53C50 61 44 64 38 64C34 64 31 62 30 60"
        stroke="url(#goldGrad)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Pinnacle North Star / Diamond */}
      <path
        d="M50 14L52.5 19L50 24L47.5 19L50 14Z"
        fill="#FDE68A"
      />
    </svg>
  );
}
