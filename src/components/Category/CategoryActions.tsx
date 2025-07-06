'use client';

import React, { useState } from 'react';
import ClientCategoryTree from '@/components/ui/ClientCategoryTree';
import { CategoryTreeItem } from '@/app/types';
import CreateCategoryForm from './CreateCategoryForm';
import DeleteCategoryDialog from './DeleteCategoryDialog';
import { Session } from 'next-auth'; // pour typer la session


interface CategoryActionsProps {
  initialCategories: CategoryTreeItem[];
  currentcategorySlug?: string;
  session: Session | null; // 🔁 reçoit directement la session
}

export default function CategoryActions({
  initialCategories,
  currentcategorySlug,
  session
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
  const findcategorySlug = (items: CategoryTreeItem[], categoryId: string): string => {
    for (const category of items) {
      if (category.id === categoryId) return category.slug;
      if (category.subcategories.length > 0) {
        const name = findcategorySlug(category.subcategories, categoryId);
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
    const categorySlug = findcategorySlug(categories, categoryId);
    console.log(`Editing category: ${categorySlug}`);
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
  };

  const handleSaveEdit = (categoryId: string, newName: string) => {
    // Function to recursively update category name
    const updatecategorySlug = (items: CategoryTreeItem[]): CategoryTreeItem[] => {
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
            subcategories: updatecategorySlug(category.subcategories)
          };
        }

        return category;
      });
    };

    setCategories(updatecategorySlug([...categories]));
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
      {currentcategorySlug && (
        <div className="bg-blue-50 p-3 rounded-md mb-4">
          <p className="text-sm font-medium">
            Catégorie actuelle: <span className="text-blue-600">{currentcategorySlug}</span>
          </p>
        </div>
      )}

      {/* Composant de création de catégorie */}
      <CreateCategoryForm
        isOndrelat={isOndrelat}
        parentcategorySlug={currentcategorySlug}
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