// app/categories/[name]/[discussionId]/page.tsx

import React from 'react';
import { getDiscussionWithComments } from '@/lib/articles';
import Link from 'next/link';
import CommentForm from './CommentForm';
import CommentThread from './CommentThread';

export default async function DiscussionDetailPage({
    params,
}: {
    params: { name: string; discussionId: string };
}) {
    const { name, discussionId } = params;

    const discussion = await getDiscussionWithComments(discussionId);

    if (!discussion) {
        return (
            <div className="p-6 text-center text-gray-600">
                Discussion introuvable.
            </div>
        );
    }

    return (
        <div className="mt-6 space-y-6">
            <Link href={`/categories/${name}/apprentissage`} className="text-blue-500 hover:underline">
                ← Retour
            </Link>

            <article className="bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-2">{discussion.title}</h1>
                <div className="text-gray-700 prose">{discussion.content}</div>
                <div className="text-sm text-gray-400 mt-4">
                    Publié le {new Date(discussion.createdAt).toLocaleDateString()}
                </div>
            </article>

            <section>
                <h2 className="text-xl font-semibold mb-4">Commentaires</h2>

                {/* Formulaire pour nouveau commentaire principal */}
                <div className="mb-6">
                    <CommentForm discussionId={discussion.id} categoryName={name} />
                </div>

                <div className="space-y-4">
                    {discussion.comments.length === 0 && (
                        <p className="text-gray-500">Aucun commentaire pour le moment.</p>
                    )}

                    {discussion.comments.map((comment) => (
                        <CommentThread
                            key={comment.id}
                            comment={comment}
                            discussionId={discussion.id}
                            categoryName={name}
                            level={0}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}