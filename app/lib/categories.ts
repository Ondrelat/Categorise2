'use server';

import { PrismaClient } from '@prisma/client';
import { CategoryTreeItem } from '../types';

const prisma = new PrismaClient();

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