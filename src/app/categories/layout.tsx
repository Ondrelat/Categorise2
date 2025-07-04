import React, { Suspense } from 'react';
import SideBarNavigationCategorie from '@/components/Category/Sidebar';

async function SidebarLoader() {
    // Vous pouvez fetch des données globales ici si nécessaire
    return <SideBarNavigationCategorie />;
}

export default async function CategoriesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-1 h-full mt-4 justify-center">
            <div className="relative">
                {/* Sidebar fixe qui ne dépend pas des paramètres de route */}
                <div className="absolute -translate-x-full">
                    <Suspense fallback={<div className="w-64 h-full bg-gray-100 animate-pulse">Chargement sidebar...</div>}>
                        <SidebarLoader />
                    </Suspense>
                </div>

                {/* Contenu qui changera selon la route */}
                {children}
            </div>
        </div>
    );
}