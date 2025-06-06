

export interface Category {
    id: string;
    name: string;
    description: string;
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
    title: string;
    content?: string;
    imageUrl?: string;
    type: string;
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
    rankCategorise: Number | null;
    scoreCategorise: Number | null;
  }

  export interface CreateCategoryResponse {
    success: boolean;
    message: string;
    data?: CategoryTreeItem;
  }