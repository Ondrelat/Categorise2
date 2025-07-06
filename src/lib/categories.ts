'use server';

import prisma from './db/db';

import { unstable_cache, revalidatePath } from 'next/cache';
import { Category, CategoryTreeItem } from '@/app/types';

// Cache optimisé pour les catégories avec typage strict
const getCachedCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const startTime = performance.now();

    try {
      const categories = await prisma.$queryRaw<Category[]>`
        WITH RECURSIVE category_tree AS (
          SELECT 
            id, 
            name, 
            description, 
            "isActive", 
            "parentId",
            0 AS depth,
            ARRAY[id] AS path
          FROM "Categories"
          WHERE "parentId" IS NULL 
            AND "isActive" = true
        
          UNION ALL
        
          SELECT 
            c.id, 
            c.name, 
            c.description, 
            c."isActive", 
            c."parentId",
            ct.depth + 1,
            ct.path || c.id
          FROM "Categories" c
          JOIN category_tree ct ON c."parentId" = ct.id
          WHERE c."isActive" = true
        )
        SELECT 
          id, 
          name, 
          description, 
          "isActive", 
          "parentId",
          depth
        FROM category_tree
        ORDER BY path ASC
      `;

      const endTime = performance.now();
      console.log(`Optimized categories fetched in ${endTime - startTime}ms`);

      return categories;
    } catch (error: unknown) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  ['categories-tree'],
  {
    revalidate: 3600,
    tags: ['categories']
  }
);

// Fonction optimisée pour construire l'arbre avec typage strict
const buildCategoryTree = (
  categories: Category[],
  parentId: string | null = null
): CategoryTreeItem[] => {
  // Créer une Map avec clé strictement typée
  const categoryMap = new Map<string | null, Category[]>();

  // Grouper les catégories par parentId avec gestion stricte des undefined
  categories.forEach(cat => {
    // Conversion explicite : undefined devient null
    const key: string | null = cat.parentId ?? null;

    if (!categoryMap.has(key)) {
      categoryMap.set(key, []);
    }
    categoryMap.get(key)!.push(cat);
  });

  // Fonction récursive avec typage strict
  const buildTree = (currentParentId: string | null): CategoryTreeItem[] => {
    const children = categoryMap.get(currentParentId) || [];

    return children.map(cat => ({
      id: cat.id,
      name: cat.name ?? "",
      description: cat.description ?? "",
      isActive: cat.isActive ?? false,
      // Conversion explicite pour éviter l'erreur TypeScript
      parentId: cat.parentId ?? null,
      subcategories: buildTree(cat.id)
    }));
  };

  return buildTree(parentId);
};

// Fonction principale avec gestion d'erreur typée
export const getCategories = async (): Promise<CategoryTreeItem[]> => {
  try {
    const categories = await getCachedCategories();
    return buildCategoryTree(categories);
  } catch (error: unknown) {
    console.error('Error in getCategories:', error);
    throw error;
  }
};

// Fonction pour obtenir une catégorie spécifique avec typage strict
export const getCategoryByName = unstable_cache(
  async (name: string): Promise<Category | null> => {
    const startTime = performance.now();

    try {
      const category = await prisma.categories.findFirst({
        where: {
          name: name,
          isActive: true
        },
        select: {
          id: true,
          name: true,
          description: true,
          isActive: true,
          parentId: true,
          imageUrl: true,
          slug: true
        }
      });

      const endTime = performance.now();
      console.log(`Category "${name}" fetched in ${endTime - startTime}ms`);

      return category;
    } catch (error: unknown) {
      console.error(`Error fetching category "${name}":`, error);
      throw error;
    }
  },
  ['category-by-name'],
  {
    revalidate: 1800,
    tags: ['categories']
  }
);


// Types plus stricts pour éviter les erreurs undefined
export interface StrictCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  parentId: string | null; // Jamais undefined
  imageUrl?: string | null;
  slug?: string | null;
}

export interface StrictCategoryTreeItem {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  parentId: string | null; // Jamais undefined
  subcategories: StrictCategoryTreeItem[];
}



export async function getCategoryById(id: string) {

  try {
    const category = await prisma.categories.findFirst({
      select: { name: true },
      where: {
        id: id,
      },
    });

    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new Error('Error fetching category');
  }
}

// Nouvelle fonction pour supprimer une catégorie
export async function deleteCategory(categoryId: string) {
  try {
    // Vérifier d'abord s'il y a des sous-catégories
    const subcategories = await prisma.categories.findMany({
      where: {
        parentId: categoryId
      }
    });

    if (subcategories.length > 0) {
      return {
        success: false,
        message: 'Impossible de supprimer une catégorie qui contient des sous-catégories'
      };
    }

    // Supprimer la catégorie
    await prisma.categories.delete({
      where: {
        id: categoryId
      }
    });

    // Revalider les chemins pour rafraîchir les données
    revalidatePath('/admin/categories');
    revalidatePath('/categories');

    return {
      success: true,
      message: 'Catégorie supprimée avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    return {
      success: false,
      message: 'Une erreur est survenue lors de la suppression de la catégorie'
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Nouvelle fonction pour mettre à jour une catégorie
export async function updateCategory(
  categoryId: string,
  data: { name: string; description?: string; isActive?: boolean }
) {
  try {
    const { name } = data;

    // Validation des données
    if (!name) {
      return {
        success: false,
        message: 'Le nom et le name sont requis'
      };
    }

    // Vérifier que le name est unique
    const existingCategory = await prisma.categories.findFirst({
      where: {
        name,
        id: {
          not: categoryId
        }
      }
    });

    if (existingCategory) {
      return {
        success: false,
        message: 'Une catégorie avec ce name existe déjà'
      };
    }

    // Mettre à jour la catégorie
    const updatedCategory = await prisma.categories.update({
      where: {
        id: categoryId
      },
      data
    });

    // Revalider les chemins pour rafraîchir les données
    revalidatePath('/admin/categories');
    revalidatePath('/categories');

    return {
      success: true,
      message: 'Catégorie mise à jour avec succès',
      data: updatedCategory
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    return {
      success: false,
      message: 'Une erreur est survenue lors de la mise à jour de la catégorie'
    };
  } finally {
    await prisma.$disconnect();
  }
}

export async function createCategory(data: {
  name: string;
  parentCategoryName?: string | null;
  description?: string;
  isActive?: boolean;
}) {
  'use server';

  const { name, parentCategoryName = null, description = '', isActive = true } = data;
  try {
    // Validation des données
    if (!name) {
      return {
        success: false,
        message: 'Le nom est requis'
      };
    }

    // Vérifier que le name est unique
    const existingCategory = await prisma.categories.findFirst({
      where: {
        name: name
      }
    });

    if (existingCategory) {
      return {
        success: false,
        message: 'Une catégorie avec ce name existe déjà'
      };
    }

    // Déterminer parentId à partir de parentCategoryName
    let parentId = null;
    if (parentCategoryName) {
      const parentCategory = await prisma.categories.findFirst({
        where: {
          name: parentCategoryName
        }
      });

      if (!parentCategory) {
        return {
          success: false,
          message: `La catégorie parente "${parentCategoryName}" n'existe pas`
        };
      }

      parentId = parentCategory.id;
    }

    // Créer la nouvelle catégorie
    const newCategory = await prisma.categories.create({
      data: {
        name,
        parentId,
        description,
        isActive
      }
    });

    // Convertir en format compatible avec CategoryTreeItem
    const categoryTreeItem = {
      id: newCategory.id,
      name: newCategory.name,
      description: newCategory.description,
      isActive: newCategory.isActive,
      subcategories: []
    };

    // Revalider les chemins pour rafraîchir les données
    revalidatePath('/admin/categories');
    revalidatePath('/categories');
    revalidatePath(`/categories/${name}`);

    return {
      success: true,
      message: 'Catégorie créée avec succès',
      data: categoryTreeItem
    };
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    return {
      success: false,
      message: 'Une erreur est survenue lors de la création de la catégorie'
    };
  } finally {
    await prisma.$disconnect();
  }
}