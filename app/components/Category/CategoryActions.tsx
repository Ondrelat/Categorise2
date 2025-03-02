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
  currentCategoryId?: string | null;
}

export default function CategoryActions({ 
  initialCategories, 
  currentCategoryName, 
  currentCategoryId 
}: CategoryActionsProps) {
  const [categories, setCategories] = useState<CategoryTreeItem[]>(initialCategories);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const router = useRouter();
  
  // Récupération des données de session utilisateur
  const { data: session } = useSession();
  
  // Vérification si l'utilisateur est Ondrelat
  const isOndrelat = session?.user?.name === "Ondrelat" || session?.user?.email === "ondrelat@example.com";
  
  // Trouver la catégorie actuelle en fonction du name
  const findCurrentCategory = (categories: CategoryTreeItem[], name?: string): CategoryTreeItem | null => {
    if (!name) return null;
    
    for (const category of categories) {
      if (category.name === name) {
        return category;
      }
      
      const foundInChildren = findCurrentCategory(category.subcategories, name);
      if (foundInChildren) return foundInChildren;
    }
    
    return null;
  };
  
  const currentCategory = findCurrentCategory(categories, currentCategoryName);

  // Gestionnaire d'édition de catégorie
  const { handleEdit } = CategoryEditHandler({
    isOndrelat,
    onPermissionError: (message) => setErrorMessage(message)
  });

  // Fonction de suppression - vérification des permissions
  const handleDelete = (categoryId: string) => {
    if (!isOndrelat) {
      setErrorMessage("Vous n'avez pas les permissions pour supprimer les catégories");
      return;
    }
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

  // Gestionnaire pour l'ajout réussi
  const handleCategoryCreated = (newCategory: CategoryTreeItem, parentId: string | null) => {
    const addNewCategory = (items: CategoryTreeItem[], parentId: string | null): CategoryTreeItem[] => {
      if (parentId === null) {
        // Ajouter au niveau racine si aucun parent n'est spécifié
        return [...items, newCategory];
      }
      
      return items.map(category => {
        if (category.id === parentId) {
          return {
            ...category,
            subcategories: [...category.subcategories, newCategory]
          };
        }
        
        if (category.subcategories.length > 0) {
          return {
            ...category,
            subcategories: addNewCategory(category.subcategories, parentId)
          };
        }
        
        return category;
      });
    };
    
    setCategories(addNewCategory([...categories], parentId));
  };

  return (
    <div className="space-y-6">
      
      {/* Affichage de la catégorie actuelle si elle existe */}
      {currentCategory && (
        <div className="bg-blue-50 p-3 rounded-md mb-4">
          <p className="text-sm font-medium">
            Catégorie actuelle: <span className="text-blue-600">{currentCategory.name}</span>
          </p>
        </div>
      )}
      
      {/* Composant de création de catégorie */}
      <CreateCategoryForm
        isOndrelat={isOndrelat}
        currentCategoryId={currentCategoryId}
        currentCategory={currentCategory}
        onCategoryCreated={handleCategoryCreated}
      />
      
      {/* Arbre des catégories */}
      <ClientCategoryTree 
        categories={categories}
        onEdit={handleEdit}
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