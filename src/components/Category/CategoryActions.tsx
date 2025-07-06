'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ClientCategoryTree from '@/components/ui/ClientCategoryTree';
import { CategoryTreeItem } from '@/app/types';
import CreateCategoryForm from './CreateCategoryForm';
import DeleteCategoryDialog from './DeleteCategoryDialog';
import { Session } from 'next-auth';

// --- FONCTION UTILITAIRE ---
// Détermine l'état initial des catégories dépliées basé sur le pathname
const getInitialExpandedState = (
  categories: CategoryTreeItem[],
  pathname: string
): { [key: string]: boolean } => {
  // Extraire le slug de la catégorie depuis le pathname
  const pathParts = pathname.split('/');
  const categorySlug = pathParts[2]; // /categories/[slug]/...

  if (!categorySlug) {
    return {};
  }

  const path = new Set<string>();

  // Fonction récursive pour trouver le chemin vers le slug
  const findPath = (currentCategories: CategoryTreeItem[]): boolean => {
    for (const category of currentCategories) {
      if (category.slug === categorySlug) {
        return true; // Catégorie trouvée, on remonte.
      }
      if (category.subcategories.length > 0) {
        // Si trouvé dans un enfant, on ajoute le parent actuel au chemin.
        if (findPath(category.subcategories)) {
          path.add(category.id);
          return true;
        }
      }
    }
    return false;
  };

  findPath(categories);

  const initialState: { [key: string]: boolean } = {};
  path.forEach((id: string) => {
    initialState[id] = true;
  });
  return initialState;
};

// --- INTERFACES ---
interface CategoryActionsProps {
  initialCategories: CategoryTreeItem[];
  session: Session | null;
}

// --- COMPOSANT ---
export default function CategoryActions({
  initialCategories,
  session
}: CategoryActionsProps) {
  const pathname = usePathname();

  // L'état des catégories (pour les mises à jour comme la suppression/modification)
  const [categories, setCategories] = useState<CategoryTreeItem[]>(initialCategories);

  // L'état des catégories dépliées, initialisé avec notre nouvelle logique.
  const [expandedCategories, setExpandedCategories] = useState(() =>
    getInitialExpandedState(initialCategories, pathname)
  );

  // Autres états pour l'édition et la suppression
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Vérification des droits de l'utilisateur
  const isOndrelat = session?.user?.name === "Ondrelat" || session?.user?.email === "ondrelat@example.com";

  // Extraire le slug de la catégorie actuelle depuis le pathname
  const getCurrentCategorySlug = (): string | undefined => {
    const pathParts = pathname.split('/');
    return pathParts[2]; // /categories/[slug]/...
  };

  const currentCategorySlug = getCurrentCategorySlug();

  // Mettre à jour l'état étendu quand le pathname change
  useEffect(() => {
    const newExpandedState = getInitialExpandedState(categories, pathname);
    setExpandedCategories(newExpandedState);
  }, [pathname, categories]);

  // --- GESTIONNAIRES D'ÉVÉNEMENTS ---

  // Déplie/replie une catégorie
  const handleToggleExpand = (categoryId: string): void => {
    setExpandedCategories((prev: { [key: string]: boolean }) => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Helper function to find category name by ID
  const findCategorySlug = (items: CategoryTreeItem[], categoryId: string): string => {
    for (const category of items) {
      if (category.id === categoryId) return category.slug;
      if (category.subcategories.length > 0) {
        const name = findCategorySlug(category.subcategories, categoryId);
        if (name) return name;
      }
    }
    return '';
  };

  // Edit handlers
  const handleEdit = (categoryId: string): void => {
    setEditingCategoryId(categoryId);
    const categorySlug = findCategorySlug(categories, categoryId);
    console.log(`Editing category: ${categorySlug}`);
  };

  const handleCancelEdit = (): void => {
    setEditingCategoryId(null);
  };

  const handleSaveEdit = (categoryId: string, newName: string): void => {
    const updateCategorySlug = (items: CategoryTreeItem[]): CategoryTreeItem[] => {
      return items.map((category: CategoryTreeItem) => {
        if (category.id === categoryId) {
          return { ...category, name: newName, slug: newName.toLowerCase().replace(/\s+/g, '-') };
        }
        if (category.subcategories.length > 0) {
          return { ...category, subcategories: updateCategorySlug(category.subcategories) };
        }
        return category;
      });
    };
    setCategories(updateCategorySlug([...categories]));
    setEditingCategoryId(null);
  };

  // Delete handlers
  const handleDelete = (categoryId: string): void => {
    setCategoryToDelete(categoryId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = (categoryId: string): void => {
    const removeCategory = (items: CategoryTreeItem[]): CategoryTreeItem[] => {
      return items.filter((category: CategoryTreeItem) => {
        if (category.id === categoryId) return false;
        if (category.subcategories.length > 0) {
          category.subcategories = removeCategory(category.subcategories);
        }
        return true;
      });
    };
    setCategories(removeCategory([...categories]));
  };

  // --- Rendu du composant ---
  return (
    <div className="space-y-6">
      {/* Affichage de la catégorie actuelle si elle existe */}
      {currentCategorySlug && (
        <div className="bg-blue-50 p-3 rounded-md mb-4">
          <p className="text-sm font-medium">
            Catégorie actuelle: <span className="text-blue-600">{currentCategorySlug}</span>
          </p>
        </div>
      )}

      {/* Composant de création de catégorie */}
      <CreateCategoryForm
        isOndrelat={isOndrelat}
        parentcategorySlug={currentCategorySlug}
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