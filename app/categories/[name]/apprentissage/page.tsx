// app/categories/[name]/apprentissage/page.tsx
import React from 'react';

import { getArticlesByTypeAndCategory } from '@/app/lib/articles';
import Link from 'next/link';

interface ApprentissagePageProps {
  params: {
    name: string;
  };
}

export default async function ApprentissagePage({ params }: ApprentissagePageProps) {
  const { name } = params;
  
  const courses = await getArticlesByTypeAndCategory(params.name, 'apprentissage');

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Ressources d&apos;apprentissage</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-4 border rounded shadow-sm">
            <Link href={`/categories/${name}/${course.id}`} className="text-blue-500 font-medium hover:underline block mb-2">
              {course.title}
            </Link>
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">•</span>
              <span>Guide d&apos;apprentissage</span>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-2 bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-600">Aucune ressource d&apos;apprentissage n&apos;est disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}