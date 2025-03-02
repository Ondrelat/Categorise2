import React from 'react';
import { getCategories, getCategoryByName } from '../../lib/categories';
import CategoryActions from './CategoryActions';
import { Category } from '@/app/types'; 

interface CategoryTreeProps {
    category: Category;
}

export default async function CategoryTree({ category }: CategoryTreeProps) {
    
    // Récupérer toutes les catégories
    const categories = await getCategories();
    
    return (
        <CategoryActions 
            initialCategories={categories} 
            currentCategoryName={category?.name || ""} 
            currentCategoryId={category?.id || ""}
        />
    );
}