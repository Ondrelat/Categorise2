import React from 'react';
import { notFound } from 'next/navigation';
import { getArticleById } from '@/app/lib/articles';
import { getCategoryBySlug } from '@/app/lib/categories';

export default async function ArticlePage({ params }: { params: { slug: string; articleId: string } }) {
    const category = await getCategoryBySlug(params.slug);
    const article = await getArticleById(params.articleId);

    if (!category || !article) {
        notFound();
    }

    // Gérer le cas où createdAt pourrait être undefined
    const createdAt = article.createdAt
        ? (article.createdAt instanceof Date
            ? article.createdAt
            : new Date(article.createdAt))
        : new Date(); // Utiliser la date actuelle comme valeur par défaut si createdAt est undefined

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
            <p className="text-gray-600 mb-4">Catégorie: {category.name}</p>

            {article.type === 'classement' && article.imageUrl && (
                <img src={article.imageUrl} alt={article.title} className="w-full max-w-2xl mb-4" />
            )}

            {article.type !== 'classement' && article.content && (
                <div className="prose max-w-none">
                    {article.content}
                </div>
            )}

            <p className="text-sm text-gray-500 mt-4">
                Publié le {createdAt.toLocaleDateString()}
            </p>
        </div>
    );
}