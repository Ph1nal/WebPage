export const rand = (a: number, b: number) => a + Math.random() * (b - a);

const P_SVG = {
  carrot:
    '<svg viewBox="0 0 40 40"><path d="M20 35 C14 28 11 18 13 11 C17 8 23 8 27 11 C29 18 26 28 20 35 Z" fill="#F08C4A" stroke="#4A4038" stroke-width="2"/><path d="M20 10 C18 5 14 4 11 5 M20 10 C22 5 26 4 29 5 M20 10 L20 3" stroke="#7CA75B" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>',
  star: '<svg viewBox="0 0 40 40"><path d="M20 4 L24.7 14.6 L36 16 L27.5 23.6 L29.8 35 L20 29 L10.2 35 L12.5 23.6 L4 16 L15.3 14.6 Z" fill="#F2C35C" stroke="#4A4038" stroke-width="2" stroke-linejoin="round"/></svg>',
  heart:
    '<svg viewBox="0 0 40 40"><path d="M20 34 C8 25 5 15 11 11 C15 8.4 19 11 20 14 C21 11 25 8.4 29 11 C35 15 32 25 20 34 Z" fill="#F4A0A0" stroke="#4A4038" stroke-width="2"/></svg>',
};

export type ParticleType = keyof typeof P_SVG;

/** 在页面坐标处绽放一束小粒子（胡萝卜/星星/爱心）。 */
export function burst(
  x: number,
  y: number,
  n = 12,
  types: ParticleType[] = ['carrot', 'star', 'heart'],
) {
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'pt fall';
    const size = rand(13, 22);
    const type = types[Math.floor(Math.random() * types.length)];
    el.style.cssText = `left:${x + rand(-30, 30)}px;top:${y + rand(-20, 10)}px;width:${size}px;height:${size}px;--dx:${rand(-130, 130)}px;--rot:${rand(-360, 360)}deg;--dur:${rand(1.1, 2)}s`;
    el.innerHTML = P_SVG[type];
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}