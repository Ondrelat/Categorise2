'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ClientCategoryTree from '../../ui/ClientCategoryTree';
import { CategoryTreeItem } from '../../types';
import CreateCategoryForm from './CreateCategoryForm';
import DeleteCategoryDialog from './DeleteCategoryDialog';
import CategoryEditHandler from './CategoryEditHandler';

interface CategoryActionsProps {
  initialCategories: CategoryTreeItem[];
  currentCategoryName?: string;
}

export default function CategoryActions({ 
  initialCategories, 
  currentCategoryName, 
}: CategoryActionsProps) {
  const [categories, setCategories] = useState<CategoryTreeItem[]>(initialCategories);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Récupération des données de session utilisateur
  const { data: session } = useSession();
  
  // Vérification si l'utilisateur est Ondrelat
  const isOndrelat = session?.user?.name === "Ondrelat" || session?.user?.email === "ondrelat@example.com";

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