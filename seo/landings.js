// Crawlable reading pages for the locked keyword table (过闸定稿, 2026-11-03).
// The 3D app stays on /#/dayun. These paths are real URLs with text in the first HTML response.

import { analyticsMarkup } from './snippet.js';

export const SITE = 'https://guanmu.darren-su.com';

const CC = 'https://creativecommons.org/licenses/by/4.0/';
const HALL_PAGE = `https://commons.wikimedia.org/wiki/File:${encodeURIComponent('大云院大雄宝殿.jpg')}`;
const DOUGONG_PAGE = `https://commons.wikimedia.org/wiki/File:${encodeURIComponent('大云院大佛殿柱头铺作.jpg')}`;
const SXU = 'https://archaeology.sxu.edu.cn/rcpy/yxsx/903e5ed4860542ddb1992a6f5c1a6368.htm';
const ZHANG = 'https://m.fx361.com/news/2023/0807/22316981.html';

const hallFigure = {
  src: '/images/dayun-hall.jpg',
  alt: '平顺大云院弥陀殿正面实景，灰瓦屋面、深远屋檐及柱间门窗',
  caption: `摄影 Patrick20242023，2024-02-15。[Wikimedia Commons 原图](${HALL_PAGE}) · [CC BY 4.0](${CC})。照片文件未改。外观文件名沿用上传者的「大雄宝殿」，本站称弥陀殿。`,
};

const hallFigureEn = {
  src: '/images/dayun-hall.jpg',
  alt: 'Front of the Amitabha Hall at Dayun Temple: gray tile roof, deep eaves, and doors between the columns',
  caption: `Photo by Patrick20242023, 15 Feb 2024. [Wikimedia Commons](${HALL_PAGE}) · [CC BY 4.0](${CC}). The file is unchanged. The upload title says 大雄宝殿; this site calls the hall 弥陀殿 (Amitabha Hall).`,
};

const dougongFigure = {
  src: '/images/dayun-dougong.jpg',
  alt: '大云院弥陀殿柱头斗拱近照，展示斗、栱与下方普拍枋',
  caption: `摄影 Patrick20242023，2024-02-15。[Wikimedia Commons 原图](${DOUGONG_PAGE}) · [CC BY 4.0](${CC})。照片文件未改。若交互页在照片上打点，那是教学观察点，不是实测定位。`,
};

const columnTieFigure = {
  src: '/images/dayun-dougong.jpg',
  alt: '大云院弥陀殿柱头铺作近照，檐下斗栱和柱头附近的横向木件',
  caption: `摄影 Patrick20242023，2024-02-15。[Wikimedia Commons 原图](${DOUGONG_PAGE}) · [CC BY 4.0](${CC})。照片文件未改。用它对照柱头附近的横木，不能把它当成阑额或普拍枋的实测定位。`,
};

const dougongFigureEn = {
  src: '/images/dayun-dougong.jpg',
  alt: 'Column-top bracket set at Dayun Temple, showing bearing blocks, bracket arms, and the flat tie below',
  caption: `Photo by Patrick20242023, 15 Feb 2024. [Wikimedia Commons](${DOUGONG_PAGE}) · [CC BY 4.0](${CC}). The file is unchanged. A marker in the interactive view, if you see one, is a teaching pointer, not a surveyed coordinate.`,
};

const layersZh = {
  caption: '教学模型里的五个层次',
  headers: ['层次', '先看什么'],
  rows: [
    ['屋面', '先看整座殿的屋顶轮廓。公开资料把弥陀殿记为单檐歇山。模型里的瓦面、曲线和比例做了简化。'],
    ['梁架', '屋顶下面的木骨架。可以分开看梁、梁间承托、檩和椽的方向。没有逐根按实测复原。'],
    ['斗栱', '柱头和檐部之间的一组承托。局部模型是通用组合，不是这座殿铺作的精确形制。'],
    ['柱与枋', '竖向的柱，加上柱间的阑额、上面的普拍枋。柱网和截面是示意比例。'],
    ['台基', '把殿身抬离地面。柱础用来找木柱落脚的位置。踏步和柱础外形做了简化。'],
  ],
};

const membersZh = {
  caption: '整殿里可以点选的八类构件',
  headers: ['构件', '在模型里怎么认'],
  rows: [
    ['梁', '沿进深方向、跨在支承之间的较粗横木。古建文献里也常叫栿。'],
    ['梁间承托', '上下两层梁之间。文献记有驼峰；模型只用块体标出这一层，没有复原驼峰外形。'],
    ['檩（槫）', '顺着面阔、在不同高度排开的长木，给椽提供支承。早期资料里也会见到「槫」。'],
    ['椽', '比檩更细密，从屋顶上方向檐口方向排，和檩不是同一个方向。'],
    ['柱', '从柱础向上的竖向木构件。先看柱头，再看柱与柱怎样被横向木件连起来。'],
    ['阑额', '柱头附近、在相邻柱子之间横向联系的木件。'],
    ['普拍枋', '阑额上方较扁宽的水平木件，上面承接斗栱。'],
    ['柱础', '木柱下面的石构件，用来把柱子和台基对上。'],
  ],
};

const layersEn = {
  caption: 'Five layers in the teaching model',
  headers: ['Layer', 'What to look for'],
  rows: [
    ['Roof', 'The outline of the hall. Published notes describe the Amitabha Hall as a single-eave hip-and-gable roof (单檐歇山). Tile, curve, and proportion in the model are simplified.'],
    ['Timber frame', 'Beams, the blocks between beams, purlins, and rafters. Directions are shown. Individual historic members are not reconstructed one by one.'],
    ['Dougong', 'The bracket set between the column top and the eaves. The close-up is a generic assembly, not an exact restoration of this hall’s bracket type.'],
    ['Columns and ties', 'Vertical columns, the tie between column tops (阑额), and the wider flat tie above it (普拍枋). The column grid is a teaching proportion.'],
    ['Platform', 'The base that lifts the hall off the ground. Column bases mark where the wood posts land. Steps and stone shapes are simplified.'],
  ],
};

export const pages = [
  {
    path: '/dayun',
    lang: 'zh-CN',
    title: '大云院 · 交互学习入口',
    eyebrow: '山西 · 平顺 · 实会村',
    lead: '大云院在山西省平顺县实会村。这一页是交互学习入口：先确认要看的是弥陀殿，再打开可以旋转、拆开的教学模型。模型用来认识木构件的名称和相对位置，不是测绘复原。',
    cta: { href: '/#/dayun', label: '进入大云院交互探索' },
    langSwitch: { href: '/en/dayun-temple', label: 'English' },
    figure: hallFigure,
    sections: [
      {
        heading: '这一页解决什么',
        paragraphs: [
          '旅行前后搜「大云院」，通常是想知道：这是哪一座建筑、人站在殿前先看哪里、怎样把看到的木头叫出名字。观木目前只开放这一座，用弥陀殿做第一件观察对象。',
          '交互深链是 [#/dayun](/#/dayun)。那个地址打开三维页面。本页 /dayun 是给人和抓取程序先读的说明，不依赖井号后面的内容。',
        ],
      },
      {
        heading: '进模型之后能做什么',
        items: [
          '整殿：拖动旋转，用滑块把屋面抬起，看到下面的木构。',
          '斗栱局部：交互按钮写成「斗拱」，和本页的「斗栱」是同一个词。可以逐件点选。',
          '构件特写：看名称、作用和它与相邻木件的关系。底部大斗有一条从特写回到照片的样例。',
          '故事《抬头之后》：五个片段，最后回到实景认普拍枋。旅行情境是项目创作，不是历史人物口述。讲解见 [弥陀殿 · 故事与拆解](/mituo-dian)。',
          '实景对照：两张已署名的照片，外加资料链接。',
        ],
      },
      {
        heading: '先记住的边界',
        paragraphs: [
          '公开介绍对始建年份的写法并不一致，所以这里不标精确年代。目录或模型角标上若出现粗略分期，只是界面上的提示，不是测年结论。',
          '构件名词表在 [古建筑构件入门](/components)。斗栱从哪一件看起，见 [斗栱是什么](/dougong)。山西古建这一页不做法录，只把看来法放在这座殿上，见 [山西古建筑怎么看](/shanxi-ancient-architecture)。',
        ],
      },
      {
        heading: '资料线索',
        paragraphs: [
          `建筑背景可对照 [山西大学考古文博学院 · 大云院](${SXU})，以及张洪峰《大云院现状初探》的[公开可读部分](${ZHANG})（《收藏与投资》2023 年第 7 期）。本页没有据此改写未经核验的营造者、传说或修缮情节，也没有用这些页面统一始建年份。`,
        ],
      },
    ],
  },
  {
    path: '/mituo-dian',
    lang: 'zh-CN',
    title: '弥陀殿 · 故事与拆解',
    eyebrow: '大云院 · 弥陀殿',
    lead: '弥陀殿是大云院里观木目前开放探索的那一座殿。这一页讲它怎么看，以及故事《抬头之后》会把哪几个名字和实景对上。三维拆解从本页进入；模型是教学示意，不是测绘复原。',
    cta: { href: '/#/dayun', label: '打开弥陀殿交互拆解' },
    langSwitch: { href: '/en/dayun-temple', label: 'English' },
    figure: hallFigure,
    sections: [
      {
        heading: '和「大云院」页怎么分',
        paragraphs: [
          '[大云院 · 交互学习入口](/dayun) 回答「这是哪座寺院、从哪里进」。这一页只讲弥陀殿本身：殿前先看什么，故事在认什么，拆解从哪进。两页都链到同一个交互地址 [#/dayun](/#/dayun)，但阅读目的不同。',
        ],
      },
      {
        heading: '殿前先看两眼',
        paragraphs: [
          '先看屋顶轮廓，再沿柱子向上，停在伸出的屋檐。柱头和檐部之间那一组层叠的木头，就是斗栱。屋面遮住了很多线索；模型里可以把屋面抬起，只为了看位置，不表示真的这样拆房子。',
          '照片上的屋檐和柱头铺作，用来把名字对回去。模型的瓦面、柱网和斗栱件数都简化过。',
        ],
      },
      {
        heading: '《抬头之后》五步在认什么',
        paragraphs: [
          '故事里的旅行情境和旁白是项目创作，不是历史口述，也不是某一次真实事件的记录。构件解释沿用教学模型和公开资料线索。',
        ],
        items: [
          '殿前：看实景里的屋檐，先不要背名字。',
          '檐下：抬起屋面，记住斗栱的位置，柱头之上、屋檐之下。',
          '木间：把三个名字和形状对上。斗是块状承托，栱横向伸展，普拍枋铺在这组木头下面。',
          '一件：抽出一根栱再放回。记住的是它和相邻木件的关系，不是一个孤立的零件。',
          '回望：回到柱头铺作的照片，再找一次普拍枋那条横向的扁宽木件。',
        ],
      },
      {
        heading: '接着看',
        paragraphs: [
          '三个名字的入门说明在 [斗栱是什么 · 从大斗学起](/dougong)。整座殿的名词表在 [古建筑构件入门](/components)。',
        ],
      },
    ],
  },
  {
    path: '/dougong',
    lang: 'zh-CN',
    title: '斗栱是什么 · 从大斗学起',
    eyebrow: '术语入门 · 斗栱',
    lead: '斗栱是柱头和屋檐之间、由多件木头叠起来的承托单元。入门不必先背铺作等级，从底部那件块状的大斗看起，再看它和普拍枋、栱怎么相接。页面里的局部是通用教学模型，不是弥陀殿的测绘复原。',
    cta: { href: '/#/dayun', label: '进入模型，从大斗看起' },
    langSwitch: { href: '/en/dougong', label: 'English' },
    alternates: [
      { hreflang: 'zh-CN', href: '/dougong' },
      { hreflang: 'en', href: '/en/dougong' },
      { hreflang: 'x-default', href: '/dougong' },
    ],
    figure: dougongFigure,
    sections: [
      {
        heading: '先认四类，不背口诀',
        paragraphs: [
          '检索和本页标题用「斗栱」。交互里的按钮写成「斗拱」，指的是同一组构件。',
        ],
        items: [
          '斗：块状承托。底部那件大斗是样例的起点。模型顶部的槽口只说明它要和条状木件相接，真实榫卯没有按实测复原。',
          '栱：横向伸展的木件，两端向外，和斗叠在一起。',
          '普拍枋：斗栱下面那条扁宽的水平木件。先找到这条线，再向上看斗和栱。',
          '出挑构件：朝檐外伸出，让支承逐层向外。这里只帮助看方向，不能用来判断弥陀殿的铺作等级或加工方式。',
        ],
      },
      {
        heading: '在交互里怎么走到这件斗',
        items: [
          '打开 [#/dayun](/#/dayun)，观察尺度切到「斗拱局部」。',
          '说明卡里点「从这个斗开始」。样例标题是「底部大斗」。',
          '可以点相邻的普拍枋和栱，再回到这件斗，然后打开柱头铺作的照片对一次。',
        ],
      },
      {
        heading: '这组模型不能回答的事',
        paragraphs: [
          '局部共 14 件：普拍枋 1、斗 8、栱 3、出挑构件 2。这是教学模型的件数。由多个几何块组成的一个斗仍算一件。它不是弥陀殿的实物清单，也不能当作五铺作或其他铺作做法的复原图。',
          '整殿里斗栱和其他构件怎么排，见 [古建筑构件入门](/components)。故事里怎样把这三个名字放回照片，见 [弥陀殿 · 故事与拆解](/mituo-dian)。',
        ],
      },
    ],
  },
  {
    path: '/components',
    lang: 'zh-CN',
    title: '古建筑构件入门 · 以大云院为例',
    eyebrow: '名词表 · 大云院弥陀殿',
    lead: '古建筑构件入门，先要有一张能对上形状的名词表。这一页以大云院弥陀殿为例，列出教学模型里的五个层次和可以点选的构件。名字用来帮助观察，不代替实物清单，模型也不是测绘复原。',
    cta: { href: '/#/dayun', label: '对照模型看这些名字' },
    langSwitch: { href: '/en/chinese-wooden-architecture', label: 'English' },
    figure: hallFigure,
    sections: [
      {
        heading: '怎么用这张表',
        paragraphs: [
          '先在整殿里找到层次，再点开具体构件。名字和模型对得上，就算这一页达到目的。数量、截面和隐藏的榫卯都还没有按实测复原。',
          '寺院入口在 [大云院](/dayun)。只想弄清斗栱，直接看 [斗栱是什么](/dougong)。',
        ],
      },
      { heading: '五个层次', table: layersZh },
      { heading: '八类构件', table: membersZh },
      {
        heading: '斗栱局部另有一套件数',
        paragraphs: [
          '走近斗栱以后，模型改成一组通用铺作：普拍枋、斗、栱、出挑构件。画面上的 14 件是这组示意的件数，不是大云院出土或现存构件的清点结果。',
        ],
      },
    ],
  },
  {
    path: '/shanxi-ancient-architecture',
    lang: 'zh-CN',
    title: '山西古建筑怎么看 · 大云院样例',
    eyebrow: '看来法 · 一座样例',
    lead: '山西古建筑很多，观木现在只用一座把看法走通：平顺大云院弥陀殿。这一页不做法录，只给一个能跟着做的看来法。看懂屋顶、柱和檐下斗栱之后，再回到照片里认名字。模型是教学示意，不是测绘复原。',
    cta: { href: '/#/dayun', label: '用大云院把这四步走一遍' },
    langSwitch: { href: '/en/chinese-wooden-architecture', label: 'English' },
    figure: hallFigure,
    sections: [
      {
        heading: '四步，只针对这一座',
        items: [
          '看屋顶轮廓。资料里弥陀殿是单檐歇山；模型的瓦面和曲线是简化的。',
          '沿柱子向上，找到柱头和屋檐之间的斗栱。先记位置，再记名字。',
          '分清竖向的柱、柱间的阑额，以及上面那条更扁宽的普拍枋。',
          '回到殿前或柱头的照片，把刚才的名字再认一次。认得出，这趟才算看完。',
        ],
      },
      {
        heading: '为什么不列山西古建名单',
        paragraphs: [
          '地域兴趣常常期待一份「山西有哪些殿」。观木还没有逐座收录，第二座也还没开放。把没做过的建筑写成导览，会对读者失实。这一页只保证：用大云院弥陀殿，把上面四步走通。',
          '想先读寺院本身，打开 [大云院 · 交互学习入口](/dayun)。想先读这座殿的故事，打开 [弥陀殿 · 故事与拆解](/mituo-dian)。构件名词在 [古建筑构件入门](/components)。',
        ],
      },
    ],
  },
  {
    path: '/en/dougong',
    lang: 'en',
    title: 'What is dougong · learn from a Chinese wooden hall',
    eyebrow: 'Term · bracket set',
    lead: 'Dougong (斗栱) is the stacked wooden bracket set between a column top and the eaves. Learn it from one piece: the large bearing block at the bottom. Then see how that block meets the flat tie under it and the bracket arm above it. The close-up is a teaching model, not a measured restoration.',
    cta: { href: '/?lang=en#/dayun', label: 'Open the model and start from the bottom dou' },
    langSwitch: { href: '/dougong', label: '中文' },
    alternates: [
      { hreflang: 'zh-CN', href: '/dougong' },
      { hreflang: 'en', href: '/en/dougong' },
      { hreflang: 'x-default', href: '/dougong' },
    ],
    figure: dougongFigureEn,
    sections: [
      {
        heading: 'Four pieces, in looking order',
        paragraphs: [
          'Chinese pages and the search term use 斗栱. In the English model the same control is Dougong close-up. The Chinese model still says 斗拱. Both names are this set.',
        ],
        items: [
          'Dou (斗), bearing block. The sample starts at the large block at the bottom. The notch on the model only says “this meets a long wooden arm.” The real joint is not reconstructed from a survey.',
          'Gong (栱), bracket arm. It runs sideways and stacks with the blocks.',
          'Pupaifang (普拍枋), the wide flat tie under the set. Find that horizontal line first, then look up into the blocks and arms.',
          'An outward arm. It steps the support out toward the eaves. Use it to see direction. Do not use it to decide the historic bracket grade or the carpentry of this hall.',
        ],
      },
      {
        heading: 'Where to click',
        paragraphs: [
          'Open the model in English. The steps are the same as on the Chinese page.',
        ],
        items: [
          'Open [?lang=en#/dayun](/?lang=en#/dayun).',
          'Switch the view to Dougong close-up.',
          'Choose Start from this dou. The sample title is Bottom large dou.',
          'Select the neighboring pupaifang and the lower gong, return to the dou, then open the column-top photograph.',
        ],
      },
      {
        heading: 'What this model will not tell you',
        paragraphs: [
          'The close-up contains 14 pieces: 1 pupaifang, 8 dou, 3 gong, and 2 outward arms. That is the count of the teaching geometry. A dou built from several blocks still counts as one piece. It is not an inventory of Dayun Temple, and it is not a restoration of any particular bracket type.',
          'For the whole hall’s vocabulary, read [Chinese wooden architecture](/en/chinese-wooden-architecture). For the building the sample comes from, read [Dayun Temple](/en/dayun-temple).',
        ],
      },
    ],
  },
  {
    path: '/en/chinese-wooden-architecture',
    lang: 'en',
    title: 'Chinese wooden architecture · a walkthrough of Dayun Temple',
    eyebrow: 'Intro · one hall',
    lead: 'Chinese wooden architecture is easier to start as a stack of layers: roof, timber frame, bracket sets, columns and ties, and the platform. This page uses one hall, the Amitabha Hall at Dayun Temple, to name those layers. The model shows positions for learning. It is not a measured drawing.',
    cta: { href: '/?lang=en#/dayun', label: 'Open the Dayun Temple model' },
    langSwitch: { href: '/components', label: '中文' },
    figure: hallFigureEn,
    sections: [
      {
        heading: 'What this page is, and is not',
        paragraphs: [
          'A general search for Chinese wooden architecture can mean building manuals, dynasties, or joinery. This page does none of that survey. It gives you one hall you can actually open, and the names used in that teaching model.',
          'Dayun Temple (大云院) is in Shihui village, Pingshun County, Shanxi. The hall in the model is the Amitabha Hall (弥陀殿). The site guide is [Dayun Temple · Amitabha Hall interactive guide](/en/dayun-temple). The bracket set alone is [What is dougong](/en/dougong).',
        ],
      },
      { heading: 'Read the hall from the top down', table: layersEn },
      {
        heading: 'Names you can select on the hall',
        items: [
          'Beam (梁): a heavier timber spanning between supports, along the depth of the hall. Older texts also use 栿.',
          'Support between beams: published notes mention camel-hump blocks (驼峰). The model uses plain blocks for that level and does not restore the historic shape.',
          'Purlin (檩, also 槫): long members running with the facade at several heights, carrying the rafters.',
          'Rafter (椽): thinner pieces running from the roof slope toward the eaves, across the purlins.',
          'Column (柱): the vertical post from the stone base upward.',
          'Lan’e (阑额): the tie linking neighboring column tops.',
          'Pupaifang (普拍枋): the wider flat timber above the lan’e, under the bracket set.',
          'Column base (柱础): the stone under the post, where wood meets the platform.',
        ],
      },
      {
        heading: 'Bracket close-up, counted separately',
        paragraphs: [
          'Move into the bracket set and the model switches to a generic assembly: pupaifang, dou, gong, and outward arms. Fourteen pieces is that assembly’s count, not a catalogue of surviving parts at the temple.',
        ],
      },
    ],
  },
  {
    path: '/en/dayun-temple',
    lang: 'en',
    title: 'Dayun Temple · Amitabha Hall interactive guide',
    eyebrow: 'Shanxi · Pingshun · Shihui village',
    lead: 'Dayun Temple (大云院) is in Shihui village, Pingshun County, Shanxi. This guide stays with one building there, the Amitabha Hall (弥陀殿): what to look at first, which wooden pieces the walkthrough names, and how to open the interactive model. The model is a teaching sketch, not a measured reconstruction.',
    cta: { href: '/?lang=en#/dayun', label: 'Open the Amitabha Hall model' },
    langSwitch: { href: '/dayun', label: '中文' },
    figure: hallFigureEn,
    sections: [
      {
        heading: 'Which building you are opening',
        paragraphs: [
          'Guanmu’s interactive site currently has one open building. Searching for Dayun Temple lands here: the monastery context, then the hall you can rotate. The Chinese entry page is [大云院 · 交互学习入口](/dayun). The hall’s own Chinese reading page is [弥陀殿 · 故事与拆解](/mituo-dian).',
          'Published introductions do not agree on a precise founding year, so this page does not state one. A rough period label in the interface, if you see one, is not a dating result.',
        ],
      },
      {
        heading: 'A five-step look, in English',
        paragraphs: [
          'The in-app story is called 抬头之后. Its travel scene and narration were written for this project. They are not a witness account. The piece names below are the teaching point.',
        ],
        items: [
          'In front of the hall: look at the eaves in the photograph before memorizing terms.',
          'Under the eaves: lift the roof in the model. The stacked wood between the column top and the eaves is the dougong.',
          'Among the pieces: match three names. Dou is the block, gong is the sideways arm, pupaifang is the flat tie underneath.',
          'One piece: pull a gong out and put it back, so you read it next to its neighbors.',
          'Back at the photograph: find the pupaifang again on the column-top bracket.',
        ],
      },
      {
        heading: 'Opening the model',
        paragraphs: [
          'Open [?lang=en#/dayun](/?lang=en#/dayun). Whole hall is the full building, Dougong close-up is the bracket close-up, and Start from this dou opens the bottom large dou. You can also finish the English reading on this site without the model: [what dougong is](/en/dougong), then [the layer walkthrough](/en/chinese-wooden-architecture), then the five steps above.',
        ],
      },
      {
        heading: 'Sources used as clues',
        paragraphs: [
          `Background reading includes the [Shanxi University archaeology note on Dayun Temple](${SXU}) and the publicly readable part of Zhang Hongfeng’s essay [大云院现状初探](${ZHANG}) (collected in 收藏与投资, 2023, no. 7). This page does not turn those sources into unverified builder biographies, legends, or a single founding year.`,
        ],
      },
    ],
  },
  {
    path: '/pupai-fang',
    lang: 'zh-CN',
    title: '普拍枋是什么 · 作用与怎么看',
    eyebrow: '构件 · 阑额上方',
    lead: '普拍枋是阑额上方的一条扁宽水平枋，给上面的铺作一个承接的位置。这一页说明它是什么、起什么作用，以及在大云院教学模型里怎么看。模型是教学示意，不是测绘复原。',
    cta: { href: '/#/dayun', label: '到模型里找这条枋' },
    figure: dougongFigure,
    sections: [
      {
        heading: '是什么',
        paragraphs: [
          '普拍枋铺在柱头这一层，比下面的阑额更扁、更宽，是一条水平木件。交互按钮把斗栱写成「斗拱」，普拍枋就在那一组木头的下面。',
          '这里只按教学模型里的位置来认。截面、长度和它与柱头的真实交接，都没有按实测复原。',
        ],
      },
      {
        heading: '作用',
        paragraphs: [
          '它为上部铺作提供承接。先找到这条水平线，再向上看斗和栱，柱头和屋檐之间的关系会清楚一些。模型顶部的槽口只说明木头要相接，不能用来判断真实榫卯。',
        ],
      },
      {
        heading: '怎么看',
        items: [
          '打开 [#/dayun](/#/dayun)。井号只是交互深链。整殿里进入「柱与枋」，普拍枋和阑额是分开的两项，可以单独显隐。',
          '再切到「斗拱局部」。底部横铺的那件就是普拍枋。样例从底部大斗开始，相邻构件里可以点到它。',
          '回到柱头铺作的照片，找斗栱下面那条扁宽横木。照片上的点如果出现，是教学观察点，不是实测定位。',
        ],
      },
      {
        heading: '接着看',
        paragraphs: [
          '斗栱整组怎么从大斗看起，见 [斗栱是什么](/dougong)。它下面那根联系柱子的横木，见 [阑额是什么](/lan-e)。五层和八类构件的名词表在 [古建筑构件入门](/components)。',
        ],
      },
    ],
  },
  {
    path: '/lan-e',
    lang: 'zh-CN',
    title: '阑额是什么 · 作用与怎么看',
    eyebrow: '构件 · 柱头之间',
    lead: '阑额在柱头附近，横向把相邻的柱子联系起来。教学模型把它和上方更扁宽的普拍枋分开显示，方便比较两层的位置。这一页说明它是什么、起什么作用、怎么看。模型不是测绘复原。',
    cta: { href: '/#/dayun', label: '到模型里看柱与枋' },
    figure: columnTieFigure,
    sections: [
      {
        heading: '是什么',
        paragraphs: [
          '阑额是柱头附近的横向木件，连接相邻的木柱。它不是普拍枋。普拍枋在它上方，更扁更宽，用来承接铺作。',
          '模型把这两件分开画，是为了能单独点选和显隐。分开显示不代表实物之间有这么大的空隙，也不能当成测绘图。',
        ],
      },
      {
        heading: '作用',
        paragraphs: [
          '在这个教学模型里，阑额的作用是把相邻柱头连起来，让竖向的柱有一条横向联系。这里不讲受力计算，也不把简化的截面当成这座殿的实测尺寸。',
        ],
      },
      {
        heading: '怎么看',
        items: [
          '打开 [#/dayun](/#/dayun)，在整殿的「柱与枋」里点「阑额」。它和「普拍枋」是目录里的两项。',
          '从正面看柱间：先找柱头之间那根横向联系的木件，再看它上面还有没有一条更扁宽的枋。',
          '柱头铺作的照片里，斗栱下面先容易看到普拍枋；阑额更靠近柱头。用照片对照层次即可，不能把它当作阑额的实测定位。',
        ],
      },
      {
        heading: '接着看',
        paragraphs: [
          '上面那条扁宽枋见 [普拍枋是什么](/pupai-fang)。整座殿的名词表在 [古建筑构件入门](/components)。交互仍从 [#/dayun](/#/dayun) 进入，这个井号地址不是落地页。',
        ],
      },
    ],
  },
];

const enPath = [
  { href: '/en/dougong', label: 'What dougong is' },
  { href: '/en/chinese-wooden-architecture', label: 'Read one hall as layers' },
  { href: '/en/dayun-temple', label: 'Walk Dayun Temple’s Amitabha Hall' },
  { href: '/?lang=en#/dayun', label: 'Open the interactive model' },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function inline(text) {
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let html = '';
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const href = match[2];
    if (!href.startsWith('/') && !href.startsWith('https://')) {
      throw new Error(`Refusing href in landing copy: ${href}`);
    }
    html += escapeHtml(text.slice(last, match.index));
    const external = href.startsWith('https://');
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    html += `<a href="${escapeHtml(href)}"${attrs}>${escapeHtml(match[1])}</a>`;
    last = match.index + match[0].length;
  }
  html += escapeHtml(text.slice(last));
  return html;
}

function renderSection(section) {
  const heading = `<h2>${escapeHtml(section.heading)}</h2>`;
  const paragraphs = (section.paragraphs || []).map(paragraph => `<p>${inline(paragraph)}</p>`).join('');
  const items = section.items?.length
    ? `<ul>${section.items.map(item => `<li>${inline(item)}</li>`).join('')}</ul>`
    : '';
  const table = section.table
    ? `<div class="table-wrap"><table><caption>${escapeHtml(section.table.caption)}</caption><thead><tr>${section.table.headers.map(header => `<th scope="col">${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${section.table.rows.map(row => `<tr>${row.map(cell => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
    : '';
  return `<section>${heading}${paragraphs}${items}${table}</section>`;
}

function renderFigure(figure) {
  if (!figure) return '';
  return `<figure><img src="${escapeHtml(figure.src)}" alt="${escapeHtml(figure.alt)}" /><figcaption>${inline(figure.caption)}</figcaption></figure>`;
}

function renderEnPath(page) {
  if (page.lang !== 'en') return '';
  const items = enPath.map(step => {
    const current = step.href === page.path ? ' aria-current="page"' : '';
    return `<li><a href="${escapeHtml(step.href)}"${current}>${escapeHtml(step.label)}</a></li>`;
  }).join('');
  return `<nav class="path" aria-label="English learning path"><p>English path you can finish on these pages</p><ol>${items}</ol></nav>`;
}

function renderLimit(page) {
  if (page.lang === 'en') {
    return `<aside class="limit"><h2>Teaching limit</h2><p>Sizes, piece counts, joints, and the explode animation explain relationships only. They are not a measured drawing, a construction sequence, or a structural calculation. The 14 pieces in the bracket close-up are the count of this teaching model, not an inventory of Dayun Temple.</p></aside>`;
  }
  return `<aside class="limit"><h2>教学边界</h2><p>尺寸、件数、榫卯和「拆开」的动画，都是为了看清关系。不能当成测绘图、施工顺序或受力计算。斗栱局部的 14 件是本教学模型的件数，不是大云院的实物清单。</p></aside>`;
}

function renderFooter(page) {
  const label = page.lang === 'en' ? 'All reading pages' : '全部阅读页';
  const home = page.lang === 'en' ? 'Guanmu home' : '观木首页';
  const enter = page.lang === 'en' ? 'Interactive model' : '交互探索';
  const modelHref = page.lang === 'en' ? '/?lang=en#/dayun' : '/#/dayun';
  const map = page.lang === 'en' ? 'Sitemap' : '站点地图';
  const links = pages.map(item => {
    const current = item.path === page.path ? ' aria-current="page"' : '';
    return `<li><a href="${item.path}"${current}>${escapeHtml(item.title)}</a></li>`;
  }).join('');
  return `<footer><nav aria-label="${label}"><p>${label}</p><ul>${links}</ul></nav><p class="footer-meta"><a href="/">${home}</a> · <a href="${modelHref}">${enter}</a> · <a href="/sitemap.xml">${map}</a></p><p class="footer-meta">观木 · 从一次仰望，到一次理解。</p></footer>`;
}

export function renderPage(page) {
  const alternates = (page.alternates || []).map(link => `<link rel="alternate" hreflang="${escapeHtml(link.hreflang)}" href="${SITE}${link.href}" />`).join('');
  const skip = page.lang === 'en' ? 'Skip to content' : '跳到正文';
  const brandNote = page.lang === 'en' ? 'Reading page' : '阅读页';
  const enter = page.lang === 'en' ? 'Interactive model' : '交互探索';
  const modelHref = page.lang === 'en' ? '/?lang=en#/dayun' : '/#/dayun';
  return `<!doctype html>
<html lang="${page.lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.lead)}" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#f3f1eb" />
  <link rel="canonical" href="${SITE}${page.path}" />
  ${alternates}
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="/seo/landing.css" />
</head>
<body>
  <a class="skip" href="#content">${skip}</a>
  <header class="site-header">
    <a class="brand" href="/">观木</a>
    <p class="brand-note">${brandNote}</p>
    <nav class="header-nav" aria-label="${page.lang === 'en' ? 'Page' : '本页'}">
      <a href="${modelHref}">${enter}</a>
      ${page.langSwitch ? `<a href="${escapeHtml(page.langSwitch.href)}" hreflang="${page.lang === 'en' ? 'zh-CN' : 'en'}">${escapeHtml(page.langSwitch.label)}</a>` : ''}
    </nav>
  </header>
  <main id="content">
    <article>
      <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
      <h1>${escapeHtml(page.title)}</h1>
      <p class="lead">${inline(page.lead)}</p>
      <p class="actions"><a class="cta" href="${escapeHtml(page.cta.href)}">${escapeHtml(page.cta.label)}</a></p>
      ${renderEnPath(page)}
      ${renderFigure(page.figure)}
      ${page.sections.map(renderSection).join('\n')}
      ${renderLimit(page)}
    </article>
  </main>
  ${renderFooter(page)}
  ${analyticsMarkup()}
</body>
</html>
`;
}

export function renderSitemap() {
  const urls = ['/', ...pages.map(page => page.path)];
  const body = urls.map(path => `  <url><loc>${SITE}${path}</loc><lastmod>2026-11-03</lastmod></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export function renderRobots() {
  const allows = pages.map(page => `Allow: ${page.path}`).join('\n');
  return `# Real landing paths are listed below. /#/dayun is the interactive app on the home document.
User-agent: *
Allow: /
${allows}

Sitemap: ${SITE}/sitemap.xml
`;
}

export function pageFile(page) {
  return `${page.path.slice(1)}.html`;
}
