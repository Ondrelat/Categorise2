import React from 'react';
import { getCategories } from '@/lib/categories';
import CategoryActions from './CategoryActions';
import { cache } from 'react';
import { Session } from 'next-auth';

// Votre fonction de mise en cache est parfaite, on la garde.
const getCachedCategories = cache(async () => {
    return await getCategories();
});

interface SideBarProps {
    session: Session | null;
}

export default async function SideBar({ session }: SideBarProps) {
    // 1. Récupérer les catégories côté serveur
    const categories = await getCachedCategories();

    return (
        // 2. Le conteneur principal reste un composant serveur
        <div className="w-64 h-full bg-gray-50 p-4 border-r overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Catégories</h2>

            {/* 3. On délègue toute la partie interactive au Client Component */}
            <CategoryActions
                session={session}
                initialCategories={categories}
            />
        </div>
    );
}