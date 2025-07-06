'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCategory } from '@/lib/categories';

interface CreateCategoryFormProps {
  isOndrelat: boolean;
  parentcategorySlug: string | null | undefined;
}

export default function CreateCategoryForm({
  isOndrelat,
  parentcategorySlug,
}: CreateCategoryFormProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newcategorySlug, setNewcategorySlug] = useState('');
  const [addCategoryError, setAddCategoryError] = useState<string | null>(null);
  const [addingCategoryLoading, setAddingCategoryLoading] = useState(false);

  const router = useRouter();

  // Générer automatiquement un name à partir du nom
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewcategorySlug(name);
  };

  // Fonction pour créer une nouvelle catégorie
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification des permissions
    if (!isOndrelat) {
      setAddCategoryError("Vous n'avez pas les permissions pour créer des catégories");
      return;
    }

    if (!newcategorySlug.trim()) {
      setAddCategoryError('Le nom et le name sont requis');
      return;
    }

    setAddingCategoryLoading(true);
    setAddCategoryError(null);

    try {
      const result = await createCategory({
        name: newcategorySlug.trim(),
        parentcategorySlug: parentcategorySlug || null
      });

      if (result.success && result.data) {
        setNewcategorySlug('');
        setIsAddingCategory(false);

        // Force un rafraîchissement complet
        router.refresh();

        // Méthode 1: Redirection vers la nouvelle catégorie créée
        if (parentcategorySlug) {
          // Naviguer vers la sous-catégorie nouvellement créée
          setTimeout(() => {
            router.push(`/categories/${newcategorySlug.trim()}`);
          }, 300);  // Un léger délai pour permettre au router.refresh() de terminer
        } else {
          // Méthode 2: Rafraîchissement de la page actuelle après un court délai
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }
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

  return (
    <div>
      {/* Bouton pour afficher/masquer le formulaire d'ajout - visible uniquement pour Ondrelat */}
      {isOndrelat && (
        <div className="mb-4">
          <button
            onClick={() => setIsAddingCategory(!isAddingCategory)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            {isAddingCategory ? 'Annuler' : `Ajouter une ${parentcategorySlug ? 'sous-catégorie' : 'catégorie'}`}
          </button>
        </div>
      )}

      {/* Formulaire d'ajout de catégorie */}
      {isAddingCategory && isOndrelat && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-3">
            {parentcategorySlug ? `Ajouter une sous-catégorie à "${parentcategorySlug}"` : 'Ajouter une catégorie'}
          </h3>

          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label htmlFor="categorySlug" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la catégorie
              </label>
              <input
                type="text"
                id="categorySlug"
                value={newcategorySlug}
                onChange={handleNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
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
    </div>
  );
}