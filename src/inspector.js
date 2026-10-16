import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const roles = {
  roof: '覆盖建筑上部，形成屋顶的遮蔽与轮廓。', frame: '把屋面下的梁、檩、椽组织起来，连接上部屋面与下部支承。',
  dougong: '用斗与栱等木件层叠组合，连接柱头与檐部木构。', columns: '木柱竖向承托，横枋联系相邻柱头。', base: '将建筑抬离周围地面，组织柱础与殿身的落脚位置。',
  beam: '跨在支承之间，承接上方的木构件。', support: '在上下两层梁之间提供承托位置。', purlin: '沿屋脊方向延伸，为密排的椽提供支承。', rafter: '沿屋坡排列，搭在檩上，承接屋面基层。',
  column: '竖向支承上部木构，把荷载传向柱础。', lane: '在柱头附近横向联系相邻木柱。', 'pupai-hall': '横铺在阑额上方，承接上部斗拱。', foundation: '在木柱脚下提供石质承托。',
  pupai: '在柱头附近横向铺设，承接上方斗拱。', dou: '以块状构件承托上方的栱等木件。', gong: '横向伸展，与斗配合形成层叠承托。', qiao: '朝向檐外伸出，让承托位置向外展开。',
};

export class ComponentInspector {
  constructor(getObject) {
    this.getObject = getObject;
    this.dialog = document.createElement('dialog');
    this.dialog.id = 'component-dialog';
    this.dialog.setAttribute('aria-labelledby', 'component-title');
    this.dialog.innerHTML = `<div class="inspector-top"><span>构件特写 / 3D</span><button id="close-component" aria-label="关闭构件特写">关闭 ×</button></div><div class="inspector-layout"><div class="inspector-scene"><div id="component-viewer"></div><span class="inspector-model-note">教学形态示意 · 无尺寸比例</span><div class="inspector-view-tools"><button id="component-zoom-in" aria-label="放大构件">＋</button><button id="component-zoom-out" aria-label="缩小构件">−</button><button id="component-reset">复位</button><button id="component-rotate" aria-pressed="false">自动旋转</button></div><p class="inspector-hint">拖动旋转 · 双指或滚动缩放</p></div><div class="inspector-notes"><p class="inspector-eyebrow" id="component-category"></p><h2 id="component-title"></h2><div class="inspector-role"><span>它的作用</span><p id="component-role"></p></div><div class="inspector-connection"><span>与谁相接</span><p id="component-connection"></p></div><p id="component-description"></p><small id="component-evidence"></small></div></div>`;
    document.body.append(this.dialog);
    this.dialog.querySelector('#close-component').addEventListener('click', () => this.dialog.close());
    this.dialog.querySelector('#component-zoom-in').addEventListener('click', () => this.zoom(0.8));
    this.dialog.querySelector('#component-zoom-out').addEventListener('click', () => this.zoom(1.25));
    this.dialog.querySelector('#component-reset').addEventListener('click', () => this.reset());
    this.dialog.querySelector('#component-rotate').addEventListener('click', event => {
      this.controls.autoRotate = !this.controls.autoRotate;
      event.currentTarget.setAttribute('aria-pressed', this.controls.autoRotate);
    });
    this.dialog.addEventListener('close', () => {
      cancelAnimationFrame(this.frameId);
      this.opener?.isConnected && this.opener.focus({ preventScroll: true });
    });
    this.dialog.addEventListener('click', event => {
      if (event.target !== this.dialog) return;
      const r = this.dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) this.dialog.close();
    });
  }
  initialize() {
    if (this.renderer) return;
    this.container = this.dialog.querySelector('#component-viewer');
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.domElement.setAttribute('role', 'img');
    this.renderer.domElement.setAttribute('aria-label', '居中放大的构件模型，可拖动旋转和滚动缩放');
    this.container.append(this.renderer.domElement);
    this.scene = new THREE.Scene(); this.scene.background = new THREE.Color('#eeeee4');
    this.camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; this.controls.enablePan = false;
    this.controls.minDistance = 3; this.controls.maxDistance = 30;
    this.controls.autoRotateSpeed = 0.8;
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x93866b, 3));
    const key = new THREE.DirectionalLight(0xfff2d9, 3.5); key.position.set(-5, 8, 9); this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xdde4f1, 1.5); fill.position.set(6, 2, -4); this.scene.add(fill);
    this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(this.container);
    this.tick = () => {
      if (!this.dialog.open) return;
      this.controls.update(); this.renderer.render(this.scene, this.camera);
      this.frameId = requestAnimationFrame(this.tick);
    };
  }
  open(item) {
    const source = this.getObject(item.id);
    if (!source) return;
    this.opener = document.activeElement;
    this.dialog.querySelector('#component-title').textContent = item.name;
    this.dialog.querySelector('#component-category').textContent = item.piece ? `局部示意 · 第 ${String(item.number).padStart(2,'0')} 件` : `${item.en} · 构件观察`;
    this.dialog.querySelector('#component-role').textContent = roles[item.type || item.id] || item.desc;
    this.dialog.querySelector('#component-connection').textContent = item.connection;
    this.dialog.querySelector('#component-description').textContent = item.desc;
    this.dialog.querySelector('#component-evidence').textContent = item.evidence || '展示教学模型中的代表构件。比例、槽口与榫卯未据实测复原。';
    if (!this.dialog.open) this.dialog.showModal();
    try {
      this.initialize();
      if (this.object) {
        this.scene.remove(this.object);
        this.object.traverse(o => { if (o.isMesh) o.material.dispose(); });
      }
      // Geometry is shared read-only with the main viewer; only cloned materials are disposed here.
      const clone = source.clone(true);
      clone.position.set(0, 0, 0); clone.visible = true;
      clone.traverse(o => {
        o.visible = true;
        if (o.isMesh) {
          o.material = o.material.clone(); o.material.opacity = 1; o.material.transparent = false;
          o.material.depthWrite = true; o.material.emissive.set(0); o.material.emissiveIntensity = 0;
        }
      });
      const box = new THREE.Box3().setFromObject(clone), size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      clone.position.sub(center);
      this.object = new THREE.Group(); this.object.add(clone);
      const scale = 4.5 / Math.max(size.x, size.y, size.z, 0.01);
      this.object.scale.setScalar(scale);
      this.radius = box.getBoundingSphere(new THREE.Sphere()).radius * scale;
      this.scene.add(this.object);
      this.controls.autoRotate = false;
      this.dialog.querySelector('#component-rotate').setAttribute('aria-pressed', 'false');
      this.resize(); this.reset();
      cancelAnimationFrame(this.frameId); this.tick();
    } catch (error) {
      console.error('Component viewer failed:', error);
      this.dialog.querySelector('.inspector-hint').textContent = '当前无法显示放大模型，仍可查看右侧的构件说明。';
    }
  }
  zoom(scale) {
    if (!this.controls) return;
    const offset = this.camera.position.clone().sub(this.controls.target);
    offset.setLength(THREE.MathUtils.clamp(offset.length() * scale, this.controls.minDistance, this.controls.maxDistance));
    this.camera.position.copy(this.controls.target).add(offset); this.controls.update();
  }
  reset() {
    if (!this.camera) return;
    const distance = Math.max(7.5, this.radius / Math.sin(THREE.MathUtils.degToRad(17)) * 1.08) / Math.min(this.camera.aspect, 1);
    this.camera.position.copy(new THREE.Vector3(1, 0.7, 1.4).normalize().multiplyScalar(distance));
    this.controls.target.set(0, 0, 0); this.controls.update();
  }
  resize() {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h); this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }
  dispose() {
    cancelAnimationFrame(this.frameId); this.observer?.disconnect(); this.controls?.dispose();
    this.object?.traverse(o => { if (o.isMesh) o.material.dispose(); }); this.renderer?.dispose();
  }
}
