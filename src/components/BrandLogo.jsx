import { memo } from 'react';

const BrandLogo = memo(function BrandLogo({ className = '', inverted = false }) {
  const tile = inverted ? '#ffffff' : '#0a0a0a';
  const glyph = inverted ? '#0a0a0a' : '#a3e635';

  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      role="img"
      aria-label="BA monogram"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="120" fill={tile} />
      <rect x="14" y="14" width="484" height="484" rx="106" stroke="#a3e635" strokeOpacity="0.4" strokeWidth="6" fill="none" />
      <text
        x="88"
        y="338"
        fontFamily="'Space Grotesk','Arial Black','Helvetica Neue',Arial,sans-serif"
        fontSize="226"
        fontWeight="900"
        letterSpacing="-4"
        fill={glyph}
      >
        BA
      </text>
      <rect x="396" y="200" width="28" height="148" rx="14" fill="#a3e635" />
      <circle cx="448" cy="72" r="12" fill="#a3e635" />
    </svg>
  );
});

export default BrandLogo;
