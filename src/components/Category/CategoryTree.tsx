import React from 'react';
import { getCategories } from '@/lib/categories';
import CategoryActions from './CategoryActions';
import { cache } from 'react';
import { auth } from '@/auth';

// Utiliser la fonction cache de React pour mémoriser l'appel à getCategories
const getCachedCategories = cache(async () => {
  return await getCategories();
});

interface CategoryTreeProps {
  categoryName?: string;
}

export default async function CategoryTree({ categoryName }: CategoryTreeProps) {
  // Utiliser la version mise en cache de getCategories
  const categories = await getCachedCategories();
  const session = await auth(); // ou getServerSession()

  return (
    <CategoryActions
      session={session}
      initialCategories={categories}
      currentCategoryName={categoryName}
    />
  );
}