import { useEffect, useState } from 'react';

/** 开场快门帘：620ms 后打开，1.5s 后从 DOM 移除。 */
export default function Curtain() {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setOpen(true), 620);
    const t2 = window.setTimeout(() => setGone(true), 1500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div id="curtain" className={'no-snap' + (open ? ' open' : '')}>
      <div className="half top" />
      <div className="half bot" />
      <span className="word">BIGBEN &nbsp;PHOTO&nbsp; DIARY</span>
    </div>
  );
}