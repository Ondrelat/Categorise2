'use client';

import React from 'react';
import { PencilIcon, TrashIcon } from 'lucide-react';

interface CategoryActionButtonsProps {
    categoryId: string;
    onEdit: (e: React.MouseEvent, categoryId: string) => void;
    onDelete: (e: React.MouseEvent, categoryId: string) => void;
    isReadOnly?: boolean;
}

const CategoryActionButtons: React.FC<CategoryActionButtonsProps> = ({
    categoryId,
    onEdit,
    onDelete,
    isReadOnly = false
}) => {
    if (isReadOnly) {
        return null;
    }

    return (
        <div className="flex space-x-2">
            <button 
                onClick={(e) => onEdit(e, categoryId)}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200"
                title="Éditer"
            >
                <PencilIcon className="w-4 h-4 text-gray-600" />
            </button>
            <button 
                onClick={(e) => onDelete(e, categoryId)} 
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200"
                title="Supprimer"
            >
                <TrashIcon className="w-4 h-4 text-red-500" />
            </button>
        </div>
    );
};

export default CategoryActionButtons;