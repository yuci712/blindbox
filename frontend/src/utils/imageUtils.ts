/**
 * 图片URL处理工具函数
 */

const API_BASE_HOST = 'http://127.0.0.1:7001';

/**
 * 将相对路径的图片URL转换为完整的URL
 * @param imageUrl 图片URL，可能是相对路径或完整URL
 * @returns 完整的图片URL
 */
export function getFullImageUrl(imageUrl: string | undefined | null): string {
  // 如果没有图片URL，返回默认图片
  if (!imageUrl) {
    return '/default-box.png';
  }

  // 如果已经是完整的HTTP URL，直接返回
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // 如果是相对路径（以/开头），转换为完整URL
  if (imageUrl.startsWith('/')) {
    return `${API_BASE_HOST}${imageUrl}`;
  }

  // 如果是相对路径（不以/开头），加上前缀
  return `${API_BASE_HOST}/${imageUrl}`;
}

/**
 * 检查图片URL是否有效
 * @param imageUrl 图片URL
 * @returns Promise<boolean>
 */
export function checkImageUrl(imageUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = getFullImageUrl(imageUrl);
  });
}

/**
 * 获取图片的安全URL，如果原URL无效，返回默认图片
 * @param imageUrl 原始图片URL
 * @param defaultUrl 默认图片URL
 * @returns Promise<string>
 */
export async function getSafeImageUrl(
  imageUrl: string | undefined | null, 
  defaultUrl: string = '/default-box.png'
): Promise<string> {
  if (!imageUrl) {
    return defaultUrl;
  }

  const fullUrl = getFullImageUrl(imageUrl);
  const isValid = await checkImageUrl(fullUrl);
  
  return isValid ? fullUrl : defaultUrl;
}
