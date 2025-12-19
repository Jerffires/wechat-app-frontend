
export interface CompositionOption {
  id: string;
  label: string;
  description?: string; // e.g., "X={...}"
  items: { id: string; label: string; desc?: string }[];
}

export const COMPOSITION_OPTIONS: CompositionOption[] = [
  {
    id: 'drinks',
    label: '饮料',
    description: 'X={饮料}',
    items: [
      { id: 'water', label: '白开水', desc: '平平淡淡才是真' },
      { id: 'milktea', label: '奶茶', desc: '甜美/快乐/热量炸弹' },
      { id: 'coffee', label: '咖啡', desc: '高效/清醒/优雅' },
      { id: 'alcohol', label: '酒', desc: '浪漫/微醺/发疯' },
      { id: 'milk', label: '牛奶', desc: '温和/可爱/百搭' },
      { id: 'herbal', label: '凉茶', desc: '养生/佛系/惜命' },
      { id: 'cola', label: '可乐', desc: '爽快/干脆/易爆炸' },
    ]
  },
  {
    id: 'animals',
    label: '动物',
    description: 'X={动物}',
    items: [
      { id: 'sloth', label: '树懒', desc: '能躺着绝不坐着' },
      { id: 'dog', label: '修勾', desc: '忠诚/舔狗/热情' },
      { id: 'cat', label: '猫猫', desc: '傲娇/安逸' },
      { id: 'psyduck', label: '可达鸭', desc: '眉头一皱发现事情并不简单' },
      { id: 'saltedfish', label: '咸鱼', desc: '梦想是翻身，但粘锅了' },
      { id: 'dragon', label: '喷火龙', desc: '易怒' },
    ]
  },
  {
    id: 'rpg_stats',
    label: '基础属性',
    description: 'X={基础属性}',
    items: [
      { id: 'luck', label: '幸运值', desc: '虽然通常是E' },
      { id: 'defense', label: '防御力', desc: '脸皮厚度' },
      { id: 'attack', label: '攻击力', desc: '怼人能力' },
      { id: 'int', label: '智力', desc: '或许偶尔下线' },
      { id: 'evasion', label: '闪避', desc: '无法选中/甩锅能力' },
    ]
  },
  {
    id: 'brain_storage',
    label: '大脑内存占用',
    description: 'X={大脑内存占用}',
    items: [
      { id: 'cringe', label: '尴尬回忆', desc: '睡前循环播放的黑历史' },
      { id: 'trash', label: '各种废料', desc: '一些无用的冷知识/八卦？' },
      { id: 'todo', label: '待办事项', desc: '永远做不完的ddl' },
      { id: 'blank', label: '空白发呆', desc: '待机ing' },
      { id: 'daydream', label: '白日梦', desc: '又在幻想中彩票/当老板' },
      { id: 'bgm', label: '洗脑神曲', desc: '停不下来的BGM' },
    ]
  },
  {
    id: 'output',
    label: '语言输出成分',
    description: 'X={语言输出成分}',
    items: [
      { id: 'silence', label: '沉默', desc: '不知道回什么/不想回' },
      { id: 'meme', label: '梗图/表情包', desc: '一种主要的社交流通货币' },
      { id: 'sarcasm', label: '阴阳怪气', desc: '就不好好说话' },
      { id: 'c_language', label: '优美的中国话', desc: '熟练掌握C语言' },
      { id: 'nonsense', label: '废话文学', desc: '听君一席话' },
    ]
  },
  {
    id: 'decision',
    label: '决策依据',
    description: 'X={决策依据}',
    items: [
      { id: 'tarot', label: '玄学/塔罗', desc: '我命由天不由我' },
      { id: 'blind', label: '瞎蒙', desc: '全都选C' },
      { id: 'stubborn', label: '头铁', desc: '啥都不管，先冲！' },
      { id: 'procrastinate', label: '拖延', desc: '拖到最后一刻问题就解决了' },
      { id: 'intuition', label: '直觉', desc: '没什么逻辑就是自信' },
      { id: 'logic', label: '慎重思考', desc: '必须深思熟虑' },
    ]
  },
  {
    id: 'little_people',
    label: '脑子里的三个小人',
    description: 'X={脑子里的三个小人}',
    items: [
      { id: 'villain', label: '邪恶反派', desc: '想毁灭世界' },
      { id: 'saint', label: '圣母', desc: '一切都可以原谅' },
      { id: 'crybaby', label: '爱哭鬼', desc: '因为一点破事就崩顺' },
      { id: 'clown', label: '小丑', desc: '希望不是我自己' },
      { id: 'detective', label: '大侦探', desc: '尤其在八卦的时候' },
      { id: 'scientist', label: '科学家', desc: '对一切都有探索欲' },
    ]
  },
  {
    id: 'losing',
    label: '正在肉眼可见流失',
    description: 'X={正在肉眼可见流失}',
    items: [
      { id: 'hair', label: '发量', desc: '秃头少男少女' },
      { id: 'money', label: '存款', desc: '月光族' },
      { id: 'patience', label: '耐心', desc: '现在的年轻人......' },
      { id: 'memory', label: '记忆力', desc: '就在嘴边但怎么想不起来' },
      { id: 'collagen', label: '胶原蛋白', desc: '不服老不行' },
      { id: 'annoyance', label: '烦恼', desc: '人生赢家非我莫属' },
    ]
  },
  {
    id: 'script',
    label: '人生剧本',
    description: 'X={翻开我的人生剧本，主要是}',
    items: [
      { id: 'pit', label: '填不完的坑', desc: 'flag立了从不回收' },
      { id: 'filler', label: '注水文', desc: '平平淡淡的剧情' },
      { id: 'twist', label: '神转折', desc: '龙王归来逆天改命' },
      { id: 'foreshadow', label: '伏笔', desc: '未来处处有精彩' },
      { id: 'unfinished', label: '烂尾了', desc: '做事情好像总虎头蛇尾' },
    ]
  }
];
