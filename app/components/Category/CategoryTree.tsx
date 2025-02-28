import React from 'react';
import { getCategories, getCategoryByName } from '../../lib/categories';
import CategoryActions from './CategoryActions';
import { useParams } from 'next/navigation';

interface CategoryTreeProps {
    initialCategoryName?: string; // name initial optionnel
}

export default async function CategoryTree({ initialCategoryName }: CategoryTreeProps) {

    // Récupérer la catégorie si un name est spécifié, sinon null
    const category = initialCategoryName ? await getCategoryByName(initialCategoryName) : null;
    
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