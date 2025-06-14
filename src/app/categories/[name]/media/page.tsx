// app/categories/[name]/media/page.tsx
import React from 'react';
import Link from 'next/link';

export default async function MediaPage({ 
        params
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.name);
  const { getArticlesByCategoryAndType } = await import('@/lib/articles');
  
  const mediaItems = await getArticlesByCategoryAndType(name, 'Media');

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Médiathèque</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {mediaItems.map((media) => (
          <div key={media.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="h-40 bg-gray-200 relative">
              {/* Placeholder for media thumbnail */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <span>Média</span>
              </div>
            </div>
            <div className="p-3">
              <Link href={`/categories/${name}/${media.id}`} className="text-blue-500 font-medium hover:underline block">
                {media.title}
              </Link>
            </div>
          </div>
        ))}
        {mediaItems.length === 0 && (
          <div className="col-span-3 bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-600">Aucun média n&apos;est disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}