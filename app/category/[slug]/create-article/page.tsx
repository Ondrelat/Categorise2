import React from 'react';
import { notFound } from 'next/navigation';
import ArticleCreationForm from '@/app/components/ArticleCreationForm';
import { getCategoryBySlug } from '@/app/lib/categories';

export default async function CreateArticlePage({ params }: { params: { slug: string } }) {
    const category = await getCategoryBySlug(params.slug);

    if (!category) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Créer un article pour {category.name}</h1>
            <ArticleCreationForm categoryId={category._id.toString()} />
        </div>
    );
}