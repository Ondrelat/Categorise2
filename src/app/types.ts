import type { JsonValue } from '@prisma/client/runtime/library';

export interface Category {
  id: string;
  name?: string | null | undefined;  // Changé de name à name?
  description: string;
  parentId?: string | null;  // Changé de parentId à parentCategory
  parentCategory?: string | null;  // Changé de parentId à parentCategory
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

export interface CategoryTreeItem {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  subcategories: CategoryTreeItem[];
}

export interface Article {
  id: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  createdAt?: Date;
  categoryId?: string;
}
export interface articleClassement {
  id: string;
  tconst: string | null;
  averageRatingIMDB: number | null;
  numVotesIMDB: number | null;
  titre_fr: string | null;
  titre_en: string | null;
  image_url: string | null;
  createdAt: Date;
  rankCategorise: number | null;
  scoreCategorise: number | null;
  liked?: boolean | null;
  rating?: number | null;
}

export interface articleClassementInMyList extends articleClassement {
  rank?: number | null;
  rankTierList?: string | null;
  onList?: boolean | null;
  categoryId?: string | null;
}

export interface CreateCategoryResponse {
  success: boolean;
  message: string;
  data?: CategoryTreeItem;
}

type CommentWithUser = {
  id: string;
  content?: string | null | undefined;
  contentJson?: JsonValue | null | undefined // Au lieu de JSON
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  discussionId: string | null;
  parentId: string | null;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
};

export type CommentWithReplies = CommentWithUser & {
  replies: CommentWithReplies[];
};

export const ARTICLE_TYPES = [
  'Classement',
  'Forum',
  'Apprentissage',
] as const;

export type ContentSection = typeof ARTICLE_TYPES[number];