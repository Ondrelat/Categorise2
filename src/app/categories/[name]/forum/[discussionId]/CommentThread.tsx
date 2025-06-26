// app/categories/[name]/[discussionId]/CommentThread.tsx
'use client';

import { useState } from 'react';
import CommentForm from './CommentForm';

interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    user: {
        name: string | null;
        email: string | null;
    } | null;
    replies: Comment[];
}

interface CommentThreadProps {
    comment: Comment;
    discussionId: string;
    categoryName: string;
    level: number;
}

export default function CommentThread({
    comment,
    discussionId,
    categoryName,
    level
}: CommentThreadProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Limitation de profondeur pour éviter une indentation excessive
    const maxLevel = 6;
    const currentLevel = Math.min(level, maxLevel);

    // Calcul de l'indentation
    const indentClass = currentLevel > 0 ? `ml-${Math.min(currentLevel * 4, 20)}` : '';

    return (
        <div className={`${indentClass} ${currentLevel > 0 ? 'border-l-2 border-gray-200 pl-4' : ''}`}>
            <div className="bg-gray-50 p-4 rounded border">
                {/* En-tête du commentaire */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="font-medium">
                            {comment.user?.name || 'Utilisateur anonyme'}
                        </span>
                        <span>•</span>
                        <span>
                            {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>

                    {/* Bouton de réduction si le commentaire a des réponses */}
                    {comment.replies.length > 0 && (
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                        >
                            {isCollapsed ? `[+] ${comment.replies.length} réponse${comment.replies.length > 1 ? 's' : ''}` : '[-]'}
                        </button>
                    )}
                </div>

                {/* Contenu du commentaire */}
                <div className="text-gray-800 mb-3 whitespace-pre-wrap">
                    {comment.content}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4 text-sm">
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        {showReplyForm ? 'Annuler' : 'Répondre'}
                    </button>

                    {comment.replies.length > 0 && !isCollapsed && (
                        <span className="text-gray-500">
                            {comment.replies.length} réponse{comment.replies.length > 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* Formulaire de réponse */}
                {showReplyForm && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <CommentForm
                            discussionId={discussionId}
                            categoryName={categoryName}
                            parentId={comment.id}
                            onSubmitSuccess={() => setShowReplyForm(false)}
                            placeholder="Répondre à ce commentaire..."
                        />
                    </div>
                )}
            </div>

            {/* Réponses (récursion) */}
            {!isCollapsed && comment.replies.length > 0 && (
                <div className="mt-3 space-y-3">
                    {comment.replies.map((reply) => (
                        <CommentThread
                            key={reply.id}
                            comment={reply}
                            discussionId={discussionId}
                            categoryName={categoryName}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}