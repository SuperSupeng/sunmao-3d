import './style.css';
import './story.css';
import './home.css';
import { homeMarkup } from './home.js';
import { ComponentInspector } from './inspector.js';
import { StoryTour } from './story.js';
import { ArchitectureViewer } from './model.js';
import { layers, hallParts, parts, sources, photos, photoReferences, teachingSample } from './content.js';

const icons = {
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  cube: '<path d="m12 3 9 5v8l-9 5-9-5V8l9-5ZM3 8l9 5 9-5M12 13v8M7.5 5.5l9 5"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="m3 3 18 18M9 5.5a12 12 0 0 1 3-.5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6 6.4A22 22 0 0 0 2 12s3.5 7 10 7a12 12 0 0 0 5-1.1"/>',
  reset: '<path d="M3 10a9 9 0 1 1 1.5 7M3 4v6h6"/>',
  rotate: '<path d="M5 8a8 8 0 0 1 14 0l2 3M21 5v6h-6M19 16a8 8 0 0 1-14 0l-2-3M3 19v-6h6"/>',
  label: '<path d="M3 4h9l9 9-8 8-10-9V4Z"/><circle cx="8" cy="9" r="1"/>',
  front: '<path d="M3 8h18M5 8v12m14-12v12M3 20h18M9 8v12m6-12v12M2 8l10-5 10 5"/>',
  play: '<path d="m8 4 12 8-12 8V4Z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',
  photo: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m3 17 5-5 4 4 4-5 5 6"/>',
  move: '<path d="m9 5 3-3 3 3m-3-3v20m-3-3 3 3 3-3M5 9l-3 3 3 3m-3-3h20m-3-3 3 3-3 3"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15 8-2 6-4 2 2-6 4-2Z"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.cube}</svg>`;
const logo = '<svg viewBox="0 0 40 44" aria-hidden="true"><path d="M3 11h34M8 21h24M13 31h14M20 3v38M3 6v10M37 6v10M8 17v9M32 17v9" fill="none" stroke="currentColor" stroke-width="3.5"/></svg>';

document.querySelector('#app').innerHTML = `
  <header class="header">
    <a class="brand" href="./" aria-label="观木首页">${logo}<span>观木<small>一木一构，见千年</small></span></a>
    <nav aria-label="主要导航">
      <button id="nav-collection" class="nav">古建目录</button><button id="nav-approach" class="nav">怎样探索</button>
      <button id="nav-model" class="nav active" aria-current="page">建筑解构</button>
      <button id="nav-story" class="nav">故事漫游</button>
      <button id="nav-photo" class="nav">实景对照</button>
      <button id="nav-about" class="nav">关于这个尝试</button>
    </nav>
    <span class="header-note"><span class="status-dot"></span> 古建探索 · 第一辑</span>
  </header>
  <main id="home-view" class="home-view" hidden>${homeMarkup()}</main>
  <main class="workspace" id="building-view">
    <section class="stage" aria-label="古建筑探索区域">
      <p id="story-scene-caption" class="story-scene-caption" hidden></p>
      <div class="stage-heading"><p class="eyebrow">SHANXI · PINGSHUN <span>山西 · 平顺</span></p><h1>大云院<span>弥陀殿</span></h1><p class="stage-sub">把看见的古建筑，慢慢看懂。</p></div>
      <div class="mode-switch" role="group" aria-label="观察尺度"><button id="mode-hall" class="selected" aria-pressed="true">${icon('cube')}整殿</button><button id="mode-detail" aria-pressed="false">${icon('layers')}斗拱局部</button></div>
      <div id="viewer" class="viewer"></div>
      <div id="labels" class="labels" aria-label="模型标注"></div>
      <div id="loading" class="loading"><span class="loading-mark">${logo}</span><p>正在展开这座古建筑…</p></div>
      <div class="model-stamp"><span>五代 · 后晋</span><small id="model-note">教学示意 / 非测绘复原</small></div>
      <div class="view-tools" role="group" aria-label="模型工具">
        <button id="reset-view" title="复位视角" aria-label="复位视角">${icon('reset')}</button>
        <button id="front-view" title="正面观察" aria-label="正面观察">${icon('front')}</button>
        <button id="toggle-labels" class="is-on" title="构件标注" aria-label="构件标注" aria-pressed="true">${icon('label')}</button>
        <button id="toggle-rotate" title="自动旋转" aria-label="自动旋转" aria-pressed="false">${icon('rotate')}</button>
      </div>
      <div class="orientation">${icon('compass')}<span>自由视角</span></div>
      <div id="piece-tools" class="piece-tools" hidden><button id="piece-note"></button><button id="extract-piece" aria-pressed="false">抽出观察 ↗</button></div>
      <div class="explosion-control">
        <div class="control-head"><label for="explode">${icon('layers')}<span id="explode-label">结构展开</span></label><div id="granularity" class="granularity" role="group" aria-label="拆解粒度"><button data-fine="false" aria-pressed="false">按层次</button><button data-fine="true" class="selected" aria-pressed="true">按构件</button></div><span id="percent">0<span>%</span></span></div>
        <input id="explode" type="range" min="0" max="100" value="0" step="1" aria-label="结构展开程度" />
        <div class="range-legend"><span id="range-start">完整建筑</span><span id="range-middle">显露木构</span><span>层层展开</span></div>
        <div class="control-bottom"><span id="control-hint">拖动滑块，看看屋檐之下</span><button id="assemble">${icon('play')}<span>播放拆解</span></button></div>
      </div>
      <button id="mobile-selection" class="mobile-selection" hidden></button>
      <div class="canvas-hint">${icon('move')}拖动旋转<span>·</span>滚动缩放<span>·</span>点击构件</div>
      <section id="photo-view" class="photo-view" hidden aria-label="建筑实景对照">
        <div class="photo-switch" role="group" aria-label="实景照片">${Object.entries(photos).map(([id, p]) => `<button data-photo="${id}" class="${id === 'hall' ? 'selected' : ''}" aria-pressed="${id === 'hall'}">${p.title.split(' · ')[0]}</button>`).join('')}</div>
        <figure><div class="photo-frame"><img id="reference-photo" src="${photos.hall.src}" alt="${photos.hall.alt}" /><div id="photo-markers" class="photo-markers" hidden></div></div><figcaption><strong id="photo-title">${photos.hall.title}</strong><p id="photo-note">${photos.hall.note}</p><small>摄影：Patrick20242023 · 2024.02.15 · <a id="photo-source" href="${photos.hall.page}" target="_blank" rel="noopener noreferrer">原图</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a> · 原图未修改</small></figcaption></figure>
        <button id="back-model" class="back-model">${icon('cube')}返回模型，继续观察 ${icon('arrow')}</button>
      </section>
    </section>
    <section id="story-panel" class="story-panel" hidden aria-label="抬头之后故事导览"></section>
    <aside class="sidebar" aria-label="建筑与构件说明">
      <div class="intro"><p class="eyebrow">EXPLORE THE STRUCTURE <span>01</span></p><h2>屋檐之下，<br />自有天地。</h2><p>一座殿，一层层拆开。<br />从建筑的轮廓，走近木与木的相遇。</p><button id="start-guide" class="story-entry"><span class="story-entry-kicker">一段可以亲手拆开的故事</span><strong>抬头之后</strong><span class="story-entry-description">从殿前的一次仰望，<br>到认出第一件木构。</span><span class="story-entry-action">开始漫游 <small>5 个片段</small>${icon('arrow')}</span></button></div>

      <div class="catalog-header"><h3 id="catalog-title">建筑的五个层次</h3><span id="catalog-help">点击认识 · ${icon('eye')}显隐</span></div>
      <div id="layer-list" class="layer-list"></div>
      <article id="info-card" class="info-card" aria-live="polite"></article>
      <div class="sidebar-bottom"><div class="place-line"><span class="tiny-cross">＋</span><span>山西省长治市 · 平顺县实会村</span></div><button id="open-sources">${icon('info')}资料依据与模型说明 ${icon('arrow')}</button></div>
    </aside>
  </main>
  <footer><span>观木 · 中国古建筑交互探索</span><span>从一次仰望，到一次理解。</span><span id="edition-note">DAYUN TEMPLE / VOL. 01</span></footer>
  <dialog id="sources-dialog" aria-labelledby="dialog-title"><div class="dialog-top"><p class="eyebrow">ABOUT THIS EXPLORATION</p><button id="close-dialog" aria-label="关闭说明">${icon('close')}</button></div><h2 id="dialog-title">让古建筑，变得可读。</h2><p>这个尝试从一次山西旅行开始。我们用可以旋转、拆开、重组的模型，把建筑外观与构件名称联系起来。</p><div class="model-disclaimer"><h3>这是一份教学示意</h3><p>以平顺大云院弥陀殿为观察对象，整殿轮廓和结构类型参考公开资料。尺寸、柱网、梁架排布、斗拱构件、瓦面与装饰均作了简化；斗拱局部采用通用关系模型，尚未完成实测复原。</p><p>展开方向用于解释空间层次，不代表实际施工或拆卸顺序；模型不提供真实受力计算，也未复原隐蔽榫卯、壁画与历次修缮痕迹。</p></div><h3>关于《抬头之后》</h3><p>故事中的旅行情境和旁白为本项目创作，不是历史人物口述或真实事件记录。构件解释沿用下列资料与教学模型，实景照片保留来源。当前故事不补写未经核验的营造者、传说或修缮情节。</p><h3>资料线索</h3><div class="source-list">${sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener noreferrer"><strong>${s.title} ↗</strong><span>${s.note}</span></a>`).join('')}</div><h3>实景照片</h3><p>摄影者 Patrick20242023，摄于 2024 年 2 月 15 日。来自 Wikimedia Commons，遵循 <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>，图片文件未修改。</p><div class="photo-credits">${Object.values(photos).map(p => `<a href="${p.page}" target="_blank" rel="noopener noreferrer">${p.title} ↗</a>`).join('')}</div><p class="dialog-footnote">完成的标准：回到照片时，能认出刚刚观察过的构件。</p></dialog>
  <div id="notice" class="notice" role="status" aria-live="polite"></div>
`;

const $ = selector => document.querySelector(selector);
const state = { mode: 'hall', selection: null, labels: true, rotate: false, explode: 0, photo: 'hall', hidden: new Set(), fine: true, openGroup: 'frame', extracted: false, animation: null, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, sampleMarker: false };
let viewer;
let tour;
let page = 'home';
let sampleHome = null;
let awayFromSample = false;
const inspector = new ComponentInspector(id => viewer?.inspectionObject(id), {
  onNeighbor: id => viewNeighbor(id),
  onReturn: () => returnToSample(),
  onPhoto: () => openSamplePhoto(),
});
let noticeTimer;
function notify(message) { $('#notice').textContent = message; $('#notice').classList.add('show'); clearTimeout(noticeTimer); noticeTimer = setTimeout(() => $('#notice').classList.remove('show'), 5000); }

function pieceName(id) {
  return viewer?.pieces.get(id)?.name || '';
}
function sampleContext(item) {
  if (!item) return null;
  const inStory = document.body.dataset.story === 'active';
  const isHome = item.id === teachingSample.piece;
  const neighbor = teachingSample.neighbors.some(entry => entry.id === item.id);
  if (!isHome && !(neighbor && sampleHome)) return null;
  if (inStory && !isHome) return null;
  return {
    home: isHome,
    guided: !inStory,
    labels: isHome ? teachingSample.labels : null,
    homeName: pieceName(teachingSample.piece) || teachingSample.title,
    neighbors: teachingSample.neighbors.map(entry => ({
      ...entry,
      name: pieceName(entry.id),
      current: entry.id === item.id,
    })),
  };
}
function freezeSampleHome() {
  if (!viewer || awayFromSample || state.mode !== 'detail' || state.selection !== teachingSample.piece) return;
  sampleHome = { mode: 'detail', explode: state.explode, selection: teachingSample.piece, camera: viewer.captureView() };
}
function getItem(id) {
  const piece = viewer?.pieces.get(id);
  if (piece) return { ...parts.find(p => p.id === piece.type), id, name: piece.name, type: piece.type, number: piece.number, piece: true, photo: 'dougong' };
  return [...layers, ...hallParts, ...parts].find(p => p.id === id);
}
function renderCatalog() {
  const detail = state.mode === 'detail';
  const selected = getItem(state.selection);
  const groupId = selected?.parent || selected?.type || state.selection;
  $('#catalog-title').textContent = detail ? '14 件木构 · 逐件认识' : '五个层次 · 展开看构件';
  $('#catalog-help').innerHTML = detail ? '示意模型件数' : `${icon('eye')}显隐`;
  const eye = item => `<button class="layer-eye" data-visibility="${item.id}" aria-label="${state.hidden.has(item.id) ? '显示' : '隐藏'}${item.name}" aria-pressed="${!state.hidden.has(item.id)}">${icon(state.hidden.has(item.id) ? 'eyeoff' : 'eye')}</button>`;
  $('#layer-list').innerHTML = (detail ? parts : layers).map((item, i) => {
    const children = detail ? [...(viewer?.pieces.values() || [])].filter(p => p.type === item.id) : hallParts.filter(p => p.parent === item.id);
    const opened = state.openGroup === item.id;
    return `<section class="catalog-group"><div class="layer-row ${groupId === item.id ? 'active' : ''} ${state.hidden.has(item.id) ? 'muted' : ''}" data-layer="${item.id}"><button class="layer-select" data-select="${item.id}" aria-pressed="${state.selection === item.id}"><span class="layer-number">${String(i + 1).padStart(2, '0')}</span><span class="layer-swatch" style="--swatch:${item.color || ['#90664c', '#c3a071', '#a47c50', '#79563c'][i]}"></span><span class="layer-name">${item.name}<small>${children.length ? `${children.length} ${detail ? '件' : '类'}构件 · 点击展开` : item.sub || item.en}</small></span></button>${children.length ? `<button class="catalog-expand" data-expand="${item.id}" aria-label="${opened ? '收起' : '展开'}${item.name}目录" aria-expanded="${opened}">${opened ? '−' : '+'}</button>` : ''}${!detail ? eye(item) : ''}</div>${children.length ? `<div class="member-list" ${opened ? '' : 'hidden'}>${children.map(child => `<div class="member-row ${state.hidden.has(child.id) ? 'muted' : ''}"><button class="member-select ${state.selection === child.id ? 'selected' : ''}" data-select="${child.id}" aria-pressed="${state.selection === child.id}"><span>${detail ? String(child.number).padStart(2, '0') : '└'}</span>${child.name}${child.id === teachingSample.piece ? '<em class="sample-tag">样例</em>' : ''}</button>${!detail ? eye(child) : ''}</div>`).join('')}</div>` : ''}</section>`;
  }).join('');
  $('#layer-list').querySelectorAll('[data-select]').forEach(b => b.addEventListener('click', () => select(b.dataset.select, !layers.some(p => p.id === b.dataset.select))));
  $('#layer-list').querySelectorAll('[data-visibility]').forEach(b => b.addEventListener('click', () => toggleVisibility(b.dataset.visibility)));
  $('#layer-list').querySelectorAll('[data-expand]').forEach(b => b.addEventListener('click', () => { state.openGroup = state.openGroup === b.dataset.expand ? null : b.dataset.expand; renderCatalog(); }));
}
function renderInfo() {
  const item = getItem(state.selection);
  if (!item) {
    $('#info-card').innerHTML = `<div class="info-eyebrow">从这里开始 ${icon('compass')}</div><h3>屋顶，如何被托起？</h3><p>选择“按构件”展开，分别看看梁、檩和椽。点开目录，还能继续辨认柱、阑额与普拍枋。</p><button class="text-action" id="enter-detail">走近一组斗拱 ${icon('arrow')}</button><button class="text-action" id="start-sample">从这个斗开始 ${icon('arrow')}</button>`;
  } else {
    const samplePiece = item.id === teachingSample.piece;
    const sampleNeighbor = Boolean(sampleHome) && teachingSample.neighbors.some(entry => entry.id === item.id);
    const photoButton = item.photo ? (photos[item.photo] ? `<button class="text-action" id="${samplePiece ? 'sample-photo' : 'compare-photo'}">${samplePiece ? '到实景里找这件斗' : '对照实景照片'} ${icon('photo')}</button>` : `<a class="text-action" href="${photoReferences[item.photo].page}" target="_blank" rel="noopener noreferrer">查阅${photoReferences[item.photo].title} ↗</a>`) : '';
    $('#info-card').innerHTML = `<div class="info-eyebrow">${item.en}<span>${item.piece ? `第 ${String(item.number).padStart(2, '0')} 件 / 共 14 件` : '构件笔记'}</span></div><h3>${item.name}</h3><p>${item.desc}</p><div class="connection">${icon('layers')}<span>${item.connection}</span></div>${item.tip ? `<p class="info-tip">${item.tip}</p>` : ''}${sampleCard(samplePiece, sampleNeighbor)}${item.id === 'dougong' ? `<button class="text-action" id="enter-detail">逐件拆开这一组斗拱 ${icon('arrow')}</button><button class="text-action" id="start-sample">从这个斗开始 ${icon('arrow')}</button>` : ''}${photoButton}<button class="text-action" id="inspect-component">放大观察 · 看作用 ${icon('cube')}</button><small class="evidence">${item.evidence || (item.piece || parts.some(p => p.id === item.id) ? '通用教学模型 · 14 件为本示意件数，非实物构件清单；槽口未据实测复原。' : '构件方向与组合关系示意 · 数量、尺寸与排布未据实测复原。')}</small>`;
  }
  $('#inspect-component')?.addEventListener('click', () => inspectSelected());
  $('#enter-detail')?.addEventListener('click', () => changeMode('detail'));
  $('#start-sample')?.addEventListener('click', startSample);
  $('#sample-photo')?.addEventListener('click', openSamplePhoto);
  $('#return-sample')?.addEventListener('click', returnToSample);
  $('#info-card').querySelectorAll('[data-neighbor]').forEach(button => button.addEventListener('click', () => viewNeighbor(button.dataset.neighbor)));
  $('#compare-photo')?.addEventListener('click', () => { state.sampleMarker = false; state.photo = item.photo; changeMode('photo'); $('.stage').scrollIntoView({ behavior: state.reduced ? 'instant' : 'smooth' }); });
}
function sampleCard(samplePiece, sampleNeighbor) {
  if (document.body.dataset.story === 'active') return '';
  if (samplePiece) {
    const chips = teachingSample.neighbors.map(entry => `<button class="sample-chip" data-neighbor="${entry.id}">${pieceName(entry.id)}<small>${entry.relation}</small></button>`).join('');
    return `<div class="sample-path"><p class="sample-kicker">${teachingSample.kicker} · ${teachingSample.title}</p><p>${teachingSample.blurb}</p><div class="sample-chips">${chips}</div></div>`;
  }
  if (sampleNeighbor) return `<button class="text-action" id="return-sample">回到${pieceName(teachingSample.piece) || teachingSample.title} ${icon('reset')}</button>`;
  return '';
}
function updateSelectionTools() {
  const item = getItem(state.selection);
  const isPiece = state.mode === 'detail' && item?.piece;
  $('#piece-tools').hidden = !isPiece;
  if (isPiece) {
    $('#piece-note').textContent = `${String(item.number).padStart(2, '0')} · ${item.name} ⓘ`;
    $('#extract-piece').textContent = state.extracted ? '放回原位 ↙' : '抽出观察 ↗';
    $('#extract-piece').setAttribute('aria-pressed', state.extracted);
  }
  $('#mobile-selection').hidden = !item || isPiece;
  if (item) $('#mobile-selection').innerHTML = `<strong>${item.name}</strong><span>放大看作用 ↗</span>`;
}
function select(id, inspect = false) {
  state.selection = id; state.extracted = false;
  const item = getItem(id);
  state.openGroup = item?.parent || item?.type || id;
  for (const key of [item?.parent, id]) {
    if (state.hidden.has(key)) { state.hidden.delete(key); viewer?.visibility(key, true); }
  }
  viewer?.select(id);
  renderCatalog(); renderInfo(); buildLabels(); updateSelectionTools();
  tour?.record('select', item?.type || id);
  if (inspect && item) inspector.open(item, sampleContext(item));
}
function toggleVisibility(id) {
  const visible = state.hidden.has(id);
  visible ? state.hidden.delete(id) : state.hidden.add(id);
  viewer?.visibility(id, visible); renderCatalog();
  notify(`${getItem(id).name}已${visible ? '显示' : '隐藏'}`);
}
function buildLabels() {
  const labels = state.mode === 'detail' ? (getItem(state.selection)?.piece ? [getItem(state.selection)] : ['piece-2', 'piece-3', 'piece-1'].map(getItem).filter(Boolean)) : (getItem(state.selection)?.parent ? [getItem(state.selection)] : layers.filter(p => ['roof', 'dougong', 'columns'].includes(p.id)));
  $('#labels').innerHTML = labels.map(p => `<button class="model-label" data-label="${p.id}"><span></span>${p.name}</button>`).join('');
  $('#labels').querySelectorAll('button').forEach(b => b.addEventListener('click', () => select(b.dataset.label, true)));
}
function syncModeChrome(mode) {
  document.body.dataset.mode = mode;
  const exploring = mode !== 'photo' && !tour?.active;
  const photographing = mode === 'photo' && !tour?.active;
  $('#nav-model').classList.toggle('active', exploring);
  $('#nav-photo').classList.toggle('active', photographing);
  $('#nav-model').setAttribute('aria-current', exploring ? 'page' : 'false');
  $('#nav-photo').setAttribute('aria-current', photographing ? 'page' : 'false');
  $('#mode-hall').classList.toggle('selected', mode === 'hall');
  $('#mode-detail').classList.toggle('selected', mode === 'detail');
  $('#mode-hall').setAttribute('aria-pressed', mode === 'hall');
  $('#mode-detail').setAttribute('aria-pressed', mode === 'detail');
  $('#photo-view').hidden = mode !== 'photo';
  $('#viewer').style.visibility = mode === 'photo' ? 'hidden' : 'visible';
  $('#model-note').textContent = mode === 'detail' ? '通用斗拱关系示意 / 非实测复原' : '教学示意 / 非测绘复原';
  $('#explode-label').textContent = mode === 'detail' ? '构件展开' : '结构展开';
  $('#range-middle').textContent = mode === 'detail' ? '逐件辨认' : '显露木构';
  $('#range-start').textContent = mode === 'detail' ? '合拢构件' : '完整建筑';
  $('#granularity').hidden = mode !== 'hall';
  if (mode === 'photo') showPhoto(state.photo);
}
function changeMode(mode) {
  if (!viewer && mode !== 'photo') { notify('当前设备暂不支持 3D，请先查看实景和构件说明。'); return; }
  stopAnimation();
  const was = state.mode; state.mode = mode;
  state.extracted = false; viewer?.extract(null);
  viewer?.setMode(mode);
  if (was === 'photo' && mode !== 'photo') state.sampleMarker = false;
  if (mode !== 'photo' && mode !== was) { state.selection = null; viewer?.select(null); setExplode(0); }
  syncModeChrome(mode);
  buildLabels(); renderCatalog(); renderInfo();
  $('#mobile-selection').hidden = true;
  if (mode === 'detail' && mode !== was) select('piece-2');
  updateSelectionTools();
}
function startSample() {
  if (!viewer) { notify('当前设备暂不支持 3D，请先查看实景和构件说明。'); return; }
  awayFromSample = false;
  sampleHome = null;
  if (state.mode !== 'detail') changeMode('detail');
  else if (state.selection !== teachingSample.piece) select(teachingSample.piece);
  if (state.explode < 15) setExplode(40);
  sampleHome = { mode: 'detail', explode: state.explode, selection: teachingSample.piece, camera: viewer.captureView() };
  awayFromSample = false;
  state.sampleMarker = false;
  inspector.open(getItem(teachingSample.piece), sampleContext(getItem(teachingSample.piece)));
}
function viewNeighbor(id) {
  if (!viewer || !teachingSample.neighbors.some(entry => entry.id === id)) return;
  if (state.mode !== 'detail') changeMode('detail');
  freezeSampleHome();
  awayFromSample = true;
  if (state.explode < 15) setExplode(40);
  select(id, inspector.dialog.open);
  viewer.focusPiece(id);
  notify(`相邻构件 · ${pieceName(id)}`);
}
function returnToSample() {
  if (!viewer) return;
  const home = sampleHome || { mode: 'detail', explode: state.explode, selection: teachingSample.piece, camera: viewer.captureView() };
  const reopen = inspector.dialog.open;
  stopAnimation();
  state.sampleMarker = false;
  state.extracted = false;
  viewer.extract(null);
  awayFromSample = false;
  state.mode = home.mode;
  viewer.setMode(home.mode);
  setExplode(home.explode);
  if (home.camera) viewer.restoreView(home.camera);
  syncModeChrome(home.mode);
  select(home.selection, reopen);
  notify(`已回到${pieceName(home.selection) || teachingSample.title}`);
  if (!reopen) $('#inspect-component')?.focus({ preventScroll: true });
}
function openSamplePhoto() {
  if (state.mode === 'detail' && state.selection === teachingSample.piece) freezeSampleHome();
  awayFromSample = true;
  state.sampleMarker = true;
  state.photo = teachingSample.photo;
  if (inspector.dialog.open) inspector.dialog.close();
  changeMode('photo');
  $('.stage').scrollIntoView({ behavior: state.reduced ? 'instant' : 'smooth' });
}
function setExplode(value) {
  if (state.extracted) { state.extracted = false; viewer?.extract(null); updateSelectionTools(); }
  state.explode = Math.max(0, Math.min(100, value));
  $('#explode').value = state.explode;
  $('#explode').style.setProperty('--progress', `${state.explode}%`);
  $('#percent').innerHTML = `${Math.round(state.explode)}<span>%</span>`;
  viewer?.explode(state.explode / 100);
  tour?.record('explode', state.explode);
  $('#assemble').innerHTML = `${icon('play')}<span>${state.explode > 50 ? '重新合拢' : '播放拆解'}</span>`;
  $('#control-hint').textContent = state.mode === 'detail' ? '展开用于观察位置，不代表施工顺序' : state.explode > 11 ? (state.fine ? '梁、檩、椽分别展开 · 可逐类显隐' : '围护已隐去，木构关系更清楚') : '拖动滑块，看看屋檐之下';
}
function stopAnimation() { if (state.animation) cancelAnimationFrame(state.animation); state.animation = null; $('#assemble').innerHTML = `${icon('play')}<span>${state.explode > 50 ? '重新合拢' : '播放拆解'}</span>`; }
function animateExplode(target) {
  stopAnimation();
  if (state.reduced || Math.abs(target - state.explode) < 0.1) { setExplode(target); return; }
  const start = performance.now(), from = state.explode;
  const tick = now => {
    const t = Math.min((now - start) / 2600, 1), eased = t * t * (3 - 2 * t);
    setExplode(from + (target - from) * eased);
    if (t < 1) { $('#assemble').innerHTML = `${icon('pause')}<span>暂停动画</span>`; state.animation = requestAnimationFrame(tick); }
    else { state.animation = null; notify(target === 0 ? '模型已合拢' : '模型已展开，可点击构件继续观察'); }
  };
  state.animation = requestAnimationFrame(tick);
}
function showPhoto(id) {
  state.photo = id; const p = photos[id];
  const marked = state.sampleMarker && id === teachingSample.photo && document.body.dataset.story !== 'active';
  const sampleReturn = state.sampleMarker && sampleHome && document.body.dataset.story !== 'active';
  $('#reference-photo').src = p.src; $('#reference-photo').alt = p.alt;
  $('#photo-title').textContent = p.title;
  $('#photo-note').textContent = marked ? teachingSample.marker.note : p.note;
  $('#photo-source').href = p.page;
  const markers = $('#photo-markers');
  markers.hidden = !marked;
  if (marked) {
    const marker = teachingSample.marker;
    markers.innerHTML = `<div class="photo-marker" style="left:${marker.x}%;top:${marker.y}%" role="img" aria-label="${marker.name}，${marker.role}。教学观察点，不是实测定位。"><span class="photo-marker-dot"></span><span class="photo-marker-card"><strong>${marker.name}</strong><small>${marker.role}</small></span></div>`;
  }
  $('#back-model').innerHTML = sampleReturn ? `${icon('cube')}回到这件斗 ${icon('arrow')}` : `${icon('cube')}返回模型，继续观察 ${icon('arrow')}`;
  document.querySelectorAll('[data-photo]').forEach(b => { b.classList.toggle('selected', b.dataset.photo === id); b.setAttribute('aria-pressed', b.dataset.photo === id); });
}
function toggleExtract() {
  if (!viewer) return;
  if (!getItem(state.selection)?.piece) select('piece-3');
  state.extracted = !state.extracted;
  viewer.extract(state.extracted ? state.selection : null);
  updateSelectionTools();
  tour?.record('extract', { id: state.selection, extracted: state.extracted });
}
function manualMode(mode) {
  if (tour?.active) tour.close();
  changeMode(mode);
}

document.querySelectorAll('[data-fine]').forEach(b => b.addEventListener('click', () => {
  state.fine = b.dataset.fine === 'true'; viewer?.setFine(state.fine);
  document.querySelectorAll('[data-fine]').forEach(button => { const active = button.dataset.fine === String(state.fine); button.classList.toggle('selected', active); button.setAttribute('aria-pressed', active); });
  setExplode(state.explode);
}));
$('#extract-piece').addEventListener('click', toggleExtract);
$('#piece-note').addEventListener('click', inspectSelected);
$('#mode-hall').addEventListener('click', () => manualMode('hall'));
$('#mode-detail').addEventListener('click', () => manualMode('detail'));
$('#nav-model').addEventListener('click', () => manualMode('hall'));
$('#nav-photo').addEventListener('click', () => { state.photo = state.mode === 'detail' ? 'dougong' : 'hall'; manualMode('photo'); });
$('#back-model').addEventListener('click', () => { if (state.sampleMarker && sampleHome) returnToSample(); else changeMode(state.photo === 'dougong' ? 'detail' : 'hall'); });
$('#explode').addEventListener('input', e => { stopAnimation(); setExplode(Number(e.target.value)); });
$('#assemble').addEventListener('click', () => state.animation ? stopAnimation() : animateExplode(state.explode > 50 ? 0 : 100));
$('#reset-view').addEventListener('click', () => { viewer?.reset(); notify('视角已复位'); });
$('#front-view').addEventListener('click', () => { viewer?.reset(true, true); notify('已转到正面'); });
$('#toggle-labels').addEventListener('click', () => { state.labels = !state.labels; $('#labels').hidden = !state.labels; $('#toggle-labels').classList.toggle('is-on', state.labels); $('#toggle-labels').setAttribute('aria-pressed', state.labels); });
$('#toggle-rotate').addEventListener('click', () => { state.rotate = !state.rotate; if (viewer) viewer.autoRotate = state.rotate; $('#toggle-rotate').classList.toggle('is-on', state.rotate); $('#toggle-rotate').setAttribute('aria-pressed', state.rotate); });
$('#start-guide').addEventListener('click', () => tour.start());
$('#nav-story').addEventListener('click', () => { if (!tour.active) tour.start(); else $('.workspace').scrollIntoView({ block: 'start' }); });
document.querySelectorAll('[data-photo]').forEach(b => b.addEventListener('click', () => showPhoto(b.dataset.photo)));
const dialog = $('#sources-dialog');
let dialogOpener;
function openDialog(event) { dialogOpener = event.currentTarget; dialog.showModal(); }
$('#nav-about').addEventListener('click', openDialog); $('#open-sources').addEventListener('click', openDialog);
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => dialogOpener?.focus());
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
$('#reference-photo').addEventListener('error', () => { $('#photo-note').textContent = '照片加载失败，可通过下方“原图”链接查看来源。'; });
$('#mobile-selection').addEventListener('click', inspectSelected);

tour = new StoryTour($('#story-panel'), {
  open() {
    document.body.dataset.story = 'active';
    $('#story-scene-caption').hidden = false;
    $('#nav-story').classList.add('active'); $('#nav-story').setAttribute('aria-current', 'page');
    state.hidden.forEach(id => viewer?.visibility(id, true)); state.hidden.clear();
    state.rotate = false; if (viewer) viewer.autoRotate = false;
    $('#toggle-rotate').classList.remove('is-on'); $('#toggle-rotate').setAttribute('aria-pressed', 'false');
    state.labels = true; $('#labels').hidden = false;
    $('#toggle-labels').classList.add('is-on'); $('#toggle-labels').setAttribute('aria-pressed', 'true');
    state.fine = true; viewer?.setFine(true);
    document.querySelectorAll('[data-fine]').forEach(b => { const active = b.dataset.fine === 'true'; b.classList.toggle('selected', active); b.setAttribute('aria-pressed', active); });
  },
  scene(chapter) {
    stopAnimation();
    if (chapter.photo) state.photo = chapter.photo;
    changeMode(chapter.mode);
    select(chapter.selection || null);
    if (chapter.explode != null) { setExplode(chapter.explode * 100); viewer?.reset(); }
  },
  chapter(index, chapter) {
    $('#story-scene-caption').innerHTML = `<span>抬头之后</span><span>${chapter ? `${String(index + 1).padStart(2, '0')} · ${chapter.place}` : '尾声 · 再一次仰望'}</span>`;
    $('#story-panel').scrollTop = 0;
    $('#story-title')?.focus({ preventScroll: true });
    if (matchMedia('(max-width: 780px)').matches) $('.workspace').scrollIntoView({ behavior: 'instant', block: 'start' });
  },
  select: id => select(id, true),
  try(kind) {
    if (kind === 'lift') animateExplode(70);
    if (kind === 'extract') toggleExtract();
  },
  context() { const item = getItem(state.selection); return { type: item?.type || item?.id, name: item?.name, extracted: state.extracted }; },
  sources(button) { openDialog({ currentTarget: button }); },
  close(free) {
    stopAnimation();
    delete document.body.dataset.story;
    $('#story-scene-caption').hidden = true;
    $('#nav-story').classList.remove('active'); $('#nav-story').removeAttribute('aria-current');
    if (free) { changeMode('hall'); setExplode(60); select('dougong'); }
    else changeMode(state.mode);
    viewer?.reset();
    $('#nav-story').focus({ preventScroll: true });
  },
});

function inspectSelected() { const item = getItem(state.selection); if (item) inspector.open(item, sampleContext(item)); }
function showPage(next, push = true, startStory = false) {
  stopAnimation();
  if (inspector.dialog.open) inspector.dialog.close();
  if (dialog.open) dialog.close();
  if (tour.active) tour.close();
  page = next;
  const isHome = next === 'home';
  $('#home-view').hidden = !isHome; $('#building-view').hidden = isHome;
  document.body.dataset.route = next;
  $('#edition-note').textContent = isHome ? 'GUANMU / ARCHITECTURE STORIES' : 'DAYUN TEMPLE / VOL. 01';
  document.title = isHome ? '观木 · 从一次仰望开始' : '观木 · 大云院弥陀殿';
  if (push) history.pushState({ page: next }, '', isHome ? location.pathname + location.search : '#/dayun');
  if (viewer) {
    if (isHome) viewer.paused = true;
    else { viewer.setMode(state.mode); requestAnimationFrame(() => { viewer.resize(); viewer.reset(false); }); }
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (startStory && viewer) tour.start();
}
$('.brand').addEventListener('click', event => { event.preventDefault(); showPage('home'); });
$('#nav-collection').addEventListener('click', () => $('#building-collection').scrollIntoView({ behavior: state.reduced ? 'instant' : 'smooth' }));
$('#nav-approach').addEventListener('click', () => $('#home-approach').scrollIntoView({ behavior: state.reduced ? 'instant' : 'smooth' }));
$('#home-view').querySelectorAll('[data-enter]').forEach(b => b.addEventListener('click', () => showPage('building')));
$('#home-view').querySelectorAll('[data-story]').forEach(b => b.addEventListener('click', () => showPage('building', true, true)));
window.addEventListener('popstate', () => showPage(location.hash.startsWith('#/dayun') ? 'building' : 'home', false));
showPage(location.hash.startsWith('#/dayun') ? 'building' : 'home', false);

renderCatalog(); renderInfo(); buildLabels();
requestAnimationFrame(() => {
  try {
    viewer = new ArchitectureViewer($('#viewer'), id => select(id, true), notify);
    viewer.onFrame = labels => {
      for (const item of labels) {
        const el = $(`[data-label="${item.id}"]`);
        if (!el) continue;
        const inBounds = item.x > 25 && item.x < $('#viewer').clientWidth - 80 && item.y > 20 && item.y < $('#viewer').clientHeight - 30;
        el.style.transform = `translate(${item.x}px,${item.y}px)`;
        el.style.visibility = item.visible && inBounds ? 'visible' : 'hidden';
      }
    };
    $('#loading').hidden = true;
    document.body.dataset.ready = 'true';
    if (page === 'home') viewer.paused = true;
  } catch (error) {
    console.error('3D initialization failed:', error);
    $('#loading').hidden = true; changeMode('photo');
    notify('当前设备无法启动 3D，可以先浏览实景照片和构件说明。');
    document.body.dataset.ready = 'fallback';
    document.querySelectorAll('#mode-hall, #mode-detail, #nav-model, #back-model, #start-guide, #nav-story, #enter-detail').forEach(b => b.disabled = true);
  }
});
window.addEventListener('pagehide', event => { stopAnimation(); if (!event.persisted) { viewer?.dispose(); inspector.dispose(); } });
