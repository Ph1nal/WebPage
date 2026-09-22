import { useEffect, useRef, useState } from 'react';
import { onToast } from '@/lib/toast';

/** 底部手写体 Toast 提示。 */
export default function ToastHost() {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(
    () =>
      onToast((m) => {
        setMsg(m);
        setShow(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setShow(false), 2600);
      }),
    [],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div id="toast" className={'no-snap' + (show ? ' show' : '')} role="status">
      {msg}
    </div>
  );
}