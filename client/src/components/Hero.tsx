import { useCallback, useEffect, useRef, useState } from 'react';
import { ChiChar, HachiChar } from './StageCharacters';
import { burst } from '@/lib/particles';
import { bounce, speak, shutterSound, flash, CHAR_LINES } from '@/lib/interactions';
import { LS } from '@/lib/storage';
import { toast } from '@/lib/toast';

const FloatyStar = () => (
  <svg viewBox="0 0 40 40"><path d="M20 4 L24.7 14.6 L36 16 L27.5 23.6 L29.8 35 L20 29 L10.2 35 L12.5 23.6 L4 16 L15.3 14.6 Z" fill="#F2C35C" stroke="#4A4038" strokeWidth="2" strokeLinejoin="round" /></svg>
);
const FloatyCarrot = () => (
  <svg viewBox="0 0 40 40"><path d="M20 35 C14 28 11 18 13 11 C17 8 23 8 27 11 C29 18 26 28 20 35 Z" fill="#F08C4A" stroke="#4A4038" strokeWidth="2" /><path d="M20 10 C18 5 14 4 11 5 M20 10 C22 5 26 4 29 5 M20 10 L20 3" stroke="#7CA75B" strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
);
const FloatyHeart = () => (
  <svg viewBox="0 0 40 40"><path d="M20 34 C8 25 5 15 11 11 C15 8.4 19 11 20 14 C21 11 25 8.4 29 11 C35 15 32 25 20 34 Z" fill="#F4A0A0" stroke="#4A4038" strokeWidth="2" /></svg>
);

/** 首屏：文案 + 舞台（举相机的角色与猫伙伴），含眼球跟随/点击互动/快门拍照。 */
export default function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [shots, setShots] = useState(0);
  const snapBusy = useRef(false);

  // 快门计数：每次访问 +1
  useEffect(() => {
    const n = LS.get('cw-shots', 0) + 1;
    LS.set('cw-shots', n);
    setShots(n);
  }, []);

  // 舞台角色眼球跟随鼠标
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const eyes = Array.from(stage.querySelectorAll<SVGGElement>('.eye-move'));
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    let raf = 0;
    const tick = () => {
      for (const g of eyes) {
        const svg = g.ownerSVGElement;
        if (!svg) continue;
        const r = svg.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * 0.45;
        const dx = tx - cx;
        const dy = ty - cy;
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 150) * 3.2;
        g.style.transform = `translate(${((dx / d) * k).toFixed(2)}px, ${((dy / d) * k).toFixed(2)}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onChar = useCallback((kind: 'chi' | 'hachi', host: HTMLElement) => {
    const pool = CHAR_LINES[kind];
    bounce(host);
    speak(host, pool[Math.floor(Math.random() * pool.length)]);
    const r = host.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.25, 6, ['heart', 'star']);
  }, []);

  // 「拍下此刻」：html2canvas 截取页面生成相纸
  const onCamera = useCallback(async () => {
    if (snapBusy.current) return;
    snapBusy.current = true;
    flash();
    shutterSound();
    const chi = document.querySelector<HTMLElement>('.char.chi');
    if (chi) speak(chi, '咔嚓！');
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(document.body, {
        backgroundColor: '#FAF5EA',
        scale: 0.5,
        useCORS: true,
        logging: false,
        ignoreElements: (el) => !!(el as HTMLElement).closest?.('.no-snap'),
      });
      const url = canvas.toDataURL('image/jpeg', 0.85);
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const stamp = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      window.dispatchEvent(new CustomEvent('cw-snap', { detail: { url, stamp } }));
      if (!LS.get('cw-snapped', false)) {
        toast('已生成相纸，可在左下角保存');
        LS.set('cw-snapped', true);
      }
    } catch {
      toast('生成失败，请重试');
    }
    snapBusy.current = false;
  }, []);

  return (
    <header id="hero">
      <i className="vfc tl" /><i className="vfc tr" /><i className="vfc bl" /><i className="vfc br" />
      <span className="cross" style={{ top: '22%', left: '46%' }} />
      <span className="cross" style={{ bottom: '20%', left: '12%' }} />
      <span className="cross" style={{ top: '34%', right: '8%' }} />
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow reveal">
              BIGBEN · PHOTO DIARY
              <span className="shot-badge">快门已按下 <b>{shots}</b> 次</span>
            </p>
            <h1 className="reveal">用相机记录<br /><em>日常瞬间</em></h1>
            <p className="hand reveal">PHOTO DIARY · 2023—2025</p>
            <p className="lead reveal">
              张奔月（BigBen），摄影爱好者。常拍街头、猫与日常生活，使用 35mm 胶片与数码微单。
            </p>
            <p className="hero-tips reveal">
              <span className="tip-dot" />
              <span>点击相机按钮，可将当前页面截图保存为相纸。</span>
            </p>
            <a className="cta reveal" href="#works">翻看相册
              <svg viewBox="0 0 24 24"><path d="M4 9 L12 17 L20 9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>

          <div className="hero-stage reveal" id="stage" ref={stageRef}>
            <div className="ground" />
            <svg className="grass" style={{ left: '6%' }} viewBox="0 0 34 20">
              <path d="M4 20 C4 12 2 8 1 4 M4 20 C6 12 9 9 12 6 M4 20 C5 14 8 12 10 11 M26 20 C26 13 24 9 23 5 M26 20 C28 14 31 11 33 9" stroke="#7CA75B" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            </svg>
            <svg className="grass" style={{ right: '26%' }} viewBox="0 0 34 20">
              <path d="M6 20 C6 12 4 9 3 5 M6 20 C8 13 11 10 14 7 M22 20 C22 13 20 10 19 6 M22 20 C24 14 27 12 29 10" stroke="#7CA75B" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            </svg>

            <div className="char chi" onClick={(e) => onChar('chi', e.currentTarget)}>
              <div className="shadow" />
              <div className="char-inner"><ChiChar onCamera={onCamera} /></div>
            </div>

            <div className="char hachi" onClick={(e) => onChar('hachi', e.currentTarget)}>
              <div className="shadow" style={{ width: '70%' }} />
              <div className="char-inner"><HachiChar /></div>
            </div>
          </div>
        </div>
      </div>

      <span className="floaty no-snap" style={{ top: '20%', left: '6%', width: 26 }}><FloatyStar /></span>
      <span className="floaty no-snap" style={{ bottom: '26%', right: '5%', width: 30, animationDelay: '1.6s' }}><FloatyCarrot /></span>
      <span className="floaty no-snap" style={{ top: '58%', left: '44%', width: 20, animationDelay: '3s' }}><FloatyHeart /></span>
    </header>
  );
}