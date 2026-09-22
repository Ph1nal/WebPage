export interface Photo {
  seed: string;
  w: number;
  h: number;
  title: string;
  note: string;
  tag: string;
  cls: string;
}

export const PHOTOS: Photo[] = [
  { seed: 'nekochan', w: 600, h: 760, title: '巷口的猫', note: '固定点位拍摄的橘猫。', tag: '猫', cls: 'tag-b' },
  { seed: 'honeylight', w: 600, h: 430, title: '六月的光', note: '午后四点的自然光。', tag: '光', cls: 'tag-y' },
  { seed: 'kumobunny', w: 600, h: 840, title: '云的形状像棉花糖', note: '天空习作。', tag: '天空', cls: 'tag-p' },
  { seed: 'odennabe', w: 600, h: 500, title: '关东煮的热气', note: '夜间食堂随拍。', tag: '食', cls: 'tag-y' },
  { seed: 'shotengai', w: 600, h: 700, title: '傍晚的商店街', note: '街头随拍。', tag: '街', cls: 'tag-b' },
  { seed: 'sleepyyawn', w: 600, h: 460, title: '打哈欠的午后', note: '午睡的猫。', tag: '猫', cls: 'tag-b' },
  { seed: 'puddlecity', w: 600, h: 800, title: '雨停之后', note: '雨后街景。', tag: '街', cls: 'tag-p' },
  { seed: 'hanataba', w: 600, h: 540, title: '路边的花', note: '微距练习。', tag: '光', cls: 'tag-y' },
  { seed: 'nightlamp', w: 600, h: 680, title: '深夜的自动贩卖机', note: '夜景练习。', tag: '夜', cls: 'tag-b' },
];

export const photoSrc = (p: Photo) =>
  `https://picsum.photos/seed/${p.seed}/${p.w}/${p.h}.jpg`;