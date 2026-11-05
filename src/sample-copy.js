// English overlay for the locked dougong sample only.
// Chinese copy stays in content.js and the templates. This module swaps the
// strings a learner must click or read to finish that same path.

import { isEn } from './locale.js';
import { teachingSample } from './content.js';

const PIECES = {
  'piece-1': 'Pupaifang',
  'piece-2': 'Bottom large dou',
  'piece-3': 'Lower gong',
};

const TYPES = {
  pupai: {
    name: 'Pupaifang',
    desc: 'The wide flat tie near the column top. Find this horizontal line, then look up at the dou and the gong.',
    connection: 'Above the column top, under the dougong',
    evidence: 'Teaching model. Scale and joinery are not taken from a survey.',
  },
  dou: {
    name: 'Dou',
    desc: 'A bearing block. The notch on top is where a long wooden arm meets it. The real notch and joinery are not taken from a survey.',
    connection: 'Bears on the piece below · Carries the gong above',
    evidence: 'Teaching model. The 14 pieces are this model’s count, not an inventory. The notch is not taken from a survey.',
  },
  gong: {
    name: 'Gong',
    desc: 'A bracket arm running sideways. Look at both ends and where it sits against the bearing block. The outline is simplified to show the stack.',
    connection: 'Stacks with the dou as a layered support',
    evidence: 'Teaching model. The outline shows the stack. It is not a measured joint.',
  },
};

const ROLES = {
  pupai: 'A flat tie near the column top. It carries the dougong above.',
  dou: 'A block that bears the gong above it.',
  gong: 'A bracket arm running sideways. It stacks with the dou.',
};

const RELATIONS = {
  'piece-1': 'The dou bears on this',
  'piece-3': 'The dou carries this gong',
};

export function sampleEnglish() {
  return isEn && document.body?.dataset.story !== 'active';
}

export function onSampleType(item) {
  return Boolean(item && (TYPES[item.type] || TYPES[item.id]));
}

export function displayPieceName(id, fallback) {
  if (!sampleEnglish()) return fallback;
  return PIECES[id] || fallback;
}

export function present(item) {
  if (!item || !sampleEnglish()) return item;
  if (item.piece && TYPES[item.type]) {
    const type = TYPES[item.type];
    return {
      ...item,
      desc: type.desc,
      connection: type.connection,
      evidence: type.evidence,
      name: PIECES[item.id] || item.name,
    };
  }
  if (TYPES[item.id]) {
    const type = TYPES[item.id];
    return { ...item, name: type.name, desc: type.desc, connection: type.connection, evidence: type.evidence };
  }
  return item;
}

export function roleFor(type, fallback) {
  if (!sampleEnglish()) return fallback;
  return ROLES[type] || fallback;
}

export function sampleView() {
  if (!sampleEnglish()) return teachingSample;
  return {
    ...teachingSample,
    title: 'Bottom large dou',
    kicker: 'Teaching sample',
    blurb: 'Look at the bearing block, then the pieces joined above and below it, then find it once in the photograph.',
    labels: [
      { ...teachingSample.labels[0], name: 'Dou', role: 'Bearing block' },
      { ...teachingSample.labels[1], name: 'Teaching notch', role: 'Meets a long arm', caveat: 'Not from a survey' },
    ],
    neighbors: teachingSample.neighbors.map(entry => ({
      ...entry,
      relation: RELATIONS[entry.id] || entry.relation,
    })),
    marker: {
      ...teachingSample.marker,
      name: 'Dou',
      role: 'Bearing block',
      note: 'Look from the bottom up: find the horizontal pupaifang, then the dou that bears on it and the gong reaching outward. This mark is a teaching point, not a surveyed location.',
    },
  };
}

export const ui = {
  modeHall: isEn ? 'Whole hall' : '整殿',
  modeDetail: isEn ? 'Dougong close-up' : '斗拱局部',
  modeGroup: isEn ? 'View' : '观察尺度',
  buildingTitle: isEn ? 'Guanmu · Dayun Temple' : '观木 · 大云院弥陀殿',
  no3d: isEn
    ? 'This device cannot show 3D. Use the photograph and the notes.'
    : '当前设备暂不支持 3D，请先查看实景和构件说明。',
  no3dFail: isEn
    ? 'This device cannot start 3D. You can still read the photograph and the notes.'
    : '当前设备无法启动 3D，可以先浏览实景照片和构件说明。',
};

export function startSampleLabel() {
  return sampleEnglish() ? 'Start from this dou' : '从这个斗开始';
}

export function findDouLabel() {
  return sampleEnglish() ? 'Find this dou in the photograph' : '到实景里找这件斗';
}

export function backToDouLabel() {
  return sampleEnglish() ? 'Back to this dou' : '回到这件斗';
}

export function backToName(name) {
  return sampleEnglish() ? `Back to ${name}` : `回到${name}`;
}

export function inspectAction(item) {
  if (sampleEnglish() && onSampleType(item)) return 'Look closer · what it does';
  return '放大观察 · 看作用';
}

export function mobileLook(item) {
  if (sampleEnglish() && onSampleType(item)) return 'Look closer';
  return '放大看作用';
}

export function extractLabel(extracted, item) {
  if (sampleEnglish() && item?.piece && PIECES[item.id]) return extracted ? 'Put it back' : 'Pull out to look';
  return extracted ? '放回原位 ↙' : '抽出观察 ↗';
}

export function neighborNotice(name) {
  return sampleEnglish() ? `Neighboring piece · ${name}` : `相邻构件 · ${name}`;
}

export function returnedNotice(name) {
  return sampleEnglish() ? `Back at ${name}` : `已回到${name}`;
}

export function sampleTag() {
  return sampleEnglish() ? 'Sample' : '样例';
}

export function catalogTitle(detail) {
  if (detail && sampleEnglish()) return '14 pieces · one at a time';
  return detail ? '14 件木构 · 逐件认识' : '五个层次 · 展开看构件';
}

export function catalogHelp(detail) {
  if (detail && sampleEnglish()) return 'Teaching-model count';
  if (detail) return '示意模型件数';
  return null;
}

export function groupCount(detail, count, item) {
  if (!count) return item.sub || item.en;
  if (detail && sampleEnglish()) return `${count} ${count === 1 ? 'piece' : 'pieces'} · click to expand`;
  return `${count} ${detail ? '件' : '类'}构件 · 点击展开`;
}

export function groupLabel(detail, item) {
  if (detail && sampleEnglish() && TYPES[item.id]) return TYPES[item.id].name;
  return item.name;
}

export function expandLabel(opened, name, detail) {
  if (detail && sampleEnglish()) return `${opened ? 'Collapse' : 'Expand'} ${name}`;
  return `${opened ? '收起' : '展开'}${name}目录`;
}

export function pieceCounter(item) {
  if (!item?.piece) return '构件笔记';
  const n = String(item.number).padStart(2, '0');
  if (sampleEnglish() && TYPES[item.type]) return `Piece ${n} / 14`;
  return `第 ${n} 件 / 共 14 件`;
}

export function inspectorCategory(item) {
  if (item.piece && sampleEnglish() && TYPES[item.type]) return `Close-up · piece ${String(item.number).padStart(2, '0')}`;
  if (item.piece) return `局部示意 · 第 ${String(item.number).padStart(2, '0')} 件`;
  if (sampleEnglish() && TYPES[item.id]) return `${item.en} · notes`;
  return `${item.en} · 构件观察`;
}

export function detailModelNote() {
  if (sampleEnglish()) return 'Teaching bracket · not a measured restoration';
  return '通用斗拱关系示意 / 非实测复原';
}

export function photoNote(id, photo) {
  if (id === 'dougong' && sampleEnglish()) {
    return 'Look from the bottom up: find the horizontal pupaifang, then the dou that bears on it and the gong reaching outward.';
  }
  return photo.note;
}

export function photoHeading(id, photo) {
  if (id === 'dougong' && sampleEnglish()) return 'Column-top bracket · under the eaves';
  return photo.title;
}

export function photoAlt(id, photo) {
  if (id === 'dougong' && sampleEnglish()) {
    return 'Column-top dougong at Dayun Temple, showing the dou, the gong, and the pupaifang below';
  }
  return photo.alt;
}

export function photoSwitch(id, photo) {
  if (id === 'dougong' && sampleEnglish()) return 'Column-top bracket';
  return photo.title.split(' · ')[0];
}

export function markerAria(marker) {
  if (sampleEnglish()) return `${marker.name}, ${marker.role}. Teaching point, not a surveyed location.`;
  return `${marker.name}，${marker.role}。教学观察点，不是实测定位。`;
}

const CHROME = {
  kicker: ['构件特写 / 3D', 'Piece close-up / 3D'],
  close: ['关闭 ×', 'Close ×'],
  closeAria: ['关闭构件特写', 'Close the piece close-up'],
  role: ['它的作用', 'What it does'],
  meets: ['与谁相接', 'What it meets'],
  note: ['教学形态示意 · 无尺寸比例', 'Teaching shape · not to scale'],
  reset: ['复位', 'Reset'],
  rotate: ['自动旋转', 'Auto-rotate'],
  hint: ['拖动旋转 · 双指或滚动缩放', 'Drag to rotate · scroll or pinch to zoom'],
  zoomIn: ['放大构件', 'Zoom in'],
  zoomOut: ['缩小构件', 'Zoom out'],
  parts: ['关键部位', 'Parts to notice'],
  neighbors: ['相邻构件', 'Neighboring pieces'],
  sample: ['教学样例', 'Teaching sample'],
  viewerAria: ['居中放大的构件模型，可拖动旋转和滚动缩放', 'Enlarged piece. Drag to rotate and scroll to zoom.'],
  fallbackHint: ['当前无法显示放大模型，仍可查看右侧的构件说明。', 'The enlarged model cannot be shown. The notes are still on the side.'],
};

export function chrome(key, english = sampleEnglish()) {
  const pair = CHROME[key];
  return english ? pair[1] : pair[0];
}
