// components/UnrankedSection.tsx
import React from 'react';
import Image from 'next/image';
import { articleClassementInMyList } from '@/app/types';

interface UnrankedSectionProps {
  unrankedArticles: articleClassementInMyList[];
  draggedItem: articleClassementInMyList | null;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDropOnUnranked: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, article: articleClassementInMyList, fromUnranked: boolean) => void;
  onDragEnd: () => void;
}

export function UnrankedSection({
  unrankedArticles,
  draggedItem,
  onDragOver,
  onDropOnUnranked,
  onDragStart,
  onDragEnd
}: UnrankedSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Films non classés</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {unrankedArticles.length} film{unrankedArticles.length > 1 ? 's' : ''}
        </span>
      </div>
      {unrankedArticles.length === 0 ? (
        <div 
          className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg"
          onDragOver={onDragOver}
          onDrop={onDropOnUnranked}
        >
          <p className="text-gray-500">Tous vos films sont classés ! 🎉</p>
        </div>
      ) : (
        <div 
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3"
          onDragOver={onDragOver}
          onDrop={onDropOnUnranked}
        >
          {unrankedArticles.map((article) => (
            <div
              key={article.id}
              className={`bg-gray-50 rounded-lg p-2 border border-gray-200 cursor-grab transition-all duration-200 ${
                draggedItem?.id === article.id ? 'opacity-50 scale-95' : 'hover:shadow-md hover:scale-105'
              }`}
              draggable
              onDragStart={(e) => onDragStart(e, article, true)}
              onDragEnd={onDragEnd}
            >
              <div className="relative w-full aspect-[3/4] mb-2">
                {article.image_url ? (
                  <Image
                    src={article.image_url}
                    alt={article.titre_fr || article.titre_en || 'film'}
                    fill
                    className="object-cover rounded"
                    sizes="120px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-2xl text-gray-400">📽️</span>
                  </div>
                )}
              </div>
              <h4 className="font-medium text-xs text-center truncate">
                {article.titre_fr || article.titre_en || 'Sans titre'}
              </h4>
              <div className="flex justify-center gap-1 text-xs text-gray-500 mt-1">
                {article.averageRatingIMDB && (
                  <span>⭐{article.averageRatingIMDB.toFixed(1)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}