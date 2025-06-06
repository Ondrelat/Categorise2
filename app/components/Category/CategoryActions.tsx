'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import ClientCategoryTree from '../../ui/ClientCategoryTree';
import { CategoryTreeItem } from '../../types';
import CreateCategoryForm from './CreateCategoryForm';
import DeleteCategoryDialog from './DeleteCategoryDialog';


interface CategoryActionsProps {
  initialCategories: CategoryTreeItem[];
  currentCategoryName?: string;
}

export default function CategoryActions({ 
  initialCategories, 
  currentCategoryName, 
}: CategoryActionsProps) {
  const [categories, setCategories] = useState<CategoryTreeItem[]>(initialCategories);
  
  // Delete state and handlers
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Edit state and handlers
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  
  // Récupération des données de session utilisateur
  const { data: session } = useSession();
  
  // Vérification si l'utilisateur est Ondrelat
  const isOndrelat = session?.user?.name === "Ondrelat" || session?.user?.email === "ondrelat@example.com";

  // Load expanded state from localStorage on component mount
  React.useEffect(() => {
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
  React.useEffect(() => {
    if (Object.keys(expandedCategories).length > 0) {
      localStorage.setItem('expandedCategories', JSON.stringify(expandedCategories));
    }
  }, [expandedCategories]);

  // Toggle category expansion
  const handleToggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Helper function to find category name by ID
  const findCategoryName = (items: CategoryTreeItem[], categoryId: string): string => {
    for (const category of items) {
      if (category.id === categoryId) return category.name;
      if (category.subcategories.length > 0) {
        const name = findCategoryName(category.subcategories, categoryId);
        if (name) return name;
      }
    }
    return '';
  };

  // Edit handlers
  const handleEdit = (categoryId: string) => {
    // Set the current category being edited
    setEditingCategoryId(categoryId);
    
    // Here you might want to pre-populate any edit form with the category name
    const categoryName = findCategoryName(categories, categoryId);
    console.log(`Editing category: ${categoryName}`);
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
  };

  const handleSaveEdit = (categoryId: string, newName: string) => {
    // Function to recursively update category name
    const updateCategoryName = (items: CategoryTreeItem[]): CategoryTreeItem[] => {
      return items.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            name: newName,
            // You might want to update the slug here as well
            slug: newName.toLowerCase().replace(/\s+/g, '-')
          };
        }
        
        if (category.subcategories.length > 0) {
          return {
            ...category,
            subcategories: updateCategoryName(category.subcategories)
          };
        }
        
        return category;
      });
    };
    
    setCategories(updateCategoryName([...categories]));
    setEditingCategoryId(null);
    
    // Here you would typically also make an API call to update the category on the server
  };

  // Delete handlers
  const handleDelete = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setIsDeleteDialogOpen(true);
  };

  // Gestionnaire pour la suppression réussie
  const handleDeleteSuccess = (categoryId: string) => {
    const removeCategory = (items: CategoryTreeItem[]): CategoryTreeItem[] => {
      return items.filter(category => {
        if (category.id === categoryId) return false;
        
        if (category.subcategories.length > 0) {
          category.subcategories = removeCategory(category.subcategories);
        }
        
        return true;
      });
    };
    
    setCategories(removeCategory([...categories]));
  };

  return (
    <div className="space-y-6">
      
      {/* Affichage de la catégorie actuelle si elle existe */}
      {currentCategoryName && (
        <div className="bg-blue-50 p-3 rounded-md mb-4">
          <p className="text-sm font-medium">
            Catégorie actuelle: <span className="text-blue-600">{currentCategoryName}</span>
          </p>
        </div>
      )}
      
      {/* Composant de création de catégorie */}
      <CreateCategoryForm
        isOndrelat={isOndrelat}
        parentCategoryName={currentCategoryName}
      />
      
      {/* Arbre des catégories */}
      <ClientCategoryTree 
        categories={categories}
        expandedCategories={expandedCategories}
        editingCategoryId={editingCategoryId}
        onToggleExpand={handleToggleExpand}
        onEdit={handleEdit}
        onCancelEdit={handleCancelEdit}
        onSaveEdit={handleSaveEdit}
        onDelete={handleDelete}
        isReadOnly={!isOndrelat}
      />

      {/* Affichage d'erreur globale */}
      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-200 mt-4">
          {errorMessage}
        </div>
      )}

      {/* Composant de dialogue de suppression */}
      <DeleteCategoryDialog
        isOpen={isDeleteDialogOpen}
        categoryId={categoryToDelete}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDeleteSuccess={handleDeleteSuccess}
        setErrorMessage={setErrorMessage}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}