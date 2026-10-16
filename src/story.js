import { storyChapters, storyNames } from './content.js';

// Narrative progress belongs to the tour; model and navigation state stay in main.
export class StoryTour {
  constructor(panel, actions) {
    this.panel = panel;
    this.actions = actions;
    this.active = false;
    this.index = 0;
    this.progress = storyChapters.map(() => new Set());
    this.answer = null;
    panel.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.chapter !== undefined) this.go(Number(button.dataset.chapter));
      if (button.dataset.learn) actions.select(storyNames.find(n => n.id === button.dataset.learn).piece);
      if (button.dataset.answer) { this.answer = button.dataset.answer; this.refresh(); }
      if (button.dataset.action === 'close') this.close();
      if (button.dataset.action === 'next') this.go(this.index + 1);
      if (button.dataset.action === 'prev') this.go(this.index - 1);
      if (button.dataset.action === 'restart') this.start();
      if (button.dataset.action === 'free') this.close(true);
      if (button.dataset.action === 'source') actions.sources(button);
      if (button.dataset.action === 'try') actions.try(storyChapters[this.index].actionKind);
    });
  }
  start() {
    this.active = true;
    this.progress = storyChapters.map(() => new Set());
    this.answer = null;
    this.actions.open();
    this.go(0);
  }
  go(index) {
    if (!this.active || index < 0 || index > storyChapters.length) return;
    this.index = index;
    const chapter = storyChapters[index];
    this.applying = true;
    if (chapter) this.actions.scene(chapter);
    this.applying = false;
    this.render();
    this.actions.chapter(index, chapter);
  }
  close(free = false) {
    this.active = false;
    this.panel.hidden = true;
    this.actions.close(free);
  }
  record(event, value) {
    if (!this.active || this.applying || this.index >= storyChapters.length) return;
    const found = this.progress[this.index];
    if (this.index === 1 && event === 'explode' && value >= 45) found.add('opened');
    if (this.index === 2 && event === 'select' && storyNames.some(n => n.id === value)) found.add(value);
    if (this.index === 3 && event === 'extract') {
      if (value.extracted) found.add(`pulled:${value.id}`);
      else if (found.has(`pulled:${value.id}`)) found.add('returned');
    }
    this.refresh();
  }
  render() {
    this.panel.hidden = false;
    const chapter = storyChapters[this.index];
    const rail = `<nav class="story-rail" aria-label="故事章节">${storyChapters.map((c, i) => `<button data-chapter="${i}" aria-label="第 ${i + 1} 幕：${c.place}" ${i === this.index ? 'aria-current="step"' : ''}><span>${String(i + 1).padStart(2, '0')}</span>${c.short}</button>`).join('')}</nav>`;
    const head = `<div class="story-top"><span>观木故事 · 第一篇</span><button data-action="close" aria-label="退出故事">退出 ×</button></div><div class="story-book-title">抬头之后<span>A CLOSER LOOK</span></div>${rail}`;
    if (!chapter) {
      this.panel.innerHTML = `${head}<div class="story-ending"><span class="story-seal">观</span><p class="story-kicker">这一程，走到了这里</p><h2 id="story-title" tabindex="-1">下一次抬头，<br>会看见什么？</h2><p>下次站在屋檐下，可以从柱头开始，找一找那组层叠的木头。</p><div class="story-keepsake"><span>带走三个名字</span>${storyNames.map(n => `<p><strong>${n.name}</strong><span>${n.shape}</span></p>`).join('')}</div><p class="story-closing">建筑还在那里。<br>你的目光，可以再近一点。</p><button class="story-primary" data-action="free">带着这三个名字，自由探索 ↗</button><button class="story-replay" data-action="restart">再走一遍</button></div><button class="story-source" data-action="source">情境创作与资料依据 ↗</button>`;
      return;
    }
    this.panel.innerHTML = `${head}<div class="story-copy"><p class="story-kicker">第 ${['一','二','三','四','五'][this.index]} 幕 · ${chapter.place}<span>${String(this.index + 1).padStart(2,'0')} / 05</span></p><h2 id="story-title" tabindex="-1">${chapter.title}</h2>${chapter.paragraphs.map(p => `<p class="story-paragraph">${p}</p>`).join('')}</div><div class="story-interaction"><span class="story-task-label">${chapter.quiz ? '实景辨认' : chapter.learn ? '亲手认识' : chapter.action ? '停下来，试一试' : '这一刻'}</span><p class="story-invitation">${chapter.invitation}</p>${chapter.action ? `<button class="story-primary" id="story-action" data-action="try">${chapter.action} ↗</button>` : ''}${chapter.learn ? `<div class="story-names">${storyNames.map(n => `<button data-learn="${n.id}" aria-pressed="false"><strong>${n.name}</strong><small>${n.shape}</small><span class="name-seen" aria-hidden="true"></span></button>`).join('')}</div><p id="story-name-note"></p>` : ''}${chapter.quiz ? `<div class="story-answers" role="group" aria-label="选择构件名称">${['普拍枋','柱础','椽'].map(n => `<button data-answer="${n}" aria-pressed="false">${n}</button>`).join('')}</div>` : ''}<p id="story-feedback" class="story-feedback" role="status" aria-live="polite" hidden></p></div><div class="story-foot"><div class="story-navigation"><button data-action="prev" ${this.index === 0 ? 'disabled' : ''} aria-label="上一幕">←</button><button class="story-next" data-action="next">${chapter.next} <span>→</span></button></div><p class="story-note">${chapter.note}</p><button class="story-source" data-action="source">情境创作与资料依据 ↗</button></div>`;
    this.refresh();
  }
  refresh() {
    const chapter = storyChapters[this.index];
    if (!chapter || !this.active) return;
    const found = this.progress[this.index];
    const context = this.actions.context();
    let feedback = '';
    if (chapter.actionKind === 'lift' && found.has('opened')) feedback = chapter.success;
    if (chapter.learn) {
      const name = storyNames.find(n => n.id === context.type);
      this.panel.querySelectorAll('[data-learn]').forEach(b => {
        b.setAttribute('aria-pressed', b.dataset.learn === context.type);
        b.querySelector('.name-seen').textContent = found.has(b.dataset.learn) ? '✓' : '';
      });
      this.panel.querySelector('#story-name-note').textContent = name?.note || '点一个名字，在模型里找到它。';
      if (found.size === 3) feedback = chapter.success;
      else if (found.size) feedback = `已经观察了 ${found.size} / 3 个名字，按自己的节奏继续。`;
    }
    if (chapter.actionKind === 'extract') {
      const button = this.panel.querySelector('#story-action');
      button.textContent = context.extracted ? '放回原位 ↙' : `抽出${context.name || '这根栱'} ↗`;
      if (found.has('returned')) feedback = chapter.success;
      else if (context.extracted) feedback = '现在转动模型，看看它的轮廓。看好以后，再把它放回去。';
    }
    if (chapter.quiz && this.answer) {
      const correct = this.answer === '普拍枋';
      feedback = correct ? chapter.success : this.answer === '柱础' ? '柱础在木柱脚下。再看看照片里斗拱下方横铺的木件。' : '椽沿屋坡方向排列。这里要找的是斗拱下方横铺的扁宽木件。';
      this.panel.querySelectorAll('[data-answer]').forEach(b => {
        b.setAttribute('aria-pressed', b.dataset.answer === this.answer);
        b.dataset.result = b.dataset.answer === this.answer ? (correct ? 'correct' : 'retry') : '';
      });
    }
    const status = this.panel.querySelector('#story-feedback');
    status.hidden = !feedback;
    if (status.textContent !== feedback) status.textContent = feedback;
  }
}
