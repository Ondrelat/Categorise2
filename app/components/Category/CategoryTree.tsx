import React from 'react';
import { getCategories, getCategoryBySlug } from '../../lib/categories';
import CategoryActions from './CategoryActions';
import { useParams } from 'next/navigation';

interface CategoryTreeProps {
  initialSlug?: string; // Slug initial optionnel
}

export default async function CategoryTree({ initialSlug }: CategoryTreeProps) {

    // Récupérer la catégorie si un slug est spécifié, sinon null
    const category = initialSlug ? await getCategoryBySlug(initialSlug) : null;
    
    // Récupérer toutes les catégories
    const categories = await getCategories();
    
    return (
        <CategoryActions 
            initialCategories={categories} 
            currentCategorySlug={category?.slug || ""} 
            currentCategoryId={category?.id || ""}
        />
    );
}