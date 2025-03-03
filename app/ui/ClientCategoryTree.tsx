'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FolderIcon, ChevronRightIcon, ChevronDownIcon, PencilIcon, TrashIcon, CheckIcon, XIcon } from 'lucide-react';
import { CategoryTreeItem } from '../types';
import { updateCategory, deleteCategory } from '../lib/categories';

interface CategoryTreeProps {
    categories: CategoryTreeItem[];
    level?: number;
    isReadOnly?: boolean;
}

const ClientCategoryTree: React.FC<CategoryTreeProps> = ({
    categories,
    level = 0,
    isReadOnly = false
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const decodedPathname = pathname ? decodeURIComponent(pathname) : '';
    const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
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

    // Focus input when editing starts
    useEffect(() => {
        if (editingCategory && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingCategory]);

    const toggleExpand = useCallback((categoryId: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    }, []);

    const handleEdit = useCallback((e: React.MouseEvent, categoryId: string, categoryName: string) => {
        if (isLoading) return;
        
        e.preventDefault();
        e.stopPropagation();
        setEditingCategory(categoryId);
        setEditValue(categoryName);
        setError(null);
    }, [isLoading]);

    const handleDelete = useCallback(async (e: React.MouseEvent, categoryId: string) => {
        if (isLoading) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await deleteCategory(categoryId);
            
            if (result.success) {
                router.refresh();
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError("Une erreur est survenue lors de la suppression de la catégorie");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, router]);

    const handleSaveEdit = useCallback(async (e: React.MouseEvent) => {
        if (!editingCategory) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const trimmedValue = editValue.trim();
        
        if (!trimmedValue) {
            setError("Le nom de la catégorie ne peut pas être vide");
            return;
        }
        
        setIsLoading(true);
        
        try {
            const result = await updateCategory(editingCategory, { name: trimmedValue });
            
            if (result.success) {
                setEditingCategory(null);
                router.refresh();
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError("Une erreur est survenue lors de la mise à jour de la catégorie");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [editingCategory, editValue, router]);

    const handleCancelEdit = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        setEditingCategory(null);
        setError(null);
    }, []);

    // Garantir que nous n'entrons pas dans un état où isLoading reste bloqué à true
    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 5000); // 5 secondes max pour toute opération
            
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    return (
        <div>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                    {error}
                    <button 
                        className="float-right font-bold" 
                        onClick={() => setError(null)}
                        type="button"
                    >
                        ×
                    </button>
                </div>
            )}
            
            {isLoading && (
                <div className="flex items-center justify-center p-2 mb-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-xs text-gray-600">Chargement...</span>
                </div>
            )}
            
            <ul className={`space-y-1 ${level > 0 ? 'ml-4' : ''}`}>
                {categories.map((category) => (
                    <li key={category.id}>
                        <div className={`flex items-center py-1 px-2 hover:bg-gray-100 rounded ${decodedPathname === `/categories/${category.name}` ? 'bg-blue-100' : ''}`}>
                            <span className="w-4 h-4 flex items-center justify-center">
                                {category.subcategories.length > 0 ? (
                                    <button
                                        onClick={() => toggleExpand(category.id)}
                                        className="focus:outline-none"
                                        type="button"
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
                            
                            {editingCategory === category.id ? (
                                <div className="flex items-center flex-1">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                                        disabled={isLoading}
                                        // Pas de gestion d'événement keyDown pour éviter la validation par Entrée
                                    />
                                    <div className="flex ml-2">
                                        <button 
                                            onClick={handleSaveEdit}
                                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-green-100 disabled:opacity-50"
                                            title="Enregistrer"
                                            disabled={isLoading}
                                            type="button"
                                        >
                                            <CheckIcon className="w-4 h-4 text-green-600" />
                                        </button>
                                        <button 
                                            onClick={handleCancelEdit}
                                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 disabled:opacity-50"
                                            title="Annuler"
                                            disabled={isLoading}
                                            type="button"
                                        >
                                            <XIcon className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Link 
                                        href={`/categories/${category.name}`} 
                                        className={`text-sm hover:text-blue-500 flex-1 ${decodedPathname === `/categories/${category.name}` ? 'font-medium text-blue-600' : ''}`}
                                    >
                                        {category.name}
                                    </Link>
                                    
                                    {!isReadOnly && (
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={(e) => handleEdit(e, category.id, category.name)}
                                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 disabled:opacity-50"
                                                title="Éditer"
                                                disabled={isLoading}
                                                type="button"
                                            >
                                                <PencilIcon className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button 
                                                onClick={(e) => handleDelete(e, category.id)} 
                                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 disabled:opacity-50"
                                                title="Supprimer"
                                                disabled={isLoading}
                                                type="button"
                                            >
                                                <TrashIcon className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        {expandedCategories[category.id] && category.subcategories.length > 0 && (
                            <ClientCategoryTree 
                                categories={category.subcategories} 
                                level={level + 1} 
                                isReadOnly={isReadOnly || isLoading}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClientCategoryTree;