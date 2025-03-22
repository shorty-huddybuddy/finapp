export interface Author {
  name: string;
  handle: string;
  avatar: string;
  isPremium: boolean;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  isPremiumPost: boolean;
  timestamp: string;
  liked: boolean;
  requiredSubscriptionTier?: string;
  minimumTierRequired?: string;
  hasAccess: boolean;
  creatorId?: string;
}

export interface PostsResponse {
  posts: Post[];
  nextPageCursor?: string;
}
