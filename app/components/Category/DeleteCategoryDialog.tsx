'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { deleteCategory } from '../../../lib/categories';

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  categoryId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onDeleteSuccess: (categoryId: string) => void;
  setErrorMessage: (message: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export default function DeleteCategoryDialog({
  isOpen,
  categoryId,
  isLoading,
  errorMessage,
  onClose,
  onDeleteSuccess,
  setErrorMessage,
  setIsLoading
}: DeleteCategoryDialogProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleConfirmDelete = async () => {
    if (!categoryId) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const result = await deleteCategory(categoryId);
      
      if (result.success) {
        onDeleteSuccess(categoryId);
        onClose();
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

  return (
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
            onClick={onClose}
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
  );
}