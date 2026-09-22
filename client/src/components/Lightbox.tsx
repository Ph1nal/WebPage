import { useEffect, useRef, useState } from 'react';
import { photoSrc, type Photo } from '@/lib/photoData';
import { burst } from '@/lib/particles';
import { LS } from '@/lib/storage';

interface LightboxProps {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
}

const likeKey = (i: number) => 'cw-like-' + i;

/** 灯箱：大图查看、左右切换、键盘导航、点赞（localStorage 持久化）。 */
export default function Lightbox({ photos, index, onClose, onNav }: LightboxProps) {
  const photo = photos[index];
  const [likes, setLikes] = useState(() => LS.get(likeKey(index), 0));
  const [mine, setMine] = useState(() => LS.get(likeKey(index) + '-mine', false));
  const likeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLikes(LS.get(likeKey(index), 0));
    setMine(LS.get(likeKey(index) + '-mine', false));
  }, [index]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNav((index - 1 + photos.length) % photos.length);
      if (e.key === 'ArrowRight') onNav((index + 1) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, photos.length, onClose, onNav]);

  const toggleLike = () => {
    const wasLiked = LS.get(likeKey(index) + '-mine', false);
    if (wasLiked) {
      LS.set(likeKey(index) + '-mine', false);
      LS.set(likeKey(index), LS.get(likeKey(index), 0) - 1);
    } else {
      LS.set(likeKey(index) + '-mine', true);
      LS.set(likeKey(index), LS.get(likeKey(index), 0) + 1);
      const r = likeRef.current?.getBoundingClientRect();
      if (r) burst(r.left + r.width / 2, r.top, 8, ['heart']);
    }
    setLikes(LS.get(likeKey(index), 0));
    setMine(!wasLiked);
  };

  return (
    <div className="lightbox no-snap">
      <button className="lb-bg" aria-label="关闭大图" onClick={onClose} />
      <div className="lb-panel">
        <button className="lb-nav prev" aria-label="上一张" onClick={() => onNav((index - 1 + photos.length) % photos.length)}>
          <svg viewBox="0 0 24 24"><path d="M9 4 L17 12 L9 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <figure className="lb-frame" key={index}>
          <img src={photoSrc(photo)} crossOrigin="anonymous" alt={photo.title} />
          <figcaption>
            <strong>{photo.title}</strong>
            <span className="lb-note">{photo.note}</span>
            <div className="lb-meta">
              <button ref={likeRef} className={'like-btn' + (mine ? ' liked' : '')} onClick={toggleLike} aria-label="喜欢这张照片">
                <svg viewBox="0 0 24 24"><path d="M12 20.5 C5.5 15.5 3 11 4.6 7.9 C5.9 5.5 9.2 5.3 10.8 7.3 L12 8.8 L13.2 7.3 C14.8 5.3 18.1 5.5 19.4 7.9 C21 11 18.5 15.5 12 20.5 Z" /></svg>
                <b>{likes}</b>&nbsp;次喜欢
              </button>
              <span className="lb-idx">{index + 1} / {photos.length}</span>
            </div>
          </figcaption>
        </figure>
        <button className="lb-nav next" aria-label="下一张" onClick={() => onNav((index + 1) % photos.length)}>
          <svg viewBox="0 0 24 24"><path d="M9 4 L17 12 L9 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button className="lb-x" aria-label="关闭" onClick={onClose}>
          <svg viewBox="0 0 24 24"><path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  );
}