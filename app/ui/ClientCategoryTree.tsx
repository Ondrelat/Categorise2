'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FolderIcon, ChevronRightIcon, ChevronDownIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { CategoryTreeItem } from '../types';

interface CategoryTreeProps {
    categories: CategoryTreeItem[];
    level?: number;
    onEdit?: (categoryId: string) => void;
    onDelete?: (categoryId: string) => void;
    isReadOnly?: boolean; // Nouvelle propriété pour le mode lecture seule
}

const ClientCategoryTree: React.FC<CategoryTreeProps> = ({
    categories,
    level = 0,
    onEdit = (id) => console.log(`Edit category: ${id}`),
    onDelete = (id) => console.log(`Delete category: ${id}`),
    isReadOnly = false // Par défaut, les actions sont disponibles
}) => {
    const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

    const toggleExpand = (categoryId: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const handleEdit = (e: React.MouseEvent, categoryId: string) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit(categoryId);
    };

    const handleDelete = (e: React.MouseEvent, categoryId: string) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(categoryId);
    };

    return (
        <ul className={`space-y-1 ${level > 0 ? 'ml-4' : ''}`}>
            {categories.map((category) => (
                <li key={category.id}>
                    <div className="flex items-center py-1 px-2 hover:bg-gray-100 rounded">
                        <span className="w-4 h-4 flex items-center justify-center">
                            {category.subcategories.length > 0 ? (
                                <button
                                    onClick={() => toggleExpand(category.id)}
                                    className="focus:outline-none"
                                >
                                    {expandedCategories[category.id] ? (
                                        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                                    ) : (
                                        <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                                    )}
                                </button>
                            ) : (
                                <span className="w-4 h-4" />
                            )}
                        </span>
                        <FolderIcon className="w-4 h-4 text-blue-500 mr-2" />
                        <Link href={`/categories/${category.name}`} className="text-sm hover:text-blue-500 flex-1">
                            {category.name}
                        </Link>
                        
                        {/* N'afficher les boutons d'action que si !isReadOnly */}
                        {!isReadOnly && (
                            <div className="flex space-x-2">
                                <button 
                                    onClick={(e) => handleEdit(e, category.id)}
                                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200"
                                    title="Éditer"
                                >
                                    <PencilIcon className="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    onClick={(e) => handleDelete(e, category.id)} 
                                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200"
                                    title="Supprimer"
                                >
                                    <TrashIcon className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        )}
                    </div>
                    {expandedCategories[category.id] && category.subcategories.length > 0 && (
                        <ClientCategoryTree 
                            categories={category.subcategories} 
                            level={level + 1} 
                            onEdit={onEdit}
                            onDelete={onDelete}
                            isReadOnly={isReadOnly} // Propager le mode lecture seule aux enfants
                        />
                    )}
                </li>
            ))}
        </ul>
    );
};

export default ClientCategoryTree;