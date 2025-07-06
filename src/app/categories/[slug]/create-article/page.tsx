import React from 'react';
import { notFound } from 'next/navigation';
import ArticleCreationForm from '@/components/ArticleCreationForm';
import { getCategoryBySlug } from '@/lib/categories';

export default async function CreateArticlePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.slug);
  const category = await getCategoryBySlug(name);

  console.log("create dans " + category?.name);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Créer un article pour {category.slug}
      </h1>
      <ArticleCreationForm
        categoryId={category.id.toString()}
        categorySlug={category.slug!}
      />
    </div>
  );
}