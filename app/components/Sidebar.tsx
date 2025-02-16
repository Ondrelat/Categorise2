// components/Sidebar.tsx
import React from 'react';
import CategoryTree from './CategoryTree';

const Sidebar: React.FC = () => {
    console.log("categoriesAvantTree")
    return (
        <div className="w-64 h-screen bg-gray-50 p-4 border-r">
            <h2 className="text-xl font-semibold mb-4">Catégories</h2>
            <CategoryTree />
        </div>
    );
};

export default Sidebar;