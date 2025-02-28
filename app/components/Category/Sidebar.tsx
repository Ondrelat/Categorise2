// components/Sidebar.tsx
import React from 'react';
import CategoryTree from './CategoryTree';

interface SideBarProps {
    initialName?: string;
  }
  

export default function SideBar({ initialName }: SideBarProps) {
    console.log("categoriesAvantTree")
    return (
        <div className="w-64 h-screen bg-gray-50 p-4 border-r">
            <h2 className="text-xl font-semibold mb-4">Catégories</h2>
            <CategoryTree initialName={initialName} />
        </div>
    );
};