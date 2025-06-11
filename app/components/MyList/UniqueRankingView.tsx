import React from 'react';
import { MovieCard } from './MovieCard';
import { articleClassementInMyList } from '@/app/types';

interface UniqueRankingViewProps {
  maxRank: number;
  getArticlesByRank: (rank: number | string) => articleClassementInMyList[];
  draggedItem: articleClassementInMyList | null;
  draggedFromUnranked: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDropOnRank: (e: React.DragEvent<HTMLDivElement>, rank: number) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, article: articleClassementInMyList, fromUnranked: boolean) => void;
  onDragEnd: () => void;
  onRemoveFromRanking: (articleId: string) => void;
}

export function UniqueRankingView({
  maxRank,
  getArticlesByRank,
  draggedItem,
  draggedFromUnranked,
  onDragOver,
  onDropOnRank,
  onDragStart,
  onDragEnd,
  onRemoveFromRanking
}: UniqueRankingViewProps) {
  return (
    <div className="max-h-96 overflow-y-auto pr-2">
      <div className="space-y-4 mb-4">
        {Array.from({ length: maxRank }, (_, index) => {
          const rank = index + 1;
          const articlesInRank = getArticlesByRank(rank);
          const article = articlesInRank[0];
          
          return (
            <div key={rank} className="flex items-center gap-4">
              {/* Numéro de rank */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                  {rank}
                </div>
              </div>
              {/* Zone de drop */}
              <div
                className={`flex-1 bg-white border-2 border-gray-200 rounded-lg p-4 min-h-20 transition-all duration-200 ${
                  draggedItem && !draggedFromUnranked ? 'border-blue-400 bg-blue-50' : ''
                }`}
                onDragOver={onDragOver}
                onDrop={(e) => onDropOnRank(e, rank)}
              >
                {!article ? (
                  <div className="text-center py-4 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-sm">Position {rank} - Glissez un film ici</p>
                  </div>
                ) : (
                  <MovieCard
                    article={article}
                    draggedItem={draggedItem}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onRemove={onRemoveFromRanking}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200 cursor-grab transition-all duration-200"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}