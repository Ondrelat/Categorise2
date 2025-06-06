// components/myListModalContent.jsx
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { articleClassement } from '@/app/types';

interface MyListModalContentProps {
  myList: articleClassement[];
  onRemoveFromMyList: (classementid: string) => void;
  onReorderMyList: (newmyList: articleClassement[]) => void;
  onSaveMyList: (myList: articleClassement[]) => void; // <- ajoute cette fonction dans le parent
  onClose?: () => void; // <- si tu gères une fermeture de popup (optionnel)
}

export default function MyListModalContent({
  myList,
  onRemoveFromMyList,
  onReorderMyList,
  onSaveMyList,
  onClose,
}: MyListModalContentProps) {
  const [draggedItem, setDraggedItem] = useState<articleClassement | null>(null);

  const isModifiedRef = useRef(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const latestmyListRef = useRef<articleClassement[]>(myList); // pour accéder au myList courant dans les effets

  // === Mise à jour du classement à chaque prop change
  useEffect(() => {
    latestmyListRef.current = myList;
  }, [myList]);

  // === Sauvegarde automatique après inactivité (5s)
  const handleReorder = (newmyList: articleClassement[]) => {
    // Vérifie si quelque chose a changé
    const hasChanged = JSON.stringify(newmyList.map(i => i.id)) !== JSON.stringify(latestmyListRef.current.map(i => i.id));
    if (!hasChanged) return;

    isModifiedRef.current = true;
    onReorderMyList(newmyList);
    latestmyListRef.current = newmyList;

    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(() => {
      if (isModifiedRef.current) {
        onSaveMyList(latestmyListRef.current);
        isModifiedRef.current = false;
      }
    }, 5000);
  };

  // === Sauvegarde lors de la fermeture de la page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isModifiedRef.current) {
        onSaveMyList(latestmyListRef.current);
        e.preventDefault();
        e.returnValue = ''; // pour Chrome
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // === Sauvegarde lors de la fermeture manuelle de la popup
  useEffect(() => {
    return () => {
      if (isModifiedRef.current) {
        onSaveMyList(latestmyListRef.current);
        isModifiedRef.current = false;
      }
    };
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, classement: articleClassement) => {
    setDraggedItem(classement);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', classement.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetclassement: articleClassement) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetclassement.id) return;

    const newmyList = [...myList];
    const draggedIndex = newmyList.findIndex(f => f.id === draggedItem.id);
    const targetIndex = newmyList.findIndex(f => f.id === targetclassement.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [removed] = newmyList.splice(draggedIndex, 1);
    newmyList.splice(targetIndex, 0, removed);

    handleReorder(newmyList);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <>
      {myList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">Votre classement est vide</p>
          <p className="text-gray-400 mt-2">Ajoutez des classements à votre classement pour les voir ici</p>
        </div>
      ) : (
        <div className="p-6 space-y-4">
          {myList.map((classement, index) => (
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
              <div className="text-xl font-bold text-blue-600 bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>

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

              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">
                  {classement.titre_fr || classement.titre_en || 'Titre non disponible'}
                </h3>
                {classement.titre_en && classement.titre_fr && classement.titre_en !== classement.titre_fr && (
                  <p className="text-sm text-gray-500 mb-2">{classement.titre_en}</p>
                )}

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

              <button
                onClick={() => onRemoveFromMyList(classement.id)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm flex-shrink-0"
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}

      {myList.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            {myList.length} classement{myList.length > 1 ? 's' : ''} dans votre classement
          </p>
        </div>
      )}
    </>
  );
}
