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
exports.BlindBoxService = void 0;
const core_1 = require("@midwayjs/core");
const typeorm_1 = require("@midwayjs/typeorm");
const typeorm_2 = require("typeorm");
const blindbox_entity_1 = require("../entity/blindbox.entity");
const user_blindbox_entity_1 = require("../entity/user-blindbox.entity");
const order_entity_1 = require("../entity/order.entity");
let BlindBoxService = class BlindBoxService {
    async getAllBlindBoxes(page = 1, limit = 10, category) {
        const skip = (page - 1) * limit;
        const whereCondition = { isActive: true };
        if (category) {
            whereCondition.category = category;
        }
        const [items, total] = await this.blindBoxRepository.findAndCount({
            where: whereCondition,
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getCategories() {
        const result = await this.blindBoxRepository
            .createQueryBuilder('blindbox')
            .select('DISTINCT blindbox.category', 'category')
            .where('blindbox.isActive = :isActive', { isActive: true })
            .getRawMany();
        return result.map(item => item.category);
    }
    async getBlindBoxById(id) {
        return await this.blindBoxRepository.findOne({ where: { id } });
    }
    async searchBlindBoxes(keyword, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [items, total] = await this.blindBoxRepository.findAndCount({
            where: [
                {
                    name: (0, typeorm_2.Like)(`%${keyword}%`),
                    isActive: true,
                },
                {
                    description: (0, typeorm_2.Like)(`%${keyword}%`),
                    isActive: true,
                },
                {
                    series: (0, typeorm_2.Like)(`%${keyword}%`),
                    isActive: true,
                }
            ],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async drawBlindBox(blindBoxId, userId) {
        const blindBox = await this.blindBoxRepository.findOne({
            where: { id: blindBoxId },
        });
        if (!blindBox || !blindBox.isActive) {
            throw new Error('盲盒不存在或已下架');
        }
        if (!blindBox.items || blindBox.items.length === 0) {
            throw new Error('盲盒没有可抽取的物品');
        }
        // 随机选择一个物品
        const randomIndex = Math.floor(Math.random() * blindBox.items.length);
        const drawnItem = blindBox.items[randomIndex];
        // 使用事务确保数据一致性
        const queryRunner = this.blindBoxRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // 创建订单
            const order = this.orderRepository.create({
                userId,
                blindBoxId,
                amount: blindBox.price,
                status: 'completed',
            });
            await queryRunner.manager.save(order);
            // 记录用户获得的物品
            const userBlindBox = this.userBlindBoxRepository.create({
                userId,
                blindBoxId,
                item: drawnItem,
            });
            await queryRunner.manager.save(userBlindBox);
            // 更新销量
            await queryRunner.manager.update(blindbox_entity_1.BlindBox, blindBoxId, {
                totalSold: blindBox.totalSold + 1,
            });
            await queryRunner.commitTransaction();
            return { item: drawnItem, order };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getUserBlindBoxes(userId) {
        return await this.userBlindBoxRepository.find({
            where: { userId },
            relations: ['blindBox'],
            order: { obtainedAt: 'DESC' },
        });
    }
    // 管理员功能：获取所有盲盒（包括未激活的）
    async getAllBlindBoxesForAdmin() {
        const blindBoxes = await this.blindBoxRepository.find({
            order: { createdAt: 'DESC' },
        });
        const total = blindBoxes.length;
        const activeCount = blindBoxes.filter(box => box.isActive).length;
        return {
            items: blindBoxes,
            total,
            activeCount,
            inactiveCount: total - activeCount,
        };
    }
    // 管理员功能：创建盲盒
    async createBlindBox(blindBoxData) {
        const { name, description, price, image, items, category } = blindBoxData;
        if (!name || !description || !price || !items || !category) {
            throw new Error('缺少必要字段');
        }
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('盲盒必须包含至少一个物品');
        }
        // 验证和修正概率数据
        const processedItems = items.map(item => ({
            ...item,
            // 确保概率是小数格式存储（0-1之间）- 修复：包含等于1的情况
            probability: item.probability >= 1 ? item.probability / 100 : item.probability
        }));
        // 验证概率总和
        const totalProbability = processedItems.reduce((sum, item) => sum + item.probability, 0);
        if (Math.abs(totalProbability - 1) > 0.001) {
            console.warn(`警告：新盲盒的概率总和不等于1，当前为：${totalProbability}`);
        }
        const blindBox = this.blindBoxRepository.create({
            name,
            description,
            price: Number(price),
            image: image || '/placeholder-box.jpg',
            items: processedItems,
            category,
            isActive: true,
            totalSold: 0,
        });
        return await this.blindBoxRepository.save(blindBox);
    }
    // 管理员功能：更新盲盒
    async updateBlindBox(id, blindBoxData) {
        const blindBox = await this.blindBoxRepository.findOne({ where: { id } });
        if (!blindBox) {
            throw new Error('盲盒不存在');
        }
        const { name, description, price, image, items, category, isActive } = blindBoxData;
        if (items && (!Array.isArray(items) || items.length === 0)) {
            throw new Error('盲盒必须包含至少一个物品');
        }
        // 验证和修正概率数据
        let processedItems = items;
        if (items && Array.isArray(items)) {
            processedItems = items.map(item => ({
                ...item,
                // 确保概率是小数格式存储（0-1之间）- 修复：包含等于1的情况
                probability: item.probability >= 1 ? item.probability / 100 : item.probability
            }));
            // 验证概率总和
            const totalProbability = processedItems.reduce((sum, item) => sum + item.probability, 0);
            if (Math.abs(totalProbability - 1) > 0.001) {
                console.warn(`警告：盲盒 ${id} 的概率总和不等于1，当前为：${totalProbability}`);
            }
        }
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (description !== undefined)
            updateData.description = description;
        if (price !== undefined)
            updateData.price = Number(price);
        if (image !== undefined)
            updateData.image = image;
        if (processedItems !== undefined)
            updateData.items = processedItems;
        if (category !== undefined)
            updateData.category = category;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        await this.blindBoxRepository.update(id, updateData);
        return await this.blindBoxRepository.findOne({ where: { id } });
    }
    // 管理员功能：删除盲盒
    async deleteBlindBox(id) {
        const blindBox = await this.blindBoxRepository.findOne({ where: { id } });
        if (!blindBox) {
            throw new Error('盲盒不存在');
        }
        try {
            // 统计相关数据，用于日志记录
            const userBlindBoxCount = await this.userBlindBoxRepository.count({ where: { blindBoxId: id } });
            const orderCount = await this.orderRepository.count({ where: { blindBoxId: id } });
            console.log(`准备删除盲盒 ${id} (${blindBox.name})`);
            console.log(`- 用户收藏记录: ${userBlindBoxCount} 条`);
            console.log(`- 订单记录: ${orderCount} 条`);
            // 删除前先清理相关的外键引用数据
            if (userBlindBoxCount > 0) {
                console.log('正在删除用户收藏记录...');
                await this.userBlindBoxRepository.delete({ blindBoxId: id });
                console.log('用户收藏记录删除完成');
            }
            if (orderCount > 0) {
                console.log('正在删除订单记录...');
                await this.orderRepository.delete({ blindBoxId: id });
                console.log('订单记录删除完成');
            }
            // 最后删除盲盒本身
            console.log('正在删除盲盒主记录...');
            await this.blindBoxRepository.delete(id);
            console.log('盲盒删除完成');
            return {
                message: '盲盒及相关数据删除成功',
                details: {
                    deletedUserBlindBoxes: userBlindBoxCount,
                    deletedOrders: orderCount
                }
            };
        }
        catch (error) {
            console.error('删除盲盒时出错:', error);
            throw new Error(`删除盲盒失败: ${error.message}`);
        }
    }
    // 管理员功能：切换盲盒激活状态
    async toggleBlindBoxActive(id) {
        const blindBox = await this.blindBoxRepository.findOne({ where: { id } });
        if (!blindBox) {
            throw new Error('盲盒不存在');
        }
        await this.blindBoxRepository.update(id, { isActive: !blindBox.isActive });
        return await this.blindBoxRepository.findOne({ where: { id } });
    }
    // 管理员功能：获取统计数据
    async getStatistics() {
        const totalBlindBoxes = await this.blindBoxRepository.count();
        const activeBlindBoxes = await this.blindBoxRepository.count({
            where: { isActive: true },
        });
        const totalOrders = await this.orderRepository.count();
        const totalRevenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.amount)', 'sum')
            .where('order.status = :status', { status: 'completed' })
            .getRawOne();
        const topSellingBlindBoxes = await this.blindBoxRepository.find({
            order: { totalSold: 'DESC' },
            take: 5,
        });
        return {
            totalBlindBoxes,
            activeBlindBoxes,
            inactiveBlindBoxes: totalBlindBoxes - activeBlindBoxes,
            totalOrders,
            totalRevenue: (totalRevenue === null || totalRevenue === void 0 ? void 0 : totalRevenue.sum) || 0,
            topSellingBlindBoxes,
        };
    }
    // 修复概率数据
    async fixProbabilityData() {
        const allBlindBoxes = await this.blindBoxRepository.find();
        let fixedCount = 0;
        const fixedBoxes = [];
        for (const blindBox of allBlindBoxes) {
            let needsUpdate = false;
            const updatedItems = blindBox.items.map(item => {
                // 检查概率是否需要修正 - 修复：包含等于1的情况
                if (item.probability >= 1) {
                    console.log(`修正盲盒 "${blindBox.name}" 中物品 "${item.name}" 的概率：${item.probability} -> ${item.probability / 100}`);
                    needsUpdate = true;
                    return {
                        ...item,
                        probability: item.probability / 100
                    };
                }
                return item;
            });
            if (needsUpdate) {
                blindBox.items = updatedItems;
                await this.blindBoxRepository.save(blindBox);
                fixedCount++;
                fixedBoxes.push(blindBox.name);
                console.log(`已更新盲盒 "${blindBox.name}"`);
            }
        }
        return {
            totalBoxes: allBlindBoxes.length,
            fixedCount,
            fixedBoxes
        };
    }
    // 清空所有用户收藏数据
    async clearAllUserCollections() {
        const deletedCount = await this.userBlindBoxRepository.count();
        await this.userBlindBoxRepository.clear();
        console.log(`已清空所有用户收藏数据，共删除 ${deletedCount} 条记录`);
        return {
            deletedCount,
            message: `成功清空所有用户收藏数据，共删除 ${deletedCount} 条记录`
        };
    }
    // 清空指定用户的收藏数据
    async clearUserCollection(userId) {
        const userCollections = await this.userBlindBoxRepository.find({
            where: { userId }
        });
        const deletedCount = userCollections.length;
        await this.userBlindBoxRepository.delete({ userId });
        console.log(`已清空用户 ${userId} 的收藏数据，共删除 ${deletedCount} 条记录`);
        return {
            deletedCount,
            message: `成功清空用户收藏数据，共删除 ${deletedCount} 条记录`
        };
    }
};
__decorate([
    (0, typeorm_1.InjectEntityModel)(blindbox_entity_1.BlindBox),
    __metadata("design:type", typeorm_2.Repository)
], BlindBoxService.prototype, "blindBoxRepository", void 0);
__decorate([
    (0, typeorm_1.InjectEntityModel)(user_blindbox_entity_1.UserBlindBox),
    __metadata("design:type", typeorm_2.Repository)
], BlindBoxService.prototype, "userBlindBoxRepository", void 0);
__decorate([
    (0, typeorm_1.InjectEntityModel)(order_entity_1.Order),
    __metadata("design:type", typeorm_2.Repository)
], BlindBoxService.prototype, "orderRepository", void 0);
BlindBoxService = __decorate([
    (0, core_1.Provide)()
], BlindBoxService);
exports.BlindBoxService = BlindBoxService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxpbmRib3guc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlL2JsaW5kYm94LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQXlDO0FBQ3pDLCtDQUFzRDtBQUN0RCxxQ0FBMkM7QUFDM0MsK0RBQXFEO0FBQ3JELHlFQUE4RDtBQUM5RCx5REFBK0M7QUFHeEMsSUFBTSxlQUFlLEdBQXJCLE1BQU0sZUFBZTtJQVUxQixLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLFFBQWlCO1FBQzVELE1BQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNoQyxNQUFNLGNBQWMsR0FBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUUvQyxJQUFJLFFBQVEsRUFBRTtZQUNaLGNBQWMsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1NBQ3BDO1FBRUQsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUM7WUFDaEUsS0FBSyxFQUFFLGNBQWM7WUFDckIsSUFBSTtZQUNKLElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRTtTQUM3QixDQUFDLENBQUM7UUFFSCxPQUFPO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxJQUFJO1lBQ0osS0FBSztZQUNMLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDckMsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYTtRQUNqQixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0I7YUFDekMsa0JBQWtCLENBQUMsVUFBVSxD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