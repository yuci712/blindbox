"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const blindbox_entity_1 = require("../entity/blindbox.entity");
// 修复数据库中的概率数据
async function fixProbabilityData() {
    const dataSource = new typeorm_1.DataSource({
        type: 'sqlite',
        database: 'database.sqlite',
        entities: [blindbox_entity_1.BlindBox],
        synchronize: false,
    });
    await dataSource.initialize();
    console.log('数据库连接成功');
    const blindBoxRepository = dataSource.getRepository(blindbox_entity_1.BlindBox);
    const allBlindBoxes = await blindBoxRepository.find();
    console.log(`找到 ${allBlindBoxes.length} 个盲盒`);
    for (const blindBox of allBlindBoxes) {
        let needsUpdate = false;
        const updatedItems = blindBox.items.map(item => {
            // 检查概率是否需要修正
            if (item.probability > 1) {
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
            await blindBoxRepository.save(blindBox);
            console.log(`已更新盲盒 "${blindBox.name}"`);
        }
    }
    await dataSource.destroy();
    console.log('数据修复完成');
}
// 运行修复脚本
fixProbabilityData().catch(console.error);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4LXByb2JhYmlsaXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NjcmlwdHMvZml4LXByb2JhYmlsaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXFDO0FBQ3JDLCtEQUFxRDtBQUVyRCxjQUFjO0FBQ2QsS0FBSyxVQUFVLGtCQUFrQjtJQUMvQixNQUFNLFVBQVUsR0FBRyxJQUFJLG9CQUFVLENBQUM7UUFDaEMsSUFBSSxFQUFFLFFBQVE7UUFDZCxRQUFRLEVBQUUsaUJBQWlCO1FBQzNCLFFBQVEsRUFBRSxDQUFDLDBCQUFRLENBQUM7UUFDcEIsV0FBVyxFQUFFLEtBQUs7S0FDbkIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUV2QixNQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUMsMEJBQVEsQ0FBQyxDQUFDO0lBQzlELE1BQU0sYUFBYSxHQUFHLE1BQU0sa0JBQWtCLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLGFBQWEsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxDQUFDO0lBRTlDLEtBQUssTUFBTSxRQUFRLElBQUksYUFBYSxFQUFFO1FBQ3BDLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN4QixNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM3QyxhQUFhO1lBQ2IsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBRTtnQkFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLFFBQVEsQ0FBQyxJQUFJLFVBQVUsSUFBSSxDQUFDLElBQUksU0FBUyxJQUFJLENBQUMsV0FBVyxPQUFPLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDL0csV0FBVyxHQUFHLElBQUksQ0FBQztnQkFDbkIsT0FBTztvQkFDTCxHQUFHLElBQUk7b0JBQ1AsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRztpQkFDcEMsQ0FBQzthQUNIO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksV0FBVyxFQUFFO1lBQ2YsUUFBUSxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7WUFDOUIsTUFBTSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1NBQ3pDO0tBQ0Y7SUFFRCxNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFFRCxTQUFTO0FBQ1Qsa0JBQWtCLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDIn0=