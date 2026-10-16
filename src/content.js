export const sources = [
  { title: '山西大学考古文博学院 · 大云院', url: 'https://archaeology.sxu.edu.cn/rcpy/yxsx/903e5ed4860542ddb1992a6f5c1a6368.htm', note: '建筑背景、院落与普拍枋相关介绍。' },
  { title: '张洪峰《大云院现状初探》', url: 'https://m.fx361.com/news/2023/0807/22316981.html', note: '《收藏与投资》2023 年第 7 期；参考公开可读部分的屋顶、梁架与斗拱描述。' },
  { title: 'Patrick20242023 · 殿内梁架近照', url: 'https://commons.wikimedia.org/wiki/File:大佛殿内部梁架.jpg', note: '2024 年拍摄，可在原页面查看梁与其他木构件的交接。CC BY 4.0。' },
  { title: 'Patrick20242023 · 梁架斜撑近照', url: 'https://commons.wikimedia.org/wiki/File:大佛殿大叉手.jpg', note: '原图题为“大叉手”，可在原页面查看。具体定名还需结合剖面位置。CC BY 4.0。' },
  { title: 'Vincent H P Liu · 大云院图像集', url: 'https://www.flickr.com/photos/24164990@N07/albums/72157622923750090', note: '含纵剖面、梁架与斗拱示意图，可前往原页面查阅。图像标注保留所有权利，此处仅提供资料链接。' },
];
export const photos = {
  hall: { src: '/images/dayun-hall.jpg', title: '弥陀殿 · 现存外观', alt: '平顺大云院弥陀殿正面实景，灰瓦屋面、深远屋檐及柱间门窗', page: 'https://commons.wikimedia.org/wiki/File:大云院大雄宝殿.jpg', note: '先找到屋顶的轮廓，再沿檐口向下，看见柱子上方的斗拱。' },
  dougong: { src: '/images/dayun-dougong.jpg', title: '柱头铺作 · 檐下细节', alt: '大云院弥陀殿柱头斗拱近照，展示斗、栱与下方普拍枋', page: 'https://commons.wikimedia.org/wiki/File:大云院大佛殿柱头铺作.jpg', note: '从下向上观察：先找到横置的普拍枋，再看承托其上构件的斗与向外伸出的栱。' },

};
export const photoReferences = {
  frame: { title: '殿内梁架近照', page: 'https://commons.wikimedia.org/wiki/File:大佛殿内部梁架.jpg' },
  brace: { title: '梁架斜撑近照', page: 'https://commons.wikimedia.org/wiki/File:大佛殿大叉手.jpg' },
};
export const layers = [
  { id: 'roof', name: '屋面', en: 'ROOF', sub: '覆瓦成面，勾勒轮廓', color: '#777c71', desc: '先看整座殿的屋顶轮廓。弥陀殿采用单檐歇山顶，正面与山面的屋坡共同构成形体。展开屋面，才能继续观察下面的木构架。', connection: '向下观察 → 椽与檩、梁架', tip: '试着展开模型，让屋面抬起。', evidence: '屋顶类型有文献依据；瓦面、曲线与比例为简化示意。' },
  { id: 'frame', name: '梁架', en: 'TIMBER FRAME', sub: '梁与檩，撑起屋顶', color: '#b68e5f', desc: '梁架是屋顶下面的木构骨架。展开目录，可以分别选择梁、梁间承托、檩和椽，辨认它们的方向与相互位置。不同构件共同把上部荷载传向支承处。', connection: '向上看屋面 · 向下看柱与斗拱', tip: '选择“按构件”展开，再试着单独隐藏椽或檩。', evidence: '构件类型参考文献；本模型未逐根复原实测梁架。' },
  { id: 'dougong', name: '斗拱', en: 'BRACKET SET', sub: '层叠出挑，连接上下', color: '#aa6f48', desc: '斗拱是由多个木构件组合而成的承托单元。先看它在柱头与檐部之间的位置，再靠近观察块状的斗与条状的栱怎样层叠组合。', connection: '下接柱头及枋 · 上连檐部木构', tip: '进入局部观察，逐件认识斗与栱。', evidence: '局部模型为通用斗拱关系示意，并非弥陀殿铺作的精确复原。' },
  { id: 'columns', name: '柱与枋', en: 'COLUMNS & TIES', sub: '竖立为柱，横连为枋', color: '#90664c', desc: '竖向的柱与横向的枋共同组织建筑的木构空间。观察柱头附近：阑额在柱间横向联系，普拍枋则位于上部，承接斗拱所在的层次。', connection: '下接柱础 · 上接斗拱与梁架', tip: '从正面看，数一数柱间形成的三个开间。', evidence: '柱网与截面采用示意比例；不代表实测尺寸。' },
  { id: 'base', name: '台基', en: 'PLATFORM', sub: '托起殿身，落定根基', color: '#b5b1a2', desc: '台基将建筑抬离周围地面；柱子下的柱础则是辨认木柱落脚位置的线索。从台阶走近，沿柱础向上看，便能把建筑的下部与上部连起来。', connection: '台基之上 → 柱础与木柱', tip: '合拢建筑，再从下往上看一遍。', evidence: '台基、踏步与柱础形状为教学简化。' },
];
// Names describe teaching geometry, never a survey inventory of historic members.
export const hallParts = [
  { id: 'beam', parent: 'frame', name: '梁', en: 'BEAM', sub: '跨在支承之间', color: '#b68e5f', desc: '沿建筑进深方向观察较粗的横木。梁跨在支承之间，上面再承接其他木件。古建文献也常用“栿”称梁。这里分开显示各层横梁，帮助辨认其方向。', connection: '梁 → 梁间承托 → 上层横梁', photo: 'frame' },
  { id: 'support', parent: 'frame', name: '梁间承托', en: 'SUPPORT', sub: '把上下层接起来', color: '#96724d', desc: '上下两层梁之间需要承托。弥陀殿文献记有驼峰等构件；当前模型以简化块体提示它们所在的层次，具体轮廓要结合实景和详图继续细化。', connection: '位于相邻的梁之间', photo: 'frame', evidence: '块体表示承托位置；尚未复原驼峰的历史形状。' },
  { id: 'purlin', parent: 'frame', name: '檩（槫）', en: 'PURLIN', sub: '顺着面阔横向延伸', color: '#c3a071', desc: '檩是一根根沿屋脊方向延伸的长木件。它们在不同高度排开，为椽提供支承。阅读早期建筑资料时，也会遇到“槫”这个名称。', connection: '下接梁架 · 上承椽', photo: 'brace' },
  { id: 'rafter', parent: 'frame', name: '椽', en: 'RAFTER', sub: '密排在屋坡下面', color: '#a47c50', desc: '椽比檩更细密，从屋顶上方向檐口方向排列，与檩形成不同方向。拖动展开后，把椽和檩分别点亮，就能看清这两个方向。', connection: '搭在檩上 · 承接屋面基层', photo: 'brace' },
  { id: 'column', parent: 'columns', name: '柱', en: 'COLUMN', sub: '竖向承托', color: '#90664c', desc: '从柱础向上延伸的竖向木构件。先看柱头，再看横向的阑额如何在柱间联系，就能区分竖立和横连的木件。', connection: '下接柱础 · 上接柱头木构', photo: 'hall' },
  { id: 'lane', parent: 'columns', name: '阑额', en: 'COLUMN TIE', sub: '连接相邻柱头', color: '#a47c50', desc: '阑额位于柱头附近，在柱子之间横向联系。它与上面较扁宽的普拍枋分开显示，方便比较二者的位置。', connection: '连接相邻木柱 · 上方为普拍枋', photo: 'dougong' },
  { id: 'pupai-hall', parent: 'columns', name: '普拍枋', en: 'SUPPORTING TIE', sub: '阑额上方的扁宽枋', color: '#c3a071', desc: '普拍枋在阑额上方，呈扁宽的水平木件，为上部铺作提供承接位置。这里可将它单独隐藏，观察其与阑额、柱头斗拱的相对位置。', connection: '阑额 → 普拍枋 → 斗拱', photo: 'dougong' },
  { id: 'foundation', parent: 'base', name: '柱础', en: 'COLUMN BASE', sub: '木柱下方的石构件', color: '#b5b0a1', desc: '每根木柱下方的石质承托。把柱础从台基层单独选出，沿它向上寻找对应的柱子。', connection: '台基之上 · 木柱之下', photo: 'hall' },
];

export const parts = [
  { id: 'pupai', name: '普拍枋', en: 'SUPPORTING TIE', desc: '柱头附近横向铺设的枋。先找到这条水平线，再向上看其上的斗拱，能更容易理解这组构件的位置关系。', connection: '位于柱头上方、斗拱下方' },
  { id: 'dou', name: '斗', en: 'BEARING BLOCK', desc: '块状的承托构件。模型中可看到顶部留出的槽口，用来说明它与条状木件的相接关系。真实槽口与榫卯细节需要测绘资料确认。', connection: '承接下部 · 支承上方栱件' },
  { id: 'gong', name: '栱', en: 'BRACKET ARM', desc: '横向伸展的木构件。观察它两端伸出的形状，以及与承托木块的相对位置。模型用简化轮廓呈现层叠关系。', connection: '与斗组合，形成层叠承托' },
  { id: 'qiao', name: '出挑构件', en: 'OUTWARD ARM', desc: '朝檐外方向伸出的木件，让支承位置逐层向外展开。此处仅用于理解出挑方向，不能据此判读弥陀殿真实的铺作等级与加工方式。', connection: '朝向檐外，与横向栱件交叠' },
];
export const storyChapters = [
  {
    place: '殿前', title: '先抬头，慢一点。', short: '仰望', mode: 'photo', photo: 'hall',
    paragraphs: ['你走到大云院弥陀殿前。目光顺着柱子向上，停在伸出的屋檐。', '那些层层叠叠的木头，你一时叫不出名字。没关系，今天就从这一次抬头开始。'],
    invitation: '先看一眼照片里的屋檐。接下来，我们把目光带到它的下面。',
    next: '走到屋檐下', note: '旅行情境为创作；照片为大云院实景。',
  },
  {
    place: '檐下', title: '谁在托住屋檐？', short: '显露', mode: 'hall', explode: 0, selection: 'dougong',
    paragraphs: ['屋面遮住了许多线索。让它轻轻升起，里面的木构就会露出来。', '沿着柱子向上找：柱头与檐部之间，那一组层叠交错的木件，叫作斗拱。'],
    invitation: '抬起屋面，看看原本被遮住的部分。也可以自己拖动展开滑块。',
    action: '轻轻抬起屋面', actionKind: 'lift', success: '屋面展开了。先记住斗拱的位置：柱头之上，屋檐之下。',
    next: '走近这组木头', note: '空间关系示意；展开过程不代表实际拆卸顺序。',
  },
  {
    place: '木间', title: '木头，也有名字。', short: '辨认', mode: 'detail', explode: 0.65, selection: null,
    paragraphs: ['走近以后，一整组斗拱变成了可以逐件观察的木头。块状的、横向伸展的、铺在底下的，各有自己的名字。', '先认识三件。点一下名字，再转动模型，看看它在什么位置。'],
    invitation: '三个名字，慢慢看。也可以直接点击模型里的木件。',
    learn: true, success: '斗、栱、普拍枋，三个名字已经和形状对上了。',
    next: '拿起一件看看', note: '本局部为通用教学示意，未按弥陀殿实物精确复原。',
  },
  {
    place: '一件', title: '抽出来，再放回。', short: '相接', mode: 'detail', explode: 0.5, selection: 'piece-3',
    paragraphs: ['目光停在这根横向伸展的栱上。我们把它从模型里抽出来，让轮廓显露。', '再把它放回去：原来，一件木头的形状，要放在相邻木件之间才更容易读懂。'],
    invitation: '抽出一件，转一转，再放回原位。', action: '抽出这根栱', actionKind: 'extract',
    success: '它回到了原位。记住的除了一个名字，还有它与周围木件的关系。',
    next: '回到真实的屋檐', note: '抽出仅用于观察；真实槽口、榫卯和加工尺寸尚未复原。',
  },
  {
    place: '回望', title: '还是那道屋檐。', short: '重逢', mode: 'photo', photo: 'dougong',
    paragraphs: ['模型合上，真实的屋檐又回到眼前。木头有了岁月的颜色，也有了你刚刚认识的名字。', '最后认一认：斗拱下方，横向铺开的扁宽木件，叫什么？'],
    invitation: '凭刚才的印象选一个。不记得也没关系。', quiz: true,
    success: '是普拍枋。顺着这条横向的木件，再向上找斗与栱。',
    next: '收好这次发现', note: '对照大云院柱头铺作实景；照片来源见图下注记。',
  },
];
export const storyNames = [
  { id: 'dou', piece: 'piece-2', name: '斗', shape: '块状承托', note: '先看这块承托木件，再找它上面相接的条状木件。' },
  { id: 'gong', piece: 'piece-3', name: '栱', shape: '横向伸展', note: '沿着它的长边看，两端向外伸展，与斗共同组成层叠关系。' },
  { id: 'pupai', piece: 'piece-1', name: '普拍枋', shape: '底部横铺', note: '它铺在这组木构的下方。记住这条水平线，稍后到实景里再找一次。' },
];

// One learner sample. Names, roles, and the photo note are reused from the entries above.
// The slot label names the teaching notch already described on 斗; it is not a surveyed joint.
const douPart = parts.find(part => part.id === 'dou');
const douStory = storyNames.find(item => item.id === 'dou');
const [supportBelow, supportAbove] = douPart.connection.split(' · ');
export const teachingSample = {
  piece: douStory.piece,
  type: 'dou',
  title: '底部大斗',
  kicker: '教学样例',
  blurb: '先看块状承托，再看上下相接的木件，最后到实景里找一次。',
  labels: [
    { id: 'body', name: douStory.name, role: douStory.shape, at: [0.5, 0.32, 0.5], side: 'left' },
    { id: 'slot', name: '示意槽口', role: '与条状木件相接', caveat: '未据实测复原', at: [0.5, 0.82, 0.5], side: 'right' },
  ],
  neighbors: [
    { id: storyNames.find(item => item.id === 'pupai').piece, relation: supportBelow },
    { id: storyNames.find(item => item.id === 'gong').piece, relation: supportAbove },
  ],
  photo: 'dougong',
  marker: {
    x: 50,
    y: 50,
    name: douStory.name,
    role: douStory.shape,
    note: `${photos.dougong.note}此标记是教学观察点，不是实测定位。`,
  },
};
