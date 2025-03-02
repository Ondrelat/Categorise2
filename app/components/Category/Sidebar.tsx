// components/Sidebar.tsx
'use cache'
import React from 'react';
import CategoryTree from './CategoryTree';
import { Category } from '@/app/types'; 

interface SideBarProps {
    category?: Category;
  }
  

  export default function SideBar({ category }: SideBarProps) {
    return (
        <div className="w-64 h-screen bg-gray-50 p-4 border-r">
            <h2 className="text-xl font-semibold mb-4">Catégories</h2>
            <CategoryTree category={category} />
        </div>
    );
};