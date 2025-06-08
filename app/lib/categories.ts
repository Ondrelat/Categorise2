'use server';

import { prisma } from './prisma';
import { CategoryTreeItem } from '../types';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';

export const getCategories = cache(async (): Promise<CategoryTreeItem[]> => {
  const startTime = performance.now();

  try {
    const categories = await prisma.categories.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  
    const buildCategoryTree = (categories: any[], parentId: string | null = null): CategoryTreeItem[] => {
      return categories
        .filter(cat => cat.parentId === parentId)
        .map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          isActive: cat.isActive,
          subcategories: buildCategoryTree(categories, cat.id)
        }));
    };
  
    const result = buildCategoryTree(categories);

    const endTime = performance.now();
    console.log(`Categories fetched in ${endTime - startTime}ms`);

    return result;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Error fetching categories');
  }
});

export async function getCategoryByName(name: string) {
  const startTime = performance.now();
  const decodedName = decodeURIComponent(name);
  console.log("params décodé:", decodedName);

  try {
    const category = await prisma.categories.findFirst({
      where: {
        name: decodedName,
      },
    });

    const endTime = performance.now();
    console.log(`Temps d'exécution : ${endTime - startTime} ms pour fetch une categorie`);

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

    // Vérifier s'il y a des produits associés (ajustez selon votre modèle)
    // Si vous avez une relation entre produits et catégories
    const productsCount = await prisma.article.count({
      where: {
        categoryId
      }
    });

    if (productsCount > 0) {
      return {
        success: false,
        message: 'Impossible de supprimer une catégorie qui contient des produits'
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
  console.log('parentCategoryName:', parentCategoryName);
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