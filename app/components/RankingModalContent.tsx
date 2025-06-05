// components/RankingModalContent.jsx
import React, { useState } from 'react';
import Image from 'next/image';
import { Classement } from '@/app/types'; // Make sure this path is correct

interface RankingModalContentProps {
  ranking: Classement[];
  onRemoveFromRanking: (classementid: string) => void;
  onReorderRanking: (newRanking: Classement[]) => void;
}

export default function RankingModalContent({
  ranking,
  onRemoveFromRanking,
  onReorderRanking,
}: RankingModalContentProps) {
  const [draggedItem, setDraggedItem] = useState<Classement | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, classement: Classement) => {
    setDraggedItem(classement);
    e.dataTransfer.effectAllowed = 'move';
    // Optionally set data for more complex scenarios, though not strictly needed for reordering
    e.dataTransfer.setData('text/plain', classement.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetclassement: Classement) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetclassement.id) return;

    const newRanking = [...ranking];
    const draggedIndex = newRanking.findIndex(f => f.id === draggedItem.id);
    const targetIndex = newRanking.findIndex(f => f.id === targetclassement.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Remove the dragged item from its original position
    const [removed] = newRanking.splice(draggedIndex, 1);
    // Insert the dragged item at the target position
    newRanking.splice(targetIndex, 0, removed);

    onReorderRanking(newRanking);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <>
      {ranking.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">Votre classement est vide</p>
          <p className="text-gray-400 mt-2">Ajoutez des classements à votre classement pour les voir ici</p>
        </div>
      ) : (
        <div className="p-6 space-y-4">
          {ranking.map((classement, index) => (
            <div
              key={classement.id}
              className={`bg-gray-50 rounded-lg shadow hover:shadow-md transition-shadow duration-300 border border-gray-200 p-4 flex items-center gap-4 cursor-grab
                ${draggedItem?.id === classement.id ? 'opacity-50 border-blue-500' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, classement)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, classement)}
              onDragEnd={handleDragEnd}
            >
              {/* Numéro de classement */}
              <div className="text-xl font-bold text-blue-600 bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>

              {/* Image du classement */}
              <div className="relative w-16 h-20 flex-shrink-0">
                {classement.image_url ? (
                  <Image
                    src={classement.image_url}
                    alt={classement.titre_fr || classement.titre_en || 'classement'}
                    fill
                    className="object-cover rounded"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-400">No image</span>
                  </div>
                )}
              </div>

              {/* Informations du classement */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">
                  {classement.titre_fr || classement.titre_en || 'Titre non disponible'}
                </h3>
                {classement.titre_en && classement.titre_fr && classement.titre_en !== classement.titre_fr && (
                  <p className="text-sm text-gray-500 mb-2">{classement.titre_en}</p>
                )}

                {/* Affichage des notes */}
                <div className="flex gap-4 text-sm">
                  {classement.averageRatingIMDB && (
                    <div className="flex items-center gap-1">
                      <span>IMDB: {classement.averageRatingIMDB.toFixed(1)}</span>
                    </div>
                  )}
                  {classement.scoreCategorise && (
                    <div className="flex items-center gap-1">
                      <span>Score: {Number(classement.scoreCategorise)}/100</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bouton de suppression */}
              <button
                onClick={() => onRemoveFromRanking(classement.id)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm flex-shrink-0"
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}

      {ranking.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            {ranking.length} classement{ranking.length > 1 ? 's' : ''} dans votre classement
          </p>
        </div>
      )}
    </>
  );
}