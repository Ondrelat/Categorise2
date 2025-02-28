
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ClientCategoryTree from '../../ui/ClientCategoryTree';
import { CategoryTreeItem } from '../../types';
import { deleteCategory, createCategory } from '../../lib/categories';
import { useSession } from 'next-auth/react'; // Importation de useSession pour vérifier l'utilisateur

interface CategoryActionsProps {
  initialCategories: CategoryTreeItem[];
  currentCategoryName?: string;
  currentCategoryId?: string | null;
}

interface CreateCategoryResponse {
  success: boolean;
  message: string;
  data?: CategoryTreeItem;
}

export default function CategoryActions({ initialCategories, currentCategoryName, currentCategoryId }: CategoryActionsProps) {
  const [categories, setCategories] = useState<CategoryTreeItem[]>(initialCategories);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // États pour le formulaire d'ajout
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addCategoryError, setAddCategoryError] = useState<string | null>(null);
  const [addingCategoryLoading, setAddingCategoryLoading] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  
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

  // Fonction d'édition - vérification des permissions
  const handleEdit = (categoryId: string) => {
    if (!isOndrelat) {
      setErrorMessage("Vous n'avez pas les permissions pour modifier les catégories");
      return;
    }
    router.push(`/admin/categories/edit/${categoryId}`);
  };

  // Fonction de suppression - vérification des permissions
  const handleDelete = (categoryId: string) => {
    if (!isOndrelat) {
      setErrorMessage("Vous n'avez pas les permissions pour supprimer les catégories");
      return;
    }
    setCategoryToDelete(categoryId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete || !isOndrelat) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const result = await deleteCategory(categoryToDelete);
      
      if (result.success) {
        const removeCategory = (items: CategoryTreeItem[]): CategoryTreeItem[] => {
          return items.filter(category => {
            if (category.id === categoryToDelete) return false;
            
            if (category.subcategories.length > 0) {
              category.subcategories = removeCategory(category.subcategories);
            }
            
            return true;
          });
        };
        
        setCategories(removeCategory([...categories]));
        setIsDeleteDialogOpen(false);
        router.refresh();
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setErrorMessage('Une erreur inattendue est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour créer une nouvelle catégorie
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification des permissions
    if (!isOndrelat) {
      setAddCategoryError("Vous n'avez pas les permissions pour créer des catégories");
      return;
    }
    
    if (!newCategoryName.trim()) {
      setAddCategoryError('Le nom et le name sont requis');
      return;
    }
    
    setAddingCategoryLoading(true);
    setAddCategoryError(null);
    
    try {
      const result = await createCategory({
        name: newCategoryName.trim(),
        parentId: currentCategoryId || null
      }) as CreateCategoryResponse;
      
      if (result.success && result.data) {
        // Ajouter la nouvelle catégorie à l'état local
        const addNewCategory = (items: CategoryTreeItem[], parentId: string | null): CategoryTreeItem[] => {
          if (parentId === null) {
            // Ajouter au niveau racine si aucun parent n'est spécifié
            return [...items, result.data as CategoryTreeItem];
          }
          
          return items.map(category => {
            if (category.id === parentId) {
              return {
                ...category,
                subcategories: [...category.subcategories, result.data as CategoryTreeItem]
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
        
        setCategories(addNewCategory([...categories], currentCategory?.id || null));
        setNewCategoryName('');
        setIsAddingCategory(false);
        router.refresh();
      } else {
        setAddCategoryError(result.message);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
      setAddCategoryError('Une erreur inattendue est survenue');
    } finally {
      setAddingCategoryLoading(false);
    }
  };

  // Générer automatiquement un name à partir du nom
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewCategoryName(name);
    
    // Générer un name simple
    const nameReplace = name.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    
    setNewCategoryName(nameReplace);
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
      
      {/* Bouton pour afficher/masquer le formulaire d'ajout - visible uniquement pour Ondrelat */}
      {isOndrelat && (
        <div className="mb-4">
          <button
            onClick={() => setIsAddingCategory(!isAddingCategory)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            {isAddingCategory ? 'Annuler' : `Ajouter une ${currentCategory ? 'sous-catégorie' : 'catégorie'}`}
          </button>
        </div>
      )}
      
      {/* Formulaire d'ajout de catégorie - affiché uniquement si isAddingCategory et si l'utilisateur est Ondrelat */}
      {isAddingCategory && isOndrelat && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-3">
            {currentCategory ? `Ajouter une sous-catégorie à "${currentCategory.name}"` : 'Ajouter une catégorie'}
          </h3>
          
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la catégorie
              </label>
              <input
                type="text"
                id="categoryName"
                value={newCategoryName}
                onChange={handleNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez le nom de la catégorie"
                required
              />
            </div>
            
            {addCategoryError && (
              <div className="p-2 bg-red-50 text-red-500 text-sm rounded-md border border-red-200">
                {addCategoryError}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="px-4 py-2 border border-gray-300 rounded-md mr-2 hover:bg-gray-50"
                disabled={addingCategoryLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={addingCategoryLoading}
              >
                {addingCategoryLoading ? 'Création...' : 'Créer la catégorie'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Arbre des catégories - en passant isOndrelat au composant pour gérer les boutons d'action */}
      <ClientCategoryTree 
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isReadOnly={!isOndrelat} // Nouvelle propriété pour indiquer mode lecture seule
      />

      {/* Affichage d'erreur globale (si l'utilisateur n'est pas Ondrelat et tente une action restreinte) */}
      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-200 mt-4">
          {errorMessage}
        </div>
      )}

      {/* Dialogue de confirmation de suppression */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Êtes-vous sûr de vouloir supprimer cette catégorie ?</h2>
              <p className="text-gray-500 mt-2">
                Cette action est irréversible. Toutes les données associées à cette catégorie seront supprimées définitivement.
              </p>
              {errorMessage && (
                <div className="mt-2 p-2 bg-red-50 text-red-500 rounded border border-red-200">
                  {errorMessage}
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isLoading}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
              >
                {isLoading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}