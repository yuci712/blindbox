export interface User {
  id: number;
  username: string;
  avatar?: string;
}

export interface PlayerShow {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
  user: User;
  comments?: Comment[];
  commentCount: number; // 新增评论数量字段
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: User;
}

export interface BlindBoxItem {
  name: string;
  rarity: string;
  probability: number;
  image?: string;
}

export interface BlindBox {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  items: BlindBoxItem[];
  category: string;
  series: string;
  tags: string[];
  isActive: boolean;
  totalSold: number;
  createdAt: string;
  updatedAt: string;
}
