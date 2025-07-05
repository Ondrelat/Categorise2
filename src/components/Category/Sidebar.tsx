// components/Sidebar.tsx
import React from 'react';
import CategoryTree from './CategoryTree';

interface SideBarProps {
    categoryName?: string;
}


export default function SideBar({ categoryName }: SideBarProps) {

    return (
        <div className="w-64 h-screen bg-gray-50 p-4 border-r">
            <h2 className="text-xl font-semibold mb-4">Catégories</h2>
            <CategoryTree categoryName={categoryName} />
        </div>
    );
};