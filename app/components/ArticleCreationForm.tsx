'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type ArticleType = 'classement' | 'forum' | 'apprentissage' | 'media';

interface ArticleCreationFormProps {
    categoryId: string;
}

const ArticleCreationForm: React.FC<ArticleCreationFormProps> = ({ categoryId }) => {
    const [articleType, setArticleType] = useState<ArticleType | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!articleType) return;

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    articleType,
                    categoryId,
                    title,
                    content: articleType !== 'classement' ? content : undefined,
                    imageUrl: articleType === 'classement' ? imageUrl : undefined,
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création de l&apos;article');
            }

            const data = await response.json();
            console.log('Article créé avec succès:', data);

            // Redirection vers la page de la catégorie après création réussie
            router.push(`/categories/${categoryId}`);
        } catch (error) {
            setError('Une erreur est survenue lors de la création de l&apos;article');
            console.error('Erreur:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500">{error}</div>}
            <div>
                <label className="block text-sm font-medium text-gray-700">Type d&apos;article</label>
                <select
                    value={articleType || ''}
                    onChange={(e) => setArticleType(e.target.value as ArticleType)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                >
                    <option value="">Sélectionnez un type</option>
                    <option value="classement">Classement</option>
                    <option value="forum">Forum</option>
                    <option value="apprentissage">Apprentissage</option>
                    <option value="media">Media</option>
                </select>
            </div>
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Titre
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                />
            </div>
            {articleType === 'classement' && (
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                        URL de l&apos;image
                    </label>
                    <input
                        type="url"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                    />
                </div>
            )}
            {articleType && articleType !== 'classement' && (
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Contenu
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                    ></textarea>
                </div>
            )}
            <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                disabled={isSubmitting || !articleType}
            >
                {isSubmitting ? 'Création en cours...' : "Créer l'article"}
            </button>
        </form>
    );
};

export default ArticleCreationForm;