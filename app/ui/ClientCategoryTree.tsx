'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderIcon, ChevronRightIcon, ChevronDownIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { CategoryTreeItem } from '../types';

interface CategoryTreeProps {
    categories: CategoryTreeItem[];
    level?: number;
    onEdit?: (categoryId: string) => void;
    onDelete?: (categoryId: string) => void;
    isReadOnly?: boolean;
}

const ClientCategoryTree: React.FC<CategoryTreeProps> = ({
    categories,
    level = 0,
    onEdit = (id) => console.log(`Edit category: ${id}`),
    onDelete = (id) => console.log(`Delete category: ${id}`),
    isReadOnly = false
}) => {
    const pathname = usePathname();
    const decodedPathname = pathname ? decodeURIComponent(pathname) : '';
    const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
    
    // Load expanded state from localStorage on component mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('expandedCategories');
            if (saved) {
                setExpandedCategories(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Failed to load expanded categories from localStorage:', error);
        }
    }, []);
    
    // Save expanded state to localStorage whenever it changes
    useEffect(() => {
        if (Object.keys(expandedCategories).length > 0) {
            localStorage.setItem('expandedCategories', JSON.stringify(expandedCategories));
        }
    }, [expandedCategories]);

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
                    <div className={`flex items-center py-1 px-2 hover:bg-gray-100 rounded ${decodedPathname === `/categories/${category.name}` ? 'bg-blue-100' : ''}`}>
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
                        <Link 
                            href={`/categories/${category.name}`} 
                            className={`text-sm hover:text-blue-500 flex-1 ${decodedPathname === `/categories/${category.name}` ? 'font-medium text-blue-600' : ''}`}
                        >
                            {category.name}
                        </Link>
                        
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
                            isReadOnly={isReadOnly}
                        />
                    )}
                </li>
            ))}
        </ul>
    );
};

export default ClientCategoryTree;