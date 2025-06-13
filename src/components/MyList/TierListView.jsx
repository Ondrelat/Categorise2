// components/TierListView.jsx
import React from 'react';
import { MovieCard } from './MovieCard';

const tierConfig = [
  { key: 'S', label: 'S', color: 'bg-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { key: 'A', label: 'A', color: 'bg-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  { key: 'B', label: 'B', color: 'bg-yellow-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  { key: 'C', label: 'C', color: 'bg-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { key: 'D', label: 'D', color: 'bg-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
];

export function TierListView({
  getArticlesByRank,
  draggedItem,
  draggedFromUnranked,
  onDragOver,
  onDropOnRank,
  onDragStart,
  onDragEnd,
  onRemoveFromRanking
}) {
  return (
    <div className="flex gap-4 mb-4">
      {tierConfig.map((tier) => {
        const articlesInTier = getArticlesByRank(tier.key);
        
        return (
          <div key={tier.key} className="flex-1 min-w-0">
            {/* En-tête de tier */}
            <div className={`${tier.bgColor} ${tier.borderColor} rounded-t-lg border border-b-0 p-3 text-center`}>
              <div className={`w-12 h-12 ${tier.color} text-white rounded-lg flex items-center justify-center mx-auto mb-2 text-xl font-bold shadow-lg`}>
                {tier.label}
              </div>
              <span className="text-sm font-medium text-gray-700">
                Tier {tier.label}
              </span>
            </div>
            {/* Zone de drop */}
            <div
              className={`${tier.bgColor} ${tier.borderColor} border rounded-b-lg min-h-96 p-3 space-y-3 transition-all duration-200 ${
                draggedItem && !draggedFromUnranked ? `${tier.borderColor} border-2` : ''
              }`}
              onDragOver={onDragOver}
              onDrop={(e) => onDropOnRank(e, tier.key)}
            >
              {articlesInTier.length === 0 ? (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg bg-white/50">
                  <p className="text-sm">Glissez un film ici</p>
                </div>
              ) : (
                articlesInTier.map((article) => (
                  <MovieCard
                    key={article.id}
                    article={article}
                    draggedItem={draggedItem}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onRemove={onRemoveFromRanking}
                    className={`bg-white rounded-lg p-3 border-2 ${tier.borderColor} cursor-grab transition-all duration-200 shadow-xs`}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}