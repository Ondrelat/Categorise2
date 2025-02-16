'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FolderIcon, ChevronRightIcon, ChevronDownIcon } from 'lucide-react';
import { CategoryTreeItem } from '../types';

interface CategoryTreeProps {
    categories: CategoryTreeItem[];
    level?: number;
}

const ClientCategoryTree: React.FC<CategoryTreeProps> = ({ categories, level = 0 }) => {
    const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

    const toggleExpand = (categoryId: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    return (
        <ul className={`space-y-1 ${level > 0 ? 'ml-4' : ''}`}>
            {categories.map((category) => (
                <li key={category.id}>
                    <div className="flex items-center space-x-1 py-1 px-2 hover:bg-gray-100 rounded">
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
                        <FolderIcon className="w-4 h-4 text-blue-500" />
                        <Link href={`/categories/${category.slug}`} className="text-sm hover:text-blue-500">
                            {category.name}
                        </Link>
                    </div>
                    {expandedCategories[category.id] && category.subcategories.length > 0 && (
                        <ClientCategoryTree categories={category.subcategories} level={level + 1} />
                    )}
                </li>
            ))}
        </ul>
    );
};

export default ClientCategoryTree;