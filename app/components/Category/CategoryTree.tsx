import React from 'react';
import { getCategories, getCategoryByName } from '../../lib/categories';
import CategoryActions from './CategoryActions';
import { Category } from '@/app/types';
import { cache } from 'react';

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
  
  return (
    <CategoryActions 
      initialCategories={categories} 
      currentCategoryName={categoryName} 
    />
  );
}