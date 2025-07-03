'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createArticle, type ActionState } from '@/lib/article.server';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ARTICLE_TYPES, ContentSection } from '@/app/types';
import LexicalEditor from '@/components/LexicalEditor';
import { useLexicalEditor } from '@/hooks/useLexicalEditor';

const initialState: ActionState = {
  success: false,
  message: '',
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
    >
      {pending ? 'Création...' : "Créer l'article"}
    </button>
  );
}

interface ArticleCreationFormProps {
  categoryId: string;
  categoryName: string; // Ajout pour la redirection
}


export default function ArticleCreationForm({ categoryId, categoryName }: ArticleCreationFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, formAction] = useActionState(createArticle, initialState);
  const [selectedType, setSelectedType] = useState<ContentSection | ''>('');
  const { editorState, handleChange, getContent } = useLexicalEditor();
  const [contentValue, setContentValue] = useState('');

  // Récupérer le type suggéré depuis l'URL
  useEffect(() => {
    const suggestedType = searchParams.get('type');
    if (suggestedType && ARTICLE_TYPES.includes(suggestedType as ContentSection)) {
      setSelectedType(suggestedType as ContentSection);
    }
  }, [searchParams]);

  // Mettre à jour la valeur du contenu quand l'éditeur change
  useEffect(() => {
    if (editorState) {
      setContentValue(getContent());
    }
  }, [editorState, getContent]);

  // Gérer la redirection après succès
  useEffect(() => {
    if (state.success && selectedType) {
      router.push(`/categories/${encodeURIComponent(categoryName)}/${selectedType}`);
    }
  }, [state.success, selectedType, categoryName, router]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as ContentSection | '');
  };

  return (
    <form action={formAction} className="space-y-6 max-w-2xl mx-auto">
      {state.message && (
        <div className={`p-4 ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} border-l-4 border-current`}>
          {state.message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type d&apos;article
          </label>
          <select
            id="type"
            name="type"
            value={selectedType}
            onChange={handleTypeChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionnez un type</option>
            {ARTICLE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {state.errors?.type && (
            <p className="mt-1 text-sm text-red-600">{state.errors.type[0]}</p>
          )}
        </div>

        <input type="hidden" name="categoryId" value={categoryId} />

        {/* Titre - uniquement pour forum */}
        {selectedType === 'Forum' && (
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Titre
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              required
              placeholder="Entrez le titre de votre article"
            />
            {state.errors?.title && (
              <p className="mt-1 text-sm text-red-600">{state.errors.title[0]}</p>
            )}
          </div>
        )}

        {/* Niveau de difficulté - uniquement pour apprentissage */}
        {selectedType === 'Apprentissage' && (
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">
              Niveau de difficulté
            </label>
            <select
              id="level"
              name="level"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Sélectionner un niveau (optionnel)</option>
              <option value="BEGINNER">Débutant</option>
              <option value="INTERMEDIATE">Intermédiaire</option>
              <option value="ADVANCED">Avancé</option>
            </select>
            {state.errors?.level && (
              <p className="mt-1 text-sm text-red-600">{state.errors.level[0]}</p>
            )}
          </div>
        )}

        {/* URL de l'image - uniquement pour classement */}
        {selectedType === 'Classement' && (
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              URL de l&apos;image (optionnel)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              placeholder="https://exemple.com/image.jpg"
            />
            {state.errors?.imageUrl && (
              <p className="mt-1 text-sm text-red-600">{state.errors.imageUrl[0]}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Contenu
          </label>
          <div className="mt-1">
            <LexicalEditor
              onChange={handleChange}
              placeholder="Rédigez le contenu de votre article..."
            />
            <input type="hidden" name="contentJson" value={contentValue} />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Utilisez les outils de formatage pour styliser votre contenu.
          </p>
          {state.errors?.content && (
            <p className="mt-1 text-sm text-red-600">{state.errors.content[0]}</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push(`/categories/${encodeURIComponent(categoryName)}`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}