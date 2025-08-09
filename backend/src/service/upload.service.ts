import { Provide } from '@midwayjs/core';
import { Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import * as fs from 'fs-extra';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Provide()
export class UploadService {
  @Inject()
  ctx: Context;

  async upload(files: any[]) {
    const urls = [];
    for (const file of files) {
      const filename = uuidv4() + join(file.filename);
      const targetPath = join(__dirname, '../../uploads/images', filename);
      await fs.move(file.data, targetPath);
      urls.push(`/public/${filename}`);
    }
    return urls;
  }
}
