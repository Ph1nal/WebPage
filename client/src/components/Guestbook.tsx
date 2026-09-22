import { useCallback, useEffect, useRef, useState } from 'react';
import { burst, rand } from '@/lib/particles';
import { LS } from '@/lib/storage';
import { toast } from '@/lib/toast';

interface NoteItem {
  nick: string;
  txt: string;
  color: string;
  time: string;
  rot: number;
}

const PRESET: NoteItem[] = [
  { nick: '奔月的朋友', txt: '交给我吧！相册全都整理好啦～', color: 'c-b', time: '', rot: -2.1 },
  { nick: '爱吃萝卜的兔子', txt: '乌拉！全是猫！好看！', color: 'c-y', time: '', rot: 1.6 },
  { nick: '一位路过的访客', txt: '在「雨停之后」那张前面站了好久。', color: 'c-p', time: '', rot: -1.2 },
];
const COLORS = ['c-y', 'c-b', 'c-p'];

/** 留言板：便签墙 + 表单，留言通过 localStorage 持久化。 */
export default function Guestbook() {
  const [nick, setNick] = useState('');
  const [txt, setTxt] = useState('');
  const [extra, setExtra] = useState<NoteItem[]>(() =>
    LS.get<Omit<NoteItem, 'rot'>[]>('cw-notes', []).map((n) => ({
      ...n,
      rot: rand(-3.4, 3.4),
    })),
  );
  const notes = [...PRESET, ...extra];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nick.trim() || '路过的小可爱';
    const text = txt.trim();
    if (!text) {
      toast('请输入留言内容');
      return;
    }
    if (text.length > 80) {
      toast('留言请控制在 80 字以内');
      return;
    }
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const item: NoteItem = {
      nick: name,
      txt: text,
      color: COLORS[extra.length % 3],
      time: `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`,
      rot: rand(-3.4, 3.4),
    };
    LS.set('cw-notes', [item, ...LS.get<Omit<NoteItem, 'rot'>[]>('cw-notes', [])]);
    setExtra((prev) => [item, ...prev]);
    setNick('');
    setTxt('');
    const board = document.getElementById('notes');
    const r = board?.getBoundingClientRect();
    if (r) burst(r.left + r.width / 2, r.top + 40, 10);
    toast('留言已发布');
  };

  return (
    <section id="guestbook" style={{ paddingTop: 20 }}>
      <div className="wrap">
        <div className="sec-head reveal">
          <p className="sec-en">MESSAGE BOARD</p>
          <h2 className="sec-title">留言板</h2>
        </div>
        <form className="gb-form reveal" onSubmit={submit}>
          <div className="gb-row">
            <input
              type="text"
              value={nick}
              maxLength={12}
              onChange={(e) => setNick(e.target.value)}
              placeholder="你的名字（可选）"
            />
          </div>
          <textarea
            value={txt}
            maxLength={80}
            onChange={(e) => setTxt(e.target.value)}
            placeholder="写点什么（80 字以内）"
          />
          <button type="submit">发布留言</button>
        </form>
        <div className="board reveal">
          <span className="tape" /><span className="tape t2" />
          <div className="notes" id="notes">
            {notes.map((n, i) => (
              <div
                key={`${n.nick}-${i}`}
                className={'note ' + n.color}
                style={{ '--nrot': `${n.rot}deg` } as React.CSSProperties}
              >
                <span className="pin" />
                <span className="nick">{n.nick}</span>
                <span className="txt">{n.txt}</span>
                <span className="time">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}