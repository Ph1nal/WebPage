/** 角色台词池 */
export const CHAR_LINES: Record<'chi' | 'hachi' | 'usagi', string[]> = {
  chi: ['咔嚓！', '拍好了', '看镜头'],
  hachi: ['好耶', '不错'],
  usagi: ['你好', '好耶'],
};

/** 角色跳跃动画（通过 .jump 类触发，动画结束后自动移除）。 */
export function bounce(host: HTMLElement) {
  const inner = host.querySelector<HTMLElement>('.char-inner');
  if (!inner) return;
  inner.classList.remove('jump');
  void inner.offsetWidth;
  inner.classList.add('jump');
  inner.addEventListener('animationend', () => inner.classList.remove('jump'), {
    once: true,
  });
}

/** 角色头顶弹出拟声气泡，1.2s 后自动消失。 */
export function speak(host: HTMLElement, text: string) {
  const b = document.createElement('span');
  b.className = 'bubble no-snap';
  b.textContent = text;
  host.appendChild(b);
  window.setTimeout(() => b.remove(), 1200);
}

let AC: AudioContext | null = null;

function noiseBurst(ctx: AudioContext, t: number, dur: number, vol: number) {
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const g = ctx.createGain();
  g.gain.value = vol;
  src.connect(g);
  g.connect(ctx.destination);
  src.start(t);
}

/** Web Audio 合成的快门「咔嚓」声。 */
export function shutterSound() {
  try {
    AC =
      AC ||
      new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    if (AC.state === 'suspended') void AC.resume();
    const t = AC.currentTime;
    noiseBurst(AC, t, 0.035, 0.5);
    noiseBurst(AC, t + 0.08, 0.055, 0.32);
  } catch {
    /* ignore */
  }
}

/** 全屏白闪（模拟快门闪光）。 */
export function flash() {
  const f = document.getElementById('flash');
  if (!f) return;
  f.style.transition = 'none';
  f.style.opacity = '.92';
  void f.offsetWidth;
  f.style.transition = 'opacity .3s';
  f.style.opacity = '0';
}