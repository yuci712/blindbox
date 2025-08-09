import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BlindBox } from '../entity/blindbox.entity';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcryptjs';

@Provide()
@Scope(ScopeEnum.Singleton)
export class DataInitService {
  @InjectEntityModel(BlindBox)
  blindBoxRepository: Repository<BlindBox>;

  @InjectEntityModel(User)
  userRepository: Repository<User>;

  async initSampleData() {
    await this.initUsers();
    await this.initBlindBoxes();
  }

  async initUsers() {
    const userCount = await this.userRepository.count();
    if (userCount > 0) {
      console.log('Users already exist, skipping user initialization.');
      return;
    }

    const sampleUsers = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        avatar: null,
      },
      {
        username: 'customer1',
        email: 'customer1@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'customer',
        avatar: null,
      },
    ];

    for (const userData of sampleUsers) {
      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);
    }

    console.log('Sample users initialized successfully!');
  }

  async initBlindBoxes() {
    const count = await this.blindBoxRepository.count();
    if (count > 0) {
      console.log(
        'BlindBoxes already exist, skipping blindbox initialization.'
      );
      return;
    }

    const sampleBlindBoxes = [
      {
        name: '动漫奇想系列',
        series: '热门IP',
        description:
          '集结全球最受欢迎的动漫角色，从经典到新番，每一款都是对匠心工艺的致敬。',
        price: 59.99,
        image: 'https://source.unsplash.com/random/500x500/?anime,figure',
        category: '动漫手办',
        tags: ['动漫', '手办', '收藏'],
        items: [
          { name: '限定版·空之律者', rarity: 'SSR' as const, probability: 0.05, image: 'https://source.unsplash.com/random/200x200/?anime,goddess' },
          { name: '战斗形态·路飞', rarity: 'SR' as const, probability: 0.15, image: 'https://source.unsplash.com/random/200x200/?anime,pirate' },
          { name: '忍者之路·鸣人', rarity: 'R' as const, probability: 0.3, image: 'https://source.unsplash.com/random/200x200/?anime,ninja' },
          { name: '普通款·炭治郎', rarity: 'N' as const, probability: 0.5, image: 'https://source.unsplash.com/random/200x200/?anime,sword' },
        ],
        isActive: true,
        totalSold: 256,
      },
      {
        name: '机甲纪元系列',
        series: '科幻潮玩',
        description: '未来科技与机械美学的完美结合，打造属于你的桌面机甲军团。',
        price: 79.99,
        image: 'https://source.unsplash.com/random/500x500/?mecha,robot',
        category: '潮玩积木',
        tags: ['机甲', '科幻', '模型'],
        items: [
            { name: '黄金守护者', rarity: 'SSR' as const, probability: 0.05, image: 'https://source.unsplash.com/random/200x200/?robot,gold' },
            { name: '深空探索者', rarity: 'SR' as const, probability: 0.15, image: 'https://source.unsplash.com/random/200x200/?robot,space' },
            { name: '城市巡游者', rarity: 'R' as const, probability: 0.3, image: 'https://source.unsplash.com/random/200x200/?robot,city' },
            { name: '标准型机器人', rarity: 'N' as const, probability: 0.5, image: 'https://source.unsplash.com/random/200x200/?robot,standard' },
        ],
        isActive: true,
        totalSold: 189,
      },
      {
        name: '甜蜜食光系列',
        series: '仿真模型',
        description: '将世界各地的美味甜点化为掌心大小的精致模型，甜蜜你的每一天。',
        price: 29.99,
        image: 'https://source.unsplash.com/random/500x500/?dessert,cute',
        category: '美食模型',
        tags: ['美食', '可爱', '模型'],
        items: [
            { name: '彩虹独角兽蛋糕', rarity: 'SR' as const, probability: 0.1, image: 'https://source.unsplash.com/random/200x200/?cake,rainbow' },
            { name: '法式马卡龙塔', rarity: 'R' as const, probability: 0.2, image: 'https://source.unsplash.com/random/200x200/?macaron' },
            { name: '草莓甜甜圈', rarity: 'N' as const, probability: 0.35, image: 'https://source.unsplash.com/random/200x200/?donut' },
            { name: '抹茶冰淇淋', rarity: 'N' as const, probability: 0.35, image: 'https://source.unsplash.com/random/200x200/?icecream,matcha' },
        ],
        isActive: true,
        totalSold: 342,
      },
      {
        name: '星辰之谜系列',
        series: '梦幻珍藏',
        description: '捕捉宇宙的浪漫与神秘，每一件藏品都蕴含着星辰大海的故事。',
        price: 89.99,
        image: 'https://source.unsplash.com/random/500x500/?galaxy,crystal',
        category: '星空系列',
        tags: ['星空', '梦幻', '饰品'],
        items: [
            { name: '永恒彗星挂坠', rarity: 'SSR' as const, probability: 0.05, image: 'https://source.unsplash.com/random/200x200/?comet' },
            { name: '月光女神胸针', rarity: 'SR' as const, probability: 0.15, image: 'https://source.unsplash.com/random/200x200/?moon,goddess' },
            { name: '星云戒指', rarity: 'R' as const, probability: 0.3, image: 'https://source.unsplash.com/random/200x200/?nebula,ring' },
            { name: '普通星尘手链', rarity: 'N' as const, probability: 0.5, image: 'https://source.unsplash.com/random/200x200/?stardust' },
        ],
        isActive: true,
        totalSold: 78,
      },
      {
        name: '像素冒险系列',
        series: '复古游戏',
        description: '回到8-bit的黄金时代，用像素块构建你的童年记忆。',
        price: 49.99,
        image: 'https://source.unsplash.com/random/500x500/?pixel,game',
        category: '电子宠物',
        tags: ['像素', '复古', '游戏'],
        items: [
            { name: '传说勇者', rarity: 'SR' as const, probability: 0.1, image: 'https://source.unsplash.com/random/200x200/?pixel,hero' },
            { name: '魔法史莱姆', rarity: 'R' as const, probability: 0.2, image: 'https://source.unsplash.com/random/200x200/?pixel,slime' },
            { name: '普通小怪', rarity: 'N' as const, probability: 0.35, image: 'https://source.unsplash.com/random/200x200/?pixel,monster' },
            { name: '宝箱', rarity: 'N' as const, probability: 0.35, image: 'https://source.unsplash.com/random/200x200/?pixel,chest' },
        ],
        isActive: true,
        totalSold: 167,
      },
      {
        name: '萌宠派对系列',
        series: '可爱动物',
        description: '超萌的动物伙伴们来开派对啦！快来把它们带回家。',
        price: 39.99,
        image: 'https://source.unsplash.com/random/500x500/?cute,animal',
        category: '文具创意',
        tags: ['可爱', '动物', '派对'],
        items: [
            { name: '柯基宇航员', rarity: 'SR' as const, probability: 0.1, image: 'https://source.unsplash.com/random/200x200/?corgi,astronaut' },
            { name: 'DJ猫', rarity: 'R' as const, probability: 0.2, image: 'https://source.unsplash.com/random/200x200/?cat,dj' },
            { name: '柴犬厨师', rarity: 'N' as const, probability: 0.35, image: 'https://source.unsplash.com/random/200x200/?shiba,chef' },
            { name: '仓鼠学生', rarity: 'N' as const, probability: 0.35, image: 'https://source.unsplash.com/random/200x200/?hamster,student' },
        ],
        isActive: true,
        totalSold: 423,
      },
    ];

    for (const boxData of sampleBlindBoxes) {
      const blindBox = this.blindBoxRepository.create(boxData);
      await this.blindBoxRepository.save(blindBox);
    }

    console.log('Sample blindboxes initialized successfully!');
  }
}
