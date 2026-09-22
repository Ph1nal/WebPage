import { useEffect, useRef } from 'react';
import { toast } from '@/lib/toast';

/** 左下角相纸堆：接收 cw-snap 事件，展示并可保存页面快照（最多 3 张）。 */
export default function SnapStack() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = ref.current;
    if (!stack) return;
    const onSnap = (e: Event) => {
      const { url, stamp } = (e as CustomEvent<{ url: string; stamp: string }>).detail;
      const card = document.createElement('div');
      card.className = 'snap-card drop-in';
      card.style.transform = `rotate(${(Math.random() * 12 - 6).toFixed(1)}deg)`;
      const img = document.createElement('img');
      img.alt = '此刻的页面';
      img.src = url;
      const d = document.createElement('span');
      d.className = 'd';
      d.textContent = stamp;
      card.append(img, d);
      card.title = '点击保存';
      card.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = `bigben-moment-${Date.now()}.jpg`;
        a.click();
        toast('已保存');
      });
      stack.appendChild(card);
      while (stack.children.length > 3) {
        const old = stack.firstElementChild;
        if (!old) break;
        old.classList.add('out');
        window.setTimeout(() => old.remove(), 400);
      }
    };
    window.addEventListener('cw-snap', onSnap);
    return () => window.removeEventListener('cw-snap', onSnap);
  }, []);

  return <div id="snapStack" className="no-snap" ref={ref} />;
}