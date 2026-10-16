import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { hallParts } from './content.js';

const palette = { wood: 0xa47c50, light: 0xc3a071, dark: 0x79563c, tile: 0x737970, stone: 0xc4c0b2, wall: 0x9c8b75 };

// A teaching model, not a measured reconstruction of the hall's historic fabric.
export class ArchitectureViewer {
  constructor(container, onSelect, onStatus) {
    this.container = container;
    this.onSelect = onSelect;
    this.onStatus = onStatus;
    this.mode = 'hall';
    this.amount = 0;
    this.targetAmount = 0;
    this.selected = null;
    this.autoRotate = false;
    this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.meshes = [];
    this.materials = new Map();
    this.hidden = new Set();
    this.fine = true;
    this.pieces = new Map();
    this.extracted = null;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#f1f0e9');
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.36;
    this.renderer.domElement.setAttribute('aria-label', '可旋转的建筑模型，拖动旋转、滚动缩放；也可用构件目录和视角按钮操作');
    this.renderer.domElement.setAttribute('role', 'img');
    container.append(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 150);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minPolarAngle = 0.12;
    this.controls.maxPolarAngle = Math.PI / 2.08;
    this.controls.enablePan = true;
    this.controls.autoRotateSpeed = 0.65;
    this.controls.addEventListener('start', () => { this.cameraMotion = null; });
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xa29a80, 2.5));
    const light = new THREE.DirectionalLight(0xfff5df, 4.1);
    light.position.set(-12, 21, 12);
    light.castShadow = true;
    light.shadow.mapSize.set(2048, 2048);
    Object.assign(light.shadow.camera, { left: -18, right: 18, top: 22, bottom: -18, near: 1, far: 60 });
    light.shadow.normalBias = 0.045;
    this.scene.add(light);
    const fill = new THREE.DirectionalLight(0xd7e4ef, 1.25);
    fill.position.set(10, 7, -10);
    this.scene.add(fill);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(180, 180), new THREE.ShadowMaterial({ color: 0x626a50, opacity: 0.16 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.12;
    ground.receiveShadow = true;
    this.scene.add(ground);
    this.hall = new THREE.Group();
    this.detail = new THREE.Group();
    this.scene.add(this.hall, this.detail);
    this.groups = {};
    ['base', 'columns', 'dougong', 'frame', 'roof'].forEach(id => {
      const group = new THREE.Group(); group.userData.id = id;
      this.groups[id] = group; this.hall.add(group);
    });
    for (const part of hallParts) {
      const group = new THREE.Group(); group.userData.id = part.id;
      this.groups[part.id] = group; this.groups[part.parent].add(group);
    }
    this.makeHall();
    this.detailParts = this.bracket(this.detail, 0, 0.2, 0, 0, 2.65, true);
    this.detail.visible = false;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.renderer.domElement.addEventListener('pointerdown', e => { this.pointerStart = [e.clientX, e.clientY]; });
    this.renderer.domElement.addEventListener('pointerup', e => this.pick(e));
    this.renderer.domElement.addEventListener('webglcontextlost', e => {
      e.preventDefault(); this.onStatus('3D 显示暂时中断，请刷新页面恢复。仍可查看实景照片与构件说明。');
    });
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(container);
    this.resize();
    this.reset(false);
    this.lastTime = performance.now();
    this.frame = this.frame.bind(this);
    this.frameId = requestAnimationFrame(this.frame);
  }

  material(color, id, opacity = 1) {
    const key = `${color}-${id}-${opacity}`;
    if (!this.materials.has(key)) {
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.88, metalness: 0, transparent: opacity < 1, opacity, side: THREE.DoubleSide });
      mat.userData = { id, opacity };
      this.materials.set(key, mat);
    }
    return this.materials.get(key);
  }

  mesh(parent, geometry, position, color, id, opacity = 1) {
    const m = new THREE.Mesh(geometry, this.material(color, id, opacity));
    m.position.set(...position);
    m.userData.id = id;
    m.castShadow = true; m.receiveShadow = true;
    (hallParts.some(p => p.id === id) ? this.groups[id] : parent).add(m); this.meshes.push(m);
    return m;
  }
  box(parent, size, position, color, id, opacity) { return this.mesh(parent, new THREE.BoxGeometry(...size), position, color, id, opacity); }
  rod(parent, start, end, radius, color, id, segments = 8) {
    const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end);
    const m = this.mesh(parent, new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), segments), a.clone().add(b).multiplyScalar(0.5).toArray(), color, id);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize());
    return m;
  }
  tube(parent, points, radius, color, id) {
    const path = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    return this.mesh(parent, new THREE.TubeGeometry(path, 16, radius, 5, false), [0, 0, 0], color, id);
  }

  gong(parent, width, y, z, color, id, rotated = false) {
    const s = new THREE.Shape();
    s.moveTo(-width / 2, 0.19); s.lineTo(width / 2, 0.19);
    s.lineTo(width / 2, 0.03); s.quadraticCurveTo(width * 0.3, -0.02, width * 0.2, -0.18);
    s.lineTo(-width * 0.2, -0.18); s.quadraticCurveTo(-width * 0.3, -0.02, -width / 2, 0.03); s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.23, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 1, steps: 1, curveSegments: 5 });
    geo.translate(0, 0, -0.115);
    const m = this.mesh(parent, geo, [0, y, z], color, id);
    if (rotated) m.rotation.y = Math.PI / 2;
    return m;
  }

  dou(parent, x, y, z, size, id, detailed = false) {
    const d = new THREE.Group(); d.position.set(x, y, z); parent.add(d);
    const geo = new THREE.CylinderGeometry(size * 0.7, size * 0.48, size * 0.34, 4);
    geo.rotateY(Math.PI / 4);
    this.mesh(d, geo, [0, 0, 0], palette.light, id);
    if (detailed) {
      for (const a of [-1, 1]) for (const b of [-1, 1]) this.box(d, [size * 0.26, size * 0.22, size * 0.26], [a * size * 0.34, size * 0.28, b * size * 0.34], palette.light, id);
    } else {
      this.box(d, [size, size * 0.15, size], [0, size * 0.2, 0], palette.light, id);
    }
    return d;
  }

  bracket(parent, x, y, z, rotation, scale = 0.8, detailed = false) {
    const root = new THREE.Group(); root.position.set(x, y, z); root.rotation.y = rotation; root.scale.setScalar(scale); parent.add(root);
    const pieces = [];
    const add = (type, name, level, xSpread, zSpread, build) => {
      const number = pieces.length + 1;
      const id = detailed ? `piece-${number}` : 'dougong';
      const g = new THREE.Group(); root.add(g);
      g.userData = { id, type, level, xSpread, zSpread, pull: 0 };
      build(g, id); pieces.push(g);
      if (detailed) {
        this.pieces.set(id, { id, type, name, number, level, object: g });
      }
    };
    add('pupai', '普拍枋', 0, 0, 0, (g, id) => this.box(g, [2.1, 0.14, 0.53], [0, 0.07, 0], palette.dark, id));
    add('dou', '底部大斗', 1, 0, 0, (g, id) => this.dou(g, 0, 0.31, 0, 0.58, id, detailed));
    add('gong', '下层横栱', 2, -0.28, 0, (g, id) => this.gong(g, 1.65, 0.65, 0, palette.wood, id));
    add('qiao', '下层出挑构件', 2, 0, 0.55, (g, id) => this.gong(g, 1.45, 0.67, 0.3, palette.dark, id, true));
    [-0.67, 0.67].forEach((a, i) => add('dou', `中层${i ? '右' : '左'}斗`, 3, a * 0.65, -0.1, (g, id) => this.dou(g, a, 0.97, 0, 0.31, id, detailed)));
    add('dou', '中层前斗', 3, 0, 0.65, (g, id) => this.dou(g, 0, 0.97, 0.89, 0.34, id, detailed));
    add('gong', '上层后横栱', 4, -0.2, -0.3, (g, id) => this.gong(g, 2.15, 1.2, 0, palette.light, id));
    add('qiao', '上层出挑构件', 4, 0, 0.45, (g, id) => this.gong(g, 1.7, 1.2, 0.76, palette.wood, id, true));
    add('gong', '上层前横栱', 4, 0.2, 0.8, (g, id) => this.gong(g, 1.55, 1.2, 0.89, palette.wood, id));
    [-0.88, 0.88].forEach((a, i) => add('dou', `顶部后${i ? '右' : '左'}斗`, 5, a * 0.65, -0.3, (g, id) => this.dou(g, a, 1.52, 0, 0.3, id, detailed)));
    [-0.58, 0.58].forEach((a, i) => add('dou', `顶部前${i ? '右' : '左'}斗`, 5, a * 0.8, 0.8, (g, id) => this.dou(g, a, 1.52, 0.89, 0.27, id, detailed)));
    return pieces;
  }

  makeHall() {
    const { base, columns, dougong, frame, roof } = this.groups;
    this.box(base, [14, 0.35, 12.2], [0, 0.075, 0], 0xbcb7a9, 'base');
    this.box(base, [13.5, 0.52, 11.7], [0, 0.5, 0], palette.stone, 'base');
    this.box(base, [13.8, 0.13, 12], [0, 0.82, 0], 0xd3cebd, 'base');
    for (let i = 0; i < 4; i++) this.box(base, [4.2, 0.18 * (4 - i), 0.5], [0, 0.09 * (4 - i), 6.15 + i * 0.46], 0xbeb8a7, 'base');
    // Fine stone joints make the platform legible without pretending to measured masonry.
    for (let x = -6; x < 7; x += 1.1) this.box(base, [0.012, 0.41, 0.008], [x, 0.47, 5.855], 0xa8a292, 'base');
    const locations = [];
    const xs = [-4.8, -1.65, 1.65, 4.8];
    for (const x of xs) for (const z of [-3.8, 3.8]) locations.push([x, z, z > 0 ? 0 : Math.PI]);
    for (const x of [-4.8, 4.8]) for (const z of [-1.25, 1.25]) locations.push([x, z, x > 0 ? Math.PI / 2 : -Math.PI / 2]);
    for (const [x, z, rotation] of locations) {
      this.mesh(base, new THREE.CylinderGeometry(0.39, 0.46, 0.23, 12), [x, 0.99, z], 0xb5b0a1, 'foundation');
      this.mesh(columns, new THREE.CylinderGeometry(0.19, 0.245, 3.22, 12), [x, 2.7, z], palette.dark, 'column');
      this.bracket(dougong, x, 4.33, z, rotation, 0.73);
    }
    for (const z of [-3.8, 3.8]) {
      this.box(columns, [10.1, 0.32, 0.24], [0, 4.04, z], palette.wood, 'lane');
      this.box(columns, [10.5, 0.12, 0.48], [0, 4.29, z], palette.light, 'pupai-hall');
    }
    for (const x of [-4.8, 4.8]) {
      this.box(columns, [0.24, 0.32, 8.05], [x, 4.04, 0], palette.wood, 'lane');
      this.box(columns, [0.48, 0.12, 8.45], [x, 4.29, 0], palette.light, 'pupai-hall');
    }
    this.enclosure = new THREE.Group(); columns.add(this.enclosure);
    this.box(this.enclosure, [9.3, 2.8, 0.24], [0, 2.5, -3.84], palette.wall, 'columns', 0.75);
    for (const x of [-4.82, 4.82]) this.box(this.enclosure, [0.24, 2.8, 7.6], [x, 2.5, 0], palette.wall, 'columns', 0.75);
    // Front doors and lattice openings retain the three-bay reading.
    for (const x of [-3.25, 3.25]) {
      this.box(this.enclosure, [2.65, 1.12, 0.14], [x, 1.72, 3.8], 0x9d785b, 'columns');
      this.box(this.enclosure, [2.7, 0.11, 0.23], [x, 2.3, 3.8], palette.dark, 'columns');
      this.box(this.enclosure, [2.7, 0.11, 0.23], [x, 3.77, 3.8], palette.dark, 'columns');
      for (let n = -5; n <= 5; n++) this.box(this.enclosure, [0.045, 1.45, 0.1], [x + n * 0.24, 3.02, 3.8], palette.dark, 'columns');
      for (let n = 0; n < 5; n++) this.box(this.enclosure, [2.65, 0.035, 0.1], [x, 2.43 + n * 0.28, 3.8], palette.dark, 'columns');
    }
    for (const x of [-0.83, 0.83]) {
      this.box(this.enclosure, [1.58, 2.58, 0.16], [x, 2.4, 3.78], 0x875c43, 'columns');
      for (let i = -2; i <= 2; i++) this.box(this.enclosure, [0.027, 2.48, 0.025], [x + i * 0.28, 2.4, 3.875], 0x674b35, 'columns');
    }
    for (const x of xs) {
      this.box(frame, [0.34, 0.43, 8.6], [x, 5.3, 0], palette.wood, 'beam');
      this.box(frame, [0.33, 0.35, 5.4], [x, 6.12, 0], palette.light, 'beam');
      for (const z of [-2.35, 2.35]) this.box(frame, [0.4, 0.5, 0.58], [x, 5.8, z], palette.dark, 'support');
      this.box(frame, [0.3, 0.3, 2.65], [x, 7.02, 0], palette.wood, 'beam');
      for (const z of [-1.15, 1.15]) this.box(frame, [0.29, 0.6, 0.32], [x, 6.59, z], palette.light, 'support');
      this.box(frame, [0.22, 0.55, 0.22], [x, 7.41, 0], palette.dark, 'support');
    }
    for (const z of [-4.85, -3.1, -1.55, 0, 1.55, 3.1, 4.85]) {
      const y = this.roofY(Math.abs(z)) - 0.38;
      this.rod(frame, [-5.6, y, z], [5.6, y, z], 0.14, palette.light, 'purlin');
    }
    for (let x = -5.15; x <= 5.2; x += 0.53) {
      for (const sign of [-1, 1]) {
        const points = Array.from({ length: 7 }, (_, i) => [x, this.roofY(i) - 0.19, sign * i]);
        this.tube(frame, points, 0.055, palette.wood, 'rafter');
      }
    }
    this.makeRoof(roof);
  }

  roofY(z) { return 5.47 + 2.45 * Math.pow(1 - z / 6, 1.5); }
  roofWidth(z) { return 5.12 + Math.max(0, z - 2.7) / 3.3 * 2.03; }
  makeRoof(group) {
    const surface = fn => {
      const points = [], indices = [], nx = 30, ny = 18;
      for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) points.push(...fn(i / nx, j / ny));
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const a = j * (nx + 1) + i; indices.push(a, a + 1, a + nx + 1, a + 1, a + nx + 2, a + nx + 1);
      }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3)); geo.setIndex(indices); geo.computeVertexNormals();
      this.mesh(group, geo, [0, 0, 0], palette.tile, 'roof');
    };
    const frontPoint = (u, t, sign, offset = 0) => {
      const z = 6 * t, x = (u * 2 - 1) * this.roofWidth(z);
      return [x, this.roofY(z) + 0.24 * Math.pow(Math.abs(u * 2 - 1), 8) * t ** 4 + offset, sign * z];
    };
    for (const sign of [-1, 1]) {
      surface((u, t) => frontPoint(u, t, sign));
      for (let n = 0; n <= 48; n++) this.tube(group, Array.from({ length: 10 }, (_, i) => frontPoint(n / 48, i / 9, sign, 0.035)), 0.032, 0x85897c, 'roof');
      for (let n = 1; n <= 14; n++) this.tube(group, Array.from({ length: 9 }, (_, i) => frontPoint(i / 8, n / 14, sign, 0.012)), 0.012, 0x62685e, 'roof');
      this.tube(group, Array.from({ length: 13 }, (_, i) => frontPoint(i / 12, 1, sign, -0.04)), 0.1, palette.dark, 'roof');
    }
    for (const side of [-1, 1]) {
      const sidePoint = (u, t, offset = 0) => [side * (5.12 + 2.03 * t), this.roofY(2.7) * (1 - t) + 5.47 * t + 0.24 * Math.pow(Math.abs(u * 2 - 1), 8) * t ** 4 + offset, (u * 2 - 1) * (2.7 + 3.3 * t)];
      surface((u, t) => sidePoint(u, t));
      for (let n = 0; n <= 28; n++) this.tube(group, Array.from({ length: 8 }, (_, i) => sidePoint(n / 28, i / 7, 0.03)), 0.031, 0x85897c, 'roof');
      this.tube(group, Array.from({ length: 13 }, (_, i) => sidePoint(i / 12, 1, -0.04)), 0.1, palette.dark, 'roof');
      for (const zsign of [-1, 1]) this.tube(group, Array.from({ length: 10 }, (_, i) => frontPoint(side > 0 ? 1 : 0, i / 9, zsign, 0.1)), 0.1, 0x6c7064, 'roof');
      // Open gable with restrained timber detail.
      const a = [side * 5.1, this.roofY(2.7) - 0.04, -2.7], b = [side * 5.1, 7.85, 0], c = [side * 5.1, this.roofY(2.7) - 0.04, 2.7];
      this.rod(group, a, b, 0.1, palette.dark, 'roof'); this.rod(group, b, c, 0.1, palette.dark, 'roof'); this.rod(group, a, c, 0.1, palette.dark, 'roof');
      for (let z = -2.2; z <= 2.2; z += 0.4) this.rod(group, [side * 5.1, this.roofY(2.7), z], [side * 5.1, this.roofY(Math.abs(z)) - 0.12, z], 0.035, palette.wood, 'roof');
    }
    this.box(group, [10.7, 0.24, 0.3], [0, 8.03, 0], 0x6b7065, 'roof');
    for (const side of [-1, 1]) this.box(group, [0.3, 0.44, 0.35], [side * 5.3, 8.15, 0], 0x666b62, 'roof');
  }

  setMode(mode) {
    if (!['hall', 'detail'].includes(mode)) { this.paused = true; return; }
    const changed = this.mode !== mode;
    this.paused = false; this.mode = mode;
    this.hall.visible = mode === 'hall'; this.detail.visible = mode === 'detail';
    if (changed) { this.amount = 0; this.targetAmount = 0; this.reset(true); }
  }
  matches(id, selection) {
    return id === selection || hallParts.find(p => p.id === id)?.parent === selection || this.pieces.get(id)?.type === selection;
  }
  inspectionObject(id) {
    const piece = this.pieces.get(id) || [...this.pieces.values()].find(p => p.type === id);
    if (piece) return piece.object;
    const group = this.groups[id];
    if (!group) return null;
    if (hallParts.some(p => p.id === id)) return group.children.find(o => o.isMesh);
    if (id === 'dougong') return group.children[0];
    return group;
  }
  select(id) {
    this.selected = id;
    this.extracted = null;
    this.updateMaterials();
  }
  updateMaterials() {
    this.materials.forEach(mat => {
      const id = mat.userData.id;
      const active = this.matches(id, this.selected);
      mat.emissive.set(active ? 0xb87535 : 0x000000);
      mat.emissiveIntensity = active ? 0.34 : 0;
      const ghost = this.extracted && this.pieces.has(id) && id !== this.extracted;
      mat.opacity = ghost ? 0.13 : mat.userData.opacity;
      mat.transparent = mat.opacity < 1; mat.depthWrite = !ghost;
      mat.needsUpdate = true;
    });
  }
  extract(id) {
    this.extracted = id && this.pieces.has(id) ? id : null;
    this.updateMaterials();
  }
  setFine(value) { this.fine = value; this.reset(true); }
  visibility(id, visible) {
    if (this.groups[id]) this.groups[id].visible = visible;
    visible ? this.hidden.delete(id) : this.hidden.add(id);
  }

  explode(value) {
    this.targetAmount = value;
    // Keep the taller exploded detail inside the same view at every slider value.
    if (Math.abs(value - (this.framedAmount || 0)) > 0.12) {
      this.framedAmount = value;
      this.reset(true);
    }
  }
  reset(animate = true, front = false) {
    const isDetail = this.mode === 'detail';
    const narrow = this.container.clientWidth < 620;
    const amount = this.targetAmount;
    const target = isDetail ? new THREE.Vector3(0, 2.4 + amount * 2.6, 0.5) : new THREE.Vector3(0, 4.1 + amount * (this.fine ? 2.1 : 1.1), 0);
    const pos = isDetail ? new THREE.Vector3(8 + amount * 3, 6.5 + amount * 5, 11 + amount * 4) : new THREE.Vector3(18 + amount * 2, 13.8 + amount * 4, 23 + amount * 2);
    if (front) { pos.x = 0; pos.z = isDetail ? 16 + amount * 5 : 29; pos.y = isDetail ? 5 + amount * 3 : 9; }
    if (narrow) pos.sub(target).multiplyScalar(1.24).add(target);
    if (animate && !this.reducedMotion) this.cameraMotion = { position: pos, target };
    else { this.camera.position.copy(pos); this.controls.target.copy(target); this.controls.update(); }
    this.controls.minDistance = isDetail ? 6 : 15;
    this.controls.maxDistance = isDetail ? 42 : 65;
  }
  resize() {
    const width = this.container.clientWidth, height = this.container.clientHeight;
    if (!width || !height) return;
    this.renderer.setSize(width, height); this.camera.aspect = width / height; this.camera.updateProjectionMatrix();
  }
  pick(e) {
    if (!this.pointerStart || Math.hypot(e.clientX - this.pointerStart[0], e.clientY - this.pointerStart[1]) > 5) return;
    const r = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const visible = this.meshes.filter(m => { let p = m; while (p) { if (!p.visible) return false; p = p.parent; } return true; });
    const hit = this.raycaster.intersectObjects(visible, false)[0];
    if (hit) this.onSelect(hit.object.userData.id);
  }
  projectLabels() {
    let anchors;
    if (this.mode === 'detail') {
      const ids = this.pieces.has(this.selected) ? [this.selected] : ['piece-2', 'piece-3', 'piece-1'];
      anchors = ids.map(id => {
        const piece = this.pieces.get(id);
        const center = new THREE.Box3().setFromObject(piece.object).getCenter(new THREE.Vector3());
        return { id, name: piece.name, p: center.toArray() };
      });
    } else {
      anchors = [{ id: 'roof', name: '屋面', p: [4.7, 7.3 + this.amount * (this.fine ? 5.6 : 3.8), 2] }, { id: 'dougong', name: '斗拱', p: [4.8, 5.25 + this.amount * 0.9, 3.8] }, { id: 'columns', name: '柱与枋', p: [-4.8, 2.6, 3.8] }];
    }
    if (this.mode === 'hall') {
      const member = hallParts.find(p => p.id === this.selected);
      if (member) {
        const center = new THREE.Box3().setFromObject(this.groups[member.id]).getCenter(new THREE.Vector3());
        anchors = [{ id: member.id, name: member.name, p: center.toArray() }];
      }
    }
    return anchors.map(a => {
      const p = new THREE.Vector3(...a.p).project(this.camera);
      return { ...a, x: (p.x * 0.5 + 0.5) * this.container.clientWidth, y: (-p.y * 0.5 + 0.5) * this.container.clientHeight, visible: p.z < 1 && !this.hidden.has(a.id) && !this.hidden.has(hallParts.find(m => m.id === a.id)?.parent) };
    });
  }
  frame(now) {
    this.frameId = requestAnimationFrame(this.frame);
    if (document.hidden || this.paused) { this.lastTime = now; return; }
    const dt = Math.min((now - this.lastTime) / 1000, 0.05); this.lastTime = now;
    const blend = this.reducedMotion ? 1 : 1 - Math.exp(-dt * 8);
    this.amount = THREE.MathUtils.lerp(this.amount, this.targetAmount, blend);
    if (this.mode === 'hall') {
      this.groups.roof.position.y = this.amount * (this.fine ? 5.6 : 3.8);
      this.groups.frame.position.y = this.amount * (this.fine ? 1.7 : 2.1);
      for (const [id, offset] of Object.entries({ support: 0.35, purlin: 1.25, rafter: 2.5, lane: 0.2, 'pupai-hall': 0.5 })) this.groups[id].position.y = this.fine ? this.amount * offset : 0;
      this.groups.dougong.position.y = this.amount * 0.9;
      this.enclosure.visible = this.amount < 0.12;
    } else {
      this.detailParts.forEach(g => {
        const d = g.userData;
        d.pull = THREE.MathUtils.lerp(d.pull, this.extracted === d.id ? 1 : 0, blend);
        g.position.set(this.amount * d.xSpread, this.amount * d.level * 0.4 + d.pull * 0.15, this.amount * d.zSpread + d.pull * 1.6);
      });
    }
    if (this.cameraMotion) {
      this.camera.position.lerp(this.cameraMotion.position, blend);
      this.controls.target.lerp(this.cameraMotion.target, blend);
      if (this.camera.position.distanceTo(this.cameraMotion.position) < 0.01) this.cameraMotion = null;
    }
    this.controls.autoRotate = this.autoRotate;
    this.controls.update(dt);
    this.renderer.render(this.scene, this.camera);
    this.onFrame?.(this.projectLabels());
  }
  dispose() {
    cancelAnimationFrame(this.frameId); this.observer.disconnect(); this.controls.dispose();
    this.scene.traverse(o => o.geometry?.dispose()); this.materials.forEach(m => m.dispose()); this.renderer.dispose();
  }
}
