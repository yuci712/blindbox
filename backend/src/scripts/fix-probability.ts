import { DataSource } from 'typeorm';
import { BlindBox } from '../entity/blindbox.entity';

// 修复数据库中的概率数据
async function fixProbabilityData() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [BlindBox],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('数据库连接成功');

  const blindBoxRepository = dataSource.getRepository(BlindBox);
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
