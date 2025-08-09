"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataInitService = void 0;
const core_1 = require("@midwayjs/core");
const typeorm_1 = require("@midwayjs/typeorm");
const typeorm_2 = require("typeorm");
const blindbox_entity_1 = require("../entity/blindbox.entity");
const user_entity_1 = require("../entity/user.entity");
const bcrypt = require("bcryptjs");
let DataInitService = class DataInitService {
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
            console.log('BlindBoxes already exist, skipping blindbox initialization.');
            return;
        }
        const sampleBlindBoxes = [
            {
                name: '动漫奇想系列',
                series: '热门IP',
                description: '集结全球最受欢迎的动漫角色，从经典到新番，每一款都是对匠心工艺的致敬。',
                price: 59.99,
                image: 'https://source.unsplash.com/random/500x500/?anime,figure',
                category: '动漫手办',
                tags: ['动漫', '手办', '收藏'],
                items: [
                    { name: '限定版·空之律者', rarity: 'SSR', probability: 0.05, image: 'https://source.unsplash.com/random/200x200/?anime,goddess' },
                    { name: '战斗形态·路飞', rarity: 'SR', probability: 0.15, image: 'https://source.unsplash.com/random/200x200/?anime,pirate' },
                    { name: '忍者之路·鸣人', rarity: 'R', probability: 0.3, image: 'https://source.unsplash.com/random/200x200/?anime,ninja' },
                    { name: '普通款·炭治郎', rarity: 'N', probability: 0.5, image: 'https://source.unsplash.com/random/200x200/?anime,sword' },
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
                    { name: '黄金守护者', rarity: 'SSR', probability: 0.05, image: 'https://source.unsplash.com/random/200x200/?robot,gold' },
                    { name: '深空探索者', rarity: 'SR', probability: 0.15, image: 'https://source.unsplash.com/random/200x200/?robot,space' },
                    { name: '城市巡游者', rarity: 'R', probability: 0.3, image: 'https://source.unsplash.com/random/200x200/?robot,city' },
                    { name: '标准型机器人', rarity: 'N', probability: 0.5, image: 'https://source.unsplash.com/random/200x200/?robot,standard' },
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
                    { name: '彩虹独角兽蛋糕', rarity: 'SR', probability: 0.1, image: 'https://source.unsplash.com/random/200x200/?cake,rainbow' },
                    { name: '法式马卡龙塔', rarity: 'R', probability: 0.2, image: 'https://source.unsplash.com/random/200x200/?macaron' },
                    { name: '草莓甜甜圈', rarity: 'N', probability: 0.35, image: 'https://source.unsplash.com/random/200x200/?donut' },
                    { name: '抹茶冰淇淋', rarity: 'N', probability: 0.35, image: 'https://source.unsplash.com/random/200x200/?icecream,matcha' },
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
                    { name: '永恒彗星挂坠', rarity: 'SSR', probability: 0.05, image: 'https://source.unsplash.com/random/200x200/?comet' },
                    { name: '月光女神胸针', rarity: 'SR', probability: 0.15, image: 'https://source.unsplash.com/random/200x200/?moon,goddess' },
                    { name: '星云戒指', rarity: 'R', probability: 0.3, image: 'https://source.unsplash.com/random/200x200/?nebula,ring' },
                    { name: '普通星尘手链', rarity: 'N', probability: 0.5, image: 'https://source.unsplash.com/random/200x200/?stardust' },
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
                    { name: '传说勇者', rarity: 'SR', probability: 0.1, image: 'https://source.unsplash.com/random/200x200/?pixel,hero' },
                    { name: '魔法史莱姆', rarity: 'R', probability: 0.2, image: 'https://source.unsplash.com/random/200x200/?pixel,slime' },
                    { name: '普通小怪', rarity: 'N', probability: 0.35, image: 'https://source.unsplash.com/random/200x200/?pixel,monster' },
                    { name: '宝箱', rarity: 'N', probability: 0.35, image: 'https://source.unsplash.com/random/200x200/?pixel,chest' },
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
                    { name: '柯基宇航员', rarity: 'SR', probability: 0.1, image: 'https://source.unsplash.com/random/200x200/?corgi,astronaut' },
                    { name: 'DJ猫', rarity: 'R', probability: 0.2, image: 'https://source.unsplash.com/random/200x200/?cat,dj' },
                    { name: '柴犬厨师', rarity: 'N', probability: 0.35, image: 'https://source.unsplash.com/random/200x200/?shiba,chef' },
                    { name: '仓鼠学生', rarity: 'N', probability: 0.35, image: 'https://source.unsplash.com/random/200x200/?hamster,student' },
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
};
__decorate([
    (0, typeorm_1.InjectEntityModel)(blindbox_entity_1.BlindBox),
    __metadata("design:type", typeorm_2.Repository)
], DataInitService.prototype, "blindBoxRepository", void 0);
__decorate([
    (0, typeorm_1.InjectEntityModel)(user_entity_1.User),
    __metadata("design:type", typeorm_2.Repository)
], DataInitService.prototype, "userRepository", void 0);
DataInitService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Scope)(core_1.ScopeEnum.Singleton)
], DataInitService);
exports.DataInitService = DataInitService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1pbml0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZS9kYXRhLWluaXQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBMkQ7QUFDM0QsK0NBQXNEO0FBQ3RELHFDQUFxQztBQUNyQywrREFBcUQ7QUFDckQsdURBQTZDO0FBQzdDLG1DQUFtQztBQUk1QixJQUFNLGVBQWUsR0FBckIsTUFBTSxlQUFlO0lBTzFCLEtBQUssQ0FBQyxjQUFjO1FBQ2xCLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxLQUFLLENBQUMsU0FBUztRQUNiLE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNwRCxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUU7WUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO1lBQ2xFLE9BQU87U0FDUjtRQUVELE1BQU0sV0FBVyxHQUFHO1lBQ2xCO2dCQUNFLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixLQUFLLEVBQUUsbUJBQW1CO2dCQUMxQixRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUM7Z0JBQzNDLElBQUksRUFBRSxPQUFPO2dCQUNiLE1BQU0sRUFBRSxJQUFJO2FBQ2I7WUFDRDtnQkFDRSxRQUFRLEVBQUUsV0FBVztnQkFDckIsS0FBSyxFQUFFLHVCQUF1QjtnQkFDOUIsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDO2dCQUM5QyxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsTUFBTSxFQUFFLElBQUk7YUFDYjtTQUNGLENBQUM7UUFFRixLQUFLLE1BQU0sUUFB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