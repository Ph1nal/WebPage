/**
 * Hero 舞台角色 SVG：举相机的摄影师与猫伙伴。
 * .eye-move / .eye-blink 类由全局指针循环与 CSS 动画驱动。
 */

export function ChiChar({ onCamera }: { onCamera: () => void }) {
  return (
    <svg viewBox="0 0 200 214" role="img" aria-label="举着相机的张奔月">
      <path d="M92 34 C88 22 92 12 99 6" fill="none" stroke="#4A4038" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M102 32 C102 20 97 12 101 4" fill="none" stroke="#4A4038" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M112 33 C114 24 112 16 116 10" fill="none" stroke="#4A4038" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M70 48 C60 34 68 21 82 27" fill="#FFFDF6" stroke="#4A4038" strokeWidth="4" strokeLinejoin="round" />
      <path d="M130 48 C140 34 132 21 118 27" fill="#FFFDF6" stroke="#4A4038" strokeWidth="4" strokeLinejoin="round" />
      <path d="M100 30 C60 30 36 70 36 120 C36 172 64 198 100 198 C136 198 164 172 164 120 C164 70 140 30 100 30 Z" fill="#FFFDF6" stroke="#4A4038" strokeWidth="5" />
      <g className="eye-move"><g className="eye-blink">
        <circle cx="74" cy="103" r="9.5" fill="#3B322B" />
        <circle cx="77.5" cy="99.5" r="3.1" fill="#fff" />
        <circle cx="70.6" cy="106.4" r="1.7" fill="#fff" opacity=".85" />
      </g></g>
      <g className="eye-move"><g className="eye-blink" style={{ animationDelay: '.35s' }}>
        <circle cx="126" cy="103" r="9.5" fill="#3B322B" />
        <circle cx="129.5" cy="99.5" r="3.1" fill="#fff" />
        <circle cx="122.6" cy="106.4" r="1.7" fill="#fff" opacity=".85" />
      </g></g>
      <ellipse cx="55" cy="126" rx="10" ry="6" fill="#F5B8AF" opacity=".9" />
      <ellipse cx="145" cy="126" rx="10" ry="6" fill="#F5B8AF" opacity=".9" />
      <path d="M93 121 Q100 128 107 121" fill="none" stroke="#4A4038" strokeWidth="3.4" strokeLinecap="round" />
      <g className="camera-btn" onClick={onCamera} aria-label="按快门，拍下此刻">
        <rect x="56" y="139" width="88" height="54" rx="11" fill="#5C554E" stroke="#4A4038" strokeWidth="4" />
        <rect x="68" y="130" width="26" height="15" rx="4" fill="#5C554E" stroke="#4A4038" strokeWidth="4" />
        <circle cx="100" cy="166" r="16.5" fill="#EFE7D8" stroke="#4A4038" strokeWidth="4" />
        <circle cx="100" cy="166" r="8.5" fill="#8FB6C6" stroke="#4A4038" strokeWidth="3" />
        <circle cx="96.5" cy="162.5" r="2.4" fill="#fff" opacity=".8" />
        <circle cx="134" cy="151" r="3.6" fill="#F2C35C" stroke="#4A4038" strokeWidth="2.4" />
        <circle className="sh-cap" cx="146" cy="141" r="8" fill="#FFFDF6" stroke="#4A4038" strokeWidth="3.4" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      </g>
      <circle cx="57" cy="141" r="8.5" fill="#FFFDF6" stroke="#4A4038" strokeWidth="3.6" />
      <ellipse cx="74" cy="199" rx="12" ry="7" fill="#FFFDF6" stroke="#4A4038" strokeWidth="4" />
      <ellipse cx="126" cy="199" rx="12" ry="7" fill="#FFFDF6" stroke="#4A4038" strokeWidth="4" />
    </svg>
  );
}

export function HachiChar() {
  return (
    <svg viewBox="0 0 200 210" role="img" aria-label="猫伙伴">
      <defs>
        <clipPath id="hwclip">
          <path d="M100 30 C60 30 36 70 36 120 C36 172 64 198 100 198 C136 198 164 172 164 120 C164 70 140 30 100 30 Z" />
        </clipPath>
      </defs>
      <path d="M70 48 C60 34 68 21 82 27" fill="#8FB6C6" stroke="#4A4038" strokeWidth="4" strokeLinejoin="round" />
      <path d="M130 48 C140 34 132 21 118 27" fill="#FFFDF6" stroke="#4A4038" strokeWidth="4" strokeLinejoin="round" />
      <path d="M100 30 C60 30 36 70 36 120 C36 172 64 198 100 198 C136 198 164 172 164 120 C164 70 140 30 100 30 Z" fill="#FFFDF6" stroke="#4A4038" strokeWidth="5" />
      <ellipse clipPath="url(#hwclip)" cx="76" cy="54" rx="31" ry="23" fill="#8FB6C6" transform="rotate(-16 76 54)" />
      <g className="eye-move"><g className="eye-blink" style={{ animationDelay: '1.2s' }}>
        <circle cx="74" cy="106" r="9.5" fill="#3B322B" />
        <circle cx="77.5" cy="102.5" r="3.1" fill="#fff" />
        <circle cx="70.6" cy="109.4" r="1.7" fill="#fff" opacity=".85" />
      </g></g>
      <g className="eye-move"><g className="eye-blink" style={{ animationDelay: '1.55s' }}>
        <circle cx="126" cy="106" r="9.5" fill="#3B322B" />
        <circle cx="129.5" cy="102.5" r="3.1" fill="#fff" />
        <circle cx="122.6" cy="109.4" r="1.7" fill="#fff" opacity=".85" />
      </g></g>
      <ellipse cx="55" cy="128" rx="10" ry="6" fill="#F5B8AF" opacity=".9" />
      <ellipse cx="145" cy="128" rx="10" ry="6" fill="#F5B8AF" opacity=".9" />
      <path d="M91 122 Q100 130 109 122" fill="none" stroke="#4A4038" strokeWidth="3.6" strokeLinecap="round" />
      <ellipse cx="76" cy="197" rx="12" ry="7" fill="#FFFDF6" stroke="#4A4038" strokeWidth="4" />
      <ellipse cx="124" cy="197" rx="12" ry="7" fill="#FFFDF6" stroke="#4A4038" strokeWidth="4" />
    </svg>
  );
}