'use client';

import React from 'react';
import Link from 'next/link';
import { FolderIcon, ChevronRightIcon, ChevronDownIcon } from 'lucide-react';
import { CategoryTreeItem } from '@/app/types';
import CategoryActionButtons from './CategoryActionButtons';
import CategoryEditForm from './CategoryEditForm';

interface CategoryTreeProps {
    categories: CategoryTreeItem[];
    level?: number;
    expandedCategories: { [key: string]: boolean };
    editingCategoryId: string | null;
    isReadOnly?: boolean;
    onToggleExpand: (categoryId: string) => void;
    onEdit: (categoryId: string) => void;
    onCancelEdit: () => void;
    onSaveEdit: (categoryId: string, newName: string) => void;
    onDelete: (categoryId: string) => void;
}

const ClientCategoryTree: React.FC<CategoryTreeProps> = ({
    categories,
    level = 0,
    expandedCategories,
    editingCategoryId,
    isReadOnly = false,
    onToggleExpand,
    onEdit,
    onCancelEdit,
    onSaveEdit,
    onDelete
}) => {
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

    const nameDefaultSectionForThisCategory = "classement";

    return (
        <ul className={`space-y-1 ${level > 0 ? 'ml-4' : ''}`}>
            {categories.map((category) => (
                <li key={category.id}>
                    <div className="flex items-center py-1 px-2 hover:bg-gray-100 rounded">
                        <span className="w-4 h-4 flex items-center justify-center">
                            {category.subcategories.length > 0 ? (
                                <button
                                    onClick={() => onToggleExpand(category.id)}
                                    className="focus:outline-hidden"
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
                        
                        {editingCategoryId === category.id ? (
                            <CategoryEditForm 
                                categoryId={category.id}
                                initialName={category.name}
                                onSave={onSaveEdit}
                                onCancel={onCancelEdit}
                            />
                        ) : (
                            <>
                                <Link href={`/categories/${category.name}/${nameDefaultSectionForThisCategory}`} className="text-sm hover:text-blue-500 flex-1">
                                    {category.name}
                                </Link>
                                
                                <CategoryActionButtons 
                                    categoryId={category.id}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    isReadOnly={isReadOnly}
                                />
                            </>
                        )}
                    </div>
                    {expandedCategories[category.id] && category.subcategories.length > 0 && (
                        <ClientCategoryTree 
                            categories={category.subcategories} 
                            level={level + 1}
                            expandedCategories={expandedCategories}
                            editingCategoryId={editingCategoryId}
                            isReadOnly={isReadOnly}
                            onToggleExpand={onToggleExpand}
                            onEdit={onEdit}
                            onCancelEdit={onCancelEdit}
                            onSaveEdit={onSaveEdit}
                            onDelete={onDelete}
                        />
                    )}
                </li>
            ))}
        </ul>
    );
};

export default ClientCategoryTree;