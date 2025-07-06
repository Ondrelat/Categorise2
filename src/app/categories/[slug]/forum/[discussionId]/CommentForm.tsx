// app/categories/[name]/[discussionId]/CommentForm.tsx
'use client';

import { useTransition, useState } from 'react';
import { postComment } from '@/lib/post-comment';

interface CommentFormProps {
    discussionId: string;
    categorySlug: string;
    parentId?: string;
    onSubmitSuccess?: () => void;
    placeholder?: string;
}

export default function CommentForm({
    discussionId,
    categorySlug,
    parentId,
    onSubmitSuccess,
    placeholder = "Votre commentaire..."
}: CommentFormProps) {
    const [content, setContent] = useState('');
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!content.trim()) {
            setMessage('Le commentaire ne peut pas être vide.');
            return;
        }

        const formData = new FormData();
        formData.append('content', content.trim());
        formData.append('discussionId', discussionId);
        formData.append('categorySlug', categorySlug);

        if (parentId) {
            formData.append('parentId', parentId);
        }

        startTransition(async () => {
            try {
                const res = await postComment(formData);
                if (res.success) {
                    setMessage('Commentaire ajouté.');
                    setContent('');
                    // Appeler le callback de succès (pour fermer le formulaire de réponse)
                    onSubmitSuccess?.();
                    // Effacer le message après 3 secondes
                    setTimeout(() => setMessage(null), 3000);
                } else {
                    setMessage(res.message || 'Erreur lors de l\'ajout du commentaire');
                }
            } catch (error) {
                setMessage('Erreur lors de l\'ajout du commentaire');
                console.error('Erreur:', error);
            }
        });
    };

    return (
        <div className="space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    name="content"
                    className="w-full border rounded-md p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    rows={parentId ? 3 : 4}
                    placeholder={placeholder}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <button
                            type="submit"
                            disabled={isPending || !content.trim()}
                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Envoi...' : (parentId ? 'Répondre' : 'Publier')}
                        </button>

                        <span className="text-xs text-gray-500">
                            {content.length}/1000
                        </span>
                    </div>
                </div>
            </form>

            {message && (
                <div className={`text-sm p-2 rounded ${message.includes('ajouté')
                    ? 'text-green-700 bg-green-50 border border-green-200'
                    : 'text-red-700 bg-red-50 border border-red-200'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
}