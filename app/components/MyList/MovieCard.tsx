// components/MovieCard.tsx
import React from 'react';
import Image from 'next/image';
import { articleClassementInMyList } from '@/app/types';

interface MovieCardProps {
  article: articleClassementInMyList;
  draggedItem: articleClassementInMyList | null;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, article: articleClassementInMyList, fromUnranked: boolean) => void;
  onDragEnd: () => void;
  onRemove: (articleId: string) => void;
  className: string;
}

export function MovieCard({ 
  article, 
  draggedItem, 
  onDragStart, 
  onDragEnd, 
  onRemove, 
  className 
}: MovieCardProps) {
  return (
    <div
      className={`${className} ${
        draggedItem?.id === article.id ? 'opacity-50 scale-95' : 'hover:shadow-md hover:scale-105'
      }`}
      draggable
      onDragStart={(e) => onDragStart(e, article, false)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-16 flex-shrink-0">
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.titre_fr || article.titre_en || 'film'}
              fill
              className="object-cover rounded"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">📽️</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">
            {article.titre_fr || article.titre_en || 'Sans titre'}
          </h4>
          <div className="flex gap-2 text-xs text-gray-500 mt-1">
            {article.averageRatingIMDB && (
              <span>⭐ {article.averageRatingIMDB.toFixed(1)}</span>
            )}
            {article.scoreCategorise && (
              <span>📊 {Number(article.scoreCategorise)}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => onRemove(article.id)}
          className="text-red-500 hover:text-red-700 text-xs p-1"
          title="Retirer du classement"
        >
          ✕
        </button>
      </div>
    </div>
  );
}