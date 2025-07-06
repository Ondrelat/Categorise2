import React from 'react';
import { getCategories } from '@/lib/categories';
import CategoryActions from './CategoryActions';
import { cache } from 'react';
import { Session } from 'next-auth';

// Utiliser la fonction cache de React pour mémoriser l'appel à getCategories
const getCachedCategories = cache(async () => {
    return await getCategories();
});

interface SideBarProps {
    categoryName?: string;
    session: Session | null;
}

export default async function SideBar({ categoryName, session }: SideBarProps) {
    // Récupérer les catégories (mise en cache)
    const categories = await getCachedCategories();

    return (
        <div className="w-64 h-screen bg-gray-50 p-4 border-r">
            <h2 className="text-xl font-semibold mb-4">Catégories</h2>
            <CategoryActions
                session={session}
                initialCategories={categories}
                currentCategoryName={categoryName}
            />
        </div>
    );
}