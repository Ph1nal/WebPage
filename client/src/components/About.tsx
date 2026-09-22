import { useMagnetic } from '@/hooks/useMagnetic';

/** 关于我：拍立得自拍 + 装备清单 + 拍摄年表。 */
export default function About() {
  const gearRef = useMagnetic<HTMLLIElement>(0.08);

  return (
    <section id="about">
      <div className="wrap">
        <div className="about-grid">
          <figure className="polaroid about-photo reveal">
            <span className="tape" />
            <div className="ph">
              <img src="/images/mascot.png" alt="张奔月 BigBen 的卡通形象" draggable={false} />
            </div>
            <figcaption>BigBen · 卡通形象</figcaption>
          </figure>
          <div className="about-copy">
            <div className="sec-head reveal" style={{ marginBottom: 24 }}>
              <p className="sec-en">ABOUT ME</p>
              <h2 className="sec-title">关于我</h2>
            </div>
            <p className="hand reveal">我是张奔月（BigBen），摄影爱好者。</p>
            <p className="reveal">
              白天上班，周末拍照。常拍街头、猫与日常静物，喜欢用 35mm 定焦记录身边的人和事。
            </p>
            <ul className="gear reveal">
              <li ref={gearRef}>
                <svg viewBox="0 0 24 24"><rect x="2.4" y="6.4" width="19.2" height="14" rx="3.4" fill="none" stroke="#4A4038" strokeWidth="2" /><path d="M8 6.4 L9.6 3.6 h4.8 L16 6.4" fill="none" stroke="#4A4038" strokeWidth="2" strokeLinejoin="round" /><circle cx="12" cy="13.4" r="4" fill="none" stroke="#4A4038" strokeWidth="2" /></svg>
                胶片机 · 35mm 定焦
              </li>
              <li>
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#4A4038" strokeWidth="2" /><circle cx="12" cy="12" r="4.6" fill="none" stroke="#4A4038" strokeWidth="2" /><circle cx="10" cy="9.6" r="1.5" fill="#4A4038" /></svg>
                数码微单 · 日常备用
              </li>
              <li>
                <svg viewBox="0 0 24 24"><path d="M3 12 C6 7 11 5 15 7 L21 4 L19.5 12 L21 20 L15 17 C11 19 6 17 3 12 Z" fill="#F2C35C" stroke="#4A4038" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="8" cy="11" r="1.2" fill="#4A4038" /></svg>
                常拍题材：街头 / 猫 / 静物
              </li>
            </ul>
            <ul className="history reveal">
              <li><b>2021</b>开始摄影，以街头与猫为主</li>
              <li><b>2023</b>第一次小型照片展</li>
              <li><b>2025</b>持续更新中</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}