import React from 'react';
import { notFound } from 'next/navigation';
import ArticleCreationForm from '@/app/components/ArticleCreationForm';
import { getCategoryByName } from '@/app/lib/categories';

export default async function CreateArticlePage({ params }: { params: { name: string } }) {
    const category = await getCategoryByName(params.name);
    console.log ("create dans" + category?.name);
    if (!category) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Créer un article pour {category.name}</h1>
            <ArticleCreationForm categoryId={category.id.toString()} />
        </div>
    );
}