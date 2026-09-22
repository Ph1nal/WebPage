import { useCallback, useEffect, useRef, useState } from 'react';
import { burst } from '@/lib/particles';
import { bounce, speak } from '@/lib/interactions';
import { toast } from '@/lib/toast';

const LINES = ['你好', '好耶'];
const LINES_MAX = ['耶！'];

/** 右下角形象：construct.pdf 卡通兔子（抠图 PNG），点击跳跃撒粒子。 */
export default function MomoCorner() {
  const ref = useRef<HTMLDivElement>(null);
  const hits = useRef(0);
  const [hinted, setHinted] = useState(true);

  // 轻微跟随指针
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    let raf = 0;
    const tick = () => {
      const r = root.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.4;
      const dx = tx - cx;
      const dy = ty - cy;
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 220) * 5;
      root.style.setProperty('--follow-x', `${((dx / d) * k).toFixed(1)}px`);
      root.style.setProperty('--follow-rot', `${((dx / d) * k * 0.25).toFixed(2)}deg`);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onClick = useCallback(() => {
    const host = ref.current;
    if (!host) return;
    hits.current += 1;
    setHinted(false);
    const pool = hits.current >= 5 ? LINES_MAX : LINES;
    bounce(host);
    speak(host, pool[Math.floor(Math.random() * pool.length)]);
    const r = host.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.25, 14, ['carrot', 'star']);
    if (hits.current === 5) toast('已经点了很多次啦');
  }, []);

  return (
    <div id="momo" className="char no-snap" ref={ref} onClick={onClick}>
      {hinted && <span className="hint">点我 →</span>}
      <div className="char-inner">
        <img
          src="/images/mascot.png"
          alt="卡通兔子摄影师"
          draggable={false}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
}