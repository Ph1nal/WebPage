import { useEffect } from 'react';
import Curtain from '@/components/Curtain';
import CursorRing from '@/components/CursorRing';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import Works from '@/components/Works';
import About from '@/components/About';
import Guestbook from '@/components/Guestbook';
import Footer from '@/components/Footer';
import MomoCorner from '@/components/MomoCorner';
import SnapStack from '@/components/SnapStack';
import ToastHost from '@/components/ToastHost';

/** 张奔月的取景框 —— 单页摄影小站。 */
export default function Home() {
  // 滚动显现
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div id="flash" className="no-snap" />
      <Curtain />
      <CursorRing />
      <NavBar />
      <Hero />
      <div className="wrap">
        <div className="film no-snap"><span>BIGBEN&nbsp; FILM&nbsp; ·&nbsp; 36&nbsp; EXP</span></div>
      </div>
      <Works />
      <About />
      <Guestbook />
      <Footer />
      <MomoCorner />
      <SnapStack />
      <ToastHost />
    </>
  );
}