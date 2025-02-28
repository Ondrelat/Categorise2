// components/Sidebar.tsx
import React from 'react';
import CategoryTree from './CategoryTree';

interface SideBarProps {
    initialSlug?: string;
  }
  

export default function SideBar({ initialSlug }: SideBarProps) {
    console.log("categoriesAvantTree")
    return (
        <div className="w-64 h-screen bg-gray-50 p-4 border-r">
            <h2 className="text-xl font-semibold mb-4">Catégories</h2>
            <CategoryTree initialSlug={initialSlug} />
        </div>
    );
};