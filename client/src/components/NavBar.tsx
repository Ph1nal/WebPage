import { useEffect } from 'react';

/** 顶部导航：品牌 + 锚点链接，IntersectionObserver 高亮当前分区。 */
export default function NavBar() {
  useEffect(() => {
    const spy = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            document
              .querySelectorAll<HTMLAnchorElement>('#nav .links a')
              .forEach((a) => {
                a.classList.toggle('active', a.dataset.sec === en.target.id);
              });
          }
        }),
      { rootMargin: '-38% 0px -55% 0px' },
    );
    ['works', 'about', 'guestbook'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
    return () => spy.disconnect();
  }, []);

  return (
    <nav id="nav" className="no-snap">
      <a className="brand" href="#hero">
        <svg viewBox="0 0 24 24">
          <rect x="2.4" y="6.4" width="19.2" height="14" rx="3.4" fill="none" stroke="#4A4038" strokeWidth="2" />
          <path d="M8 6.4 L9.6 3.6 h4.8 L16 6.4" fill="none" stroke="#4A4038" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="12" cy="13.4" r="4" fill="none" stroke="#4A4038" strokeWidth="2" />
        </svg>
        <b>张奔月的取景框</b>
        <small>BigBen · photography</small>
      </a>
      <div className="links">
        <a href="#works" data-sec="works">相册</a>
        <a href="#about" data-sec="about">关于我</a>
        <a href="#guestbook" data-sec="guestbook">留言板</a>
      </div>
    </nav>
  );
}