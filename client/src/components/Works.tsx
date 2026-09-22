import { useState } from 'react';
import { PHOTOS, photoSrc } from '@/lib/photoData';
import Lightbox from './Lightbox';

/** 拍立得照片墙 + 灯箱。 */
export default function Works() {
  const [idx, setIdx] = useState<number | null>(null);

  return (
    <section id="works">
      <div className="wrap">
        <div className="sec-head reveal">
          <p className="sec-en">SELECTED SHOTS · 2023—2025</p>
          <h2 className="sec-title">作品选</h2>
        </div>
        <div className="wall" id="wall">
          {PHOTOS.map((p, i) => (
            <figure
              key={p.seed}
              className="polaroid reveal"
              tabIndex={0}
              onClick={() => setIdx(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIdx(i);
                }
              }}
            >
              <span className="tape" />
              <span className={`ptag ${p.cls}`}>{p.tag}</span>
              <div className="ph">
                <img src={photoSrc(p)} crossOrigin="anonymous" loading="lazy" alt={p.title} />
              </div>
              <figcaption>
                <em className="ptitle">{p.title}</em>
                <span className="pnote">{p.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      {idx !== null && (
        <Lightbox photos={PHOTOS} index={idx} onClose={() => setIdx(null)} onNav={setIdx} />
      )}
    </section>
  );
}