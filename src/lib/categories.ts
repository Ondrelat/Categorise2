'use server';

import prisma from './db/db';

import { unstable_cache, revalidatePath } from 'next/cache';
import { Category, CategoryTreeItem } from '@/app/types';
import { slugify } from '@/utils/slugify';

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
      slug,
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
      c.slug, -- <- ICI : virgule ajoutée
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
    slug,
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
      slug: cat.slug ?? "", // Assurez-vous que slug est toujours défini
      imageUrl: cat.imageUrl ?? null, // Assurez-vous que imageUrl est toujours
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
export const getCategoryBySlug = unstable_cache(
  async (slug: string): Promise<Category | null> => {
    const startTime = performance.now();

    try {
      const category = await prisma.categories.findUnique({
        where: {
          slug: slug,
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
      select: { slug: true },
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


export async function createCategory(data: {
  name: string;
  parentcategorySlug?: string | null;
  description?: string;
  isActive?: boolean;
}) {
  'use server';

  const { name, parentcategorySlug = null, description = '', isActive = true } = data;

  try {
    if (!name) {
      return {
        success: false,
        message: 'Le nom est requis'
      };
    }

    const slug = slugify(name);

    // Vérifier unicité du name
    const existingCategory = await prisma.categories.findFirst({
      where: { name }
    });
    if (existingCategory) {
      return {
        success: false,
        message: 'Une catégorie avec ce nom existe déjà'
      };
    }

    // Vérifier unicité du slug
    const existingSlug = await prisma.categories.findFirst({
      where: { slug }
    });
    if (existingSlug) {
      return {
        success: false,
        message: 'Une catégorie avec ce slug existe déjà'
      };
    }

    // Chercher l'ID de la catégorie parente
    let parentId = null;
    if (parentcategorySlug) {
      const parentCategory = await prisma.categories.findFirst({
        where: { name: parentcategorySlug }
      });

      if (!parentCategory) {
        return {
          success: false,
          message: `La catégorie parente "${parentcategorySlug}" n'existe pas`
        };
      }

      parentId = parentCategory.id;
    }

    const newCategory = await prisma.categories.create({
      data: {
        name,
        slug,
        parentId,
        description,
        isActive
      }
    });

    revalidatePath('/admin/categories');
    revalidatePath('/categories');
    revalidatePath(`/categories/${slug}`);

    return {
      success: true,
      message: 'Catégorie créée avec succès',
      data: {
        id: newCategory.id,
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description,
        isActive: newCategory.isActive,
        subcategories: []
      }
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

export async function updateCategory(
  categoryId: string,
  data: { name: string; description?: string; isActive?: boolean }
) {
  try {
    const { name } = data;

    if (!name) {
      return {
        success: false,
        message: 'Le nom est requis'
      };
    }

    const slug = slugify(name);

    // Vérifier que le name est unique (hors catégorie actuelle)
    const existingCategory = await prisma.categories.findFirst({
      where: {
        name,
        id: { not: categoryId }
      }
    });
    if (existingCategory) {
      return {
        success: false,
        message: 'Une catégorie avec ce nom existe déjà'
      };
    }

    // Vérifier que le slug est unique (hors catégorie actuelle)
    const existingSlug = await prisma.categories.findFirst({
      where: {
        slug,
        id: { not: categoryId }
      }
    });
    if (existingSlug) {
      return {
        success: false,
        message: 'Une catégorie avec ce slug existe déjà'
      };
    }

    const updatedCategory = await prisma.categories.update({
      where: {
        id: categoryId
      },
      data: {
        ...data,
        slug
      }
    });

    revalidatePath('/admin/categories');
    revalidatePath('/categories');
    revalidatePath(`/categories/${slug}`);

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

