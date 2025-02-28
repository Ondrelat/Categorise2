// app/categories/[name]/classement/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface ClassementPageProps {
  params: {
    name: string;
  };
}

export default async function ClassementPage({ params }: ClassementPageProps) {
  const { name } = params;
  
  const { getArticlesByTypeAndCategory } = await import('@/app/lib/articles');
  
  const articles = await getArticlesByTypeAndCategory(params.name, 'classement');

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Classements</h2>
      <div className="space-y-2">
        {articles.map((article) => (
          <div key={article.id} className="p-3 bg-white shadow rounded-md">
            <Link href={`/categories/${name}/${article.id}`} className="text-blue-500 hover:underline">
              {article.title}
            </Link>
          </div>
        ))}
        {articles.length === 0 && (
          <p className="text-gray-500">Aucun classement n&apos;est disponible pour le moment.</p>
        )}
      </div>
    </div>
  );
}