import React from 'react';
import { getCategories, getCategoryByName } from '../../lib/categories';
import CategoryActions from './CategoryActions';
import { useParams } from 'next/navigation';

interface CategoryTreeProps {
    initialName?: string; // name initial optionnel
}

export default async function CategoryTree({ initialName }: CategoryTreeProps) {

    // Récupérer la catégorie si un name est spécifié, sinon null
    const category = initialName ? await getCategoryByName(initialName) : null;
    
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