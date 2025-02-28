'use server';

import { prisma } from './prisma';
import { CategoryTreeItem } from '../types';
import { revalidatePath } from 'next/cache';

export async function getCategories(): Promise<CategoryTreeItem[]> {
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
          slug: cat.slug,
          isActive: cat.isActive,
          subcategories: buildCategoryTree(categories, cat.id)
        }));
    };
  

    const result = buildCategoryTree(categories);

    const endTime = performance.now();

    return result;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Error fetching categories');
  } finally {
    await prisma.$disconnect();
  }
}

export async function getCategoryBySlug(slug: string) {
  const startTime = performance.now();

  try {
    const category = await prisma.categories.findUnique({
      where: {
        slug: slug,
      },
    });

    const endTime = performance.now();
    console.log(`Temps d'exécution : ${endTime - startTime} ms`);

    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new Error('Error fetching category');
  } finally {
    await prisma.$disconnect();
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
  data: { name: string; slug: string; description?: string; isActive?: boolean }
) {
  try {
    const { name, slug } = data;

    // Validation des données
    if (!name || !slug) {
      return {
        success: false,
        message: 'Le nom et le slug sont requis'
      };
    }

    // Vérifier que le slug est unique
    const existingCategory = await prisma.categories.findFirst({
      where: {
        slug,
        id: {
          not: categoryId
        }
      }
    });

    if (existingCategory) {
      return {
        success: false,
        message: 'Une catégorie avec ce slug existe déjà'
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
  slug: string; 
  parentId: string | null;
  description?: string;
  isActive?: boolean;
}) {
  'use server';
  
  const { name, slug, parentId, description = '', isActive = true } = data;

  try {
    // Validation des données
    if (!name || !slug) {
      return {
        success: false,
        message: 'Le nom et le slug sont requis'
      };
    }

    // Vérifier que le slug est unique
    const existingCategory = await prisma.categories.findUnique({
      where: {
        slug: slug
      }
    });

    if (existingCategory) {
      return {
        success: false,
        message: 'Une catégorie avec ce slug existe déjà'
      };
    }

    // Créer la nouvelle catégorie
    const newCategory = await prisma.categories.create({
      data: {
        name,
        slug,
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
      slug: newCategory.slug,
      isActive: newCategory.isActive,
      subcategories: []
    };

    // Revalider les chemins pour rafraîchir les données
    revalidatePath('/admin/categories');
    revalidatePath('/categories');
    revalidatePath(`/categories/${slug}`);

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