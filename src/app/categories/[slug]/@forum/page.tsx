import React from 'react';
import Link from 'next/link';
import { getDiscussions } from '@/lib/articles';

export default async function ForumPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.slug);

  const discussions = await getDiscussions(name);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Forum de discussion</h2>
      <div className="space-y-3">
        {discussions.map((discussion) => (
          <div key={discussion.id} className="p-4 bg-white shadow-sm rounded-md border-l-4 border-blue-400">
            <Link
              href={`/categories/${name}/forum/${discussion.id}`}
              className="text-blue-500 font-medium hover:underline block mb-1"
            >
              {discussion.title}
            </Link>
            {discussion.createdAt && (
              <div className="text-sm text-gray-500">
                Créé le {new Date(discussion.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
        {discussions.length === 0 && (
          <div className="bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-600 mb-3">Aucune discussion n&apos;a encore été créée.</p>

          </div>
        )} <Link
          href={`/categories/${name}/create-article?type=forum`}
          className="inline-block bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Créer une nouvelle discussion
        </Link>
      </div>
    </div>
  );
}