'use client';

import React, { useState, useEffect } from 'react';

interface CategoryEditFormProps {
    categoryId: string;
    initialName: string;
    onSave: (categoryId: string, newName: string) => void;
    onCancel: () => void;
}

const CategoryEditForm: React.FC<CategoryEditFormProps> = ({
    categoryId,
    initialName,
    onSave,
    onCancel
}) => {
    const [editedName, setEditedName] = useState<string>(initialName);

    // Update local state when initialName changes
    useEffect(() => {
        setEditedName(initialName);
    }, [initialName]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedName(e.target.value);
    };

    const handleSave = () => {
        if (editedName.trim()) {
            onSave(categoryId, editedName.trim());
        }
    };

    return (
        <div className="flex-1 flex">
            <input
                type="text"
                value={editedName}
                onChange={handleNameChange}
                className="text-sm border rounded px-2 py-1 flex-1"
                autoFocus
            />
            <div className="flex space-x-2 ml-2">
                <button 
                    onClick={handleSave}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                >
                    Enregistrer
                </button>
                <button 
                    onClick={onCancel}
                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs"
                >
                    Annuler
                </button>
            </div>
        </div>
    );
};

export default CategoryEditForm;