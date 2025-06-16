// app/categories/[name]/apprentissage/page.tsx
import React from 'react';
import { getArticlesByCategoryAndType } from '@/lib/articles';

export default async function ApprentissagePage({
  params 
}: { 
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.name);

  
  const course = await getArticlesByCategoryAndType(name, 'Apprentissage');

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Ressources d&apos;apprentissage</h2>
      
      {course.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-md text-center">
          <p className="text-gray-600">Aucune ressource d&apos;apprentissage n&apos;est disponible pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {course.map((course) => (
            <article key={course.id} className="bg-white p-6 border rounded-lg shadow-sm">
              <div className="prose max-w-none">
                {course.content}
              </div>
              <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                <span>Guide d&apos;apprentissage</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}