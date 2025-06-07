// components/myListModalContent.jsx
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { articleClassementUserDataExtended } from '@/app/types';

interface MyListModalContentProps {
  myList: articleClassementUserDataExtended[];
  onRemoveFromMyList: (classementid: string) => void;
  onReorderMyList: (newmyList: articleClassementUserDataExtended[]) => void;
  onSaveMyList: (myList: articleClassementUserDataExtended[]) => void;
  onClose?: () => void;
}

export default function MyListModalContent({
  myList,
  onRemoveFromMyList,
  onReorderMyList,
  onSaveMyList,
  onClose,
}: MyListModalContentProps) {
  const [draggedItem, setDraggedItem] = useState<articleClassementUserDataExtended | null>(null);
  const [draggedFromUnranked, setDraggedFromUnranked] = useState<boolean>(false);
  const [maxRank, setMaxRank] = useState<number>(3);
  const [isTierListMode, setIsTierListMode] = useState<boolean>(true);
  const isModifiedRef = useRef(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const latestmyListRef = useRef<articleClassementUserDataExtended[]>(myList);

  // Configuration des tiers
  const tierConfig = [
    { key: 'S', label: 'S', color: 'bg-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    { key: 'A', label: 'A', color: 'bg-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    { key: 'B', label: 'B', color: 'bg-yellow-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    { key: 'C', label: 'C', color: 'bg-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { key: 'D', label: 'D', color: 'bg-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  ];

  // Séparer les articles classés et non classés selon le mode
  const rankedArticles = myList.filter(article => 
    isTierListMode 
      ? article.rankTierList !== undefined && article.rankTierList !== null 
      : article.rank !== undefined && article.rank !== null
  );
  
  const unrankedArticles = myList.filter(article => 
    isTierListMode 
      ? article.rankTierList === undefined || article.rankTierList === null 
      : article.rank === undefined || article.rank === null
  );

  // Organiser les articles classés par rank selon le mode
  const getArticlesByRank = (rank: number | string) => {
    if (isTierListMode) {
      return rankedArticles.filter(article => article.rankTierList === rank);
    } else {
      return rankedArticles.filter(article => article.rank === rank);
    }
  };

  useEffect(() => {
    latestmyListRef.current = myList;
    if (!isTierListMode) {
      const highestRank = Math.max(...rankedArticles.map(a => typeof a.rank === 'number' ? a.rank : 0), 3);
      setMaxRank(highestRank);
    }
  }, [myList, rankedArticles, isTierListMode]);

  const handleReorder = (updatedList: articleClassementUserDataExtended[]) => {
    isModifiedRef.current = true;
    onReorderMyList(updatedList);
    latestmyListRef.current = updatedList;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      if (isModifiedRef.current) {
        onSaveMyList(latestmyListRef.current);
        isModifiedRef.current = false;
      }
    }, 5000);
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isModifiedRef.current) {
        onSaveMyList(latestmyListRef.current);
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    return () => {
      if (isModifiedRef.current) {
        onSaveMyList(latestmyListRef.current);
        isModifiedRef.current = false;
      }
    };
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, article: articleClassementUserDataExtended, fromUnranked: boolean = false) => {
    setDraggedItem(article);
    setDraggedFromUnranked(fromUnranked);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', article.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnRank = (e: React.DragEvent<HTMLDivElement>, targetRank: number | string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const updatedList = [...myList];
    const articleIndex = updatedList.findIndex(a => a.id === draggedItem.id);

    if (articleIndex !== -1) {
      if (isTierListMode) {
        // Mode tier list - on utilise rankTierList
        updatedList[articleIndex] = { 
          ...updatedList[articleIndex], 
          rankTierList: targetRank as string,
          rank: undefined
        };
      } else {
        // Mode classement numérique - on utilise rank
        const existingArticleIndex = updatedList.findIndex(a => 
          a.rank === targetRank && 
          a.id !== draggedItem.id
        );

        if (existingArticleIndex !== -1) {
          // Échanger les ranks
          updatedList[existingArticleIndex] = { 
            ...updatedList[existingArticleIndex], 
            rank: draggedItem.rank 
          };
        }
        
        updatedList[articleIndex] = { 
          ...updatedList[articleIndex], 
          rank: targetRank as number,
          rankTierList: undefined
        };
      }

      handleReorder(updatedList);
    }

    setDraggedItem(null);
    setDraggedFromUnranked(false);
  };

  const handleDropOnUnranked = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedItem || draggedFromUnranked) return;

    const updatedList = myList.map(article => 
      article.id === draggedItem.id 
        ? { 
            ...article, 
            rank: undefined,
            rankTierList: undefined 
          }
        : article
    );
    
    handleReorder(updatedList);
    setDraggedItem(null);
    setDraggedFromUnranked(false);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedFromUnranked(false);
  };

  const addNewRankColumn = () => {
    setMaxRank(prev => prev + 1);
  };

  const removeFromRanking = (articleId: string) => {
    const updatedList = myList.map(article => 
      article.id === articleId 
        ? { 
            ...article, 
            rank: undefined,
            rankTierList: undefined 
          }
        : article
    );
    handleReorder(updatedList);
  };

  const switchMode = () => {
    // Réinitialiser les ranks lors du changement de mode
    const updatedList = myList.map(article => ({
      ...article,
      rank: undefined,
      rankTierList: undefined
    }));
    handleReorder(updatedList);
    setIsTierListMode(!isTierListMode);
  };

  const renderTierList = () => (
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
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnRank(e, tier.key)}
            >
              {articlesInTier.length === 0 ? (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg bg-white/50">
                  <p className="text-sm">Glissez un film ici</p>
                </div>
              ) : (
                articlesInTier.map((article) => (
                  <div
                    key={article.id}
                    className={`bg-white rounded-lg p-3 border-2 ${tier.borderColor} cursor-grab transition-all duration-200 shadow-sm ${
                      draggedItem?.id === article.id ? 'opacity-50 scale-95' : 'hover:shadow-md hover:scale-105'
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, article, false)}
                    onDragEnd={handleDragEnd}
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
                        onClick={() => removeFromRanking(article.id)}
                        className="text-red-500 hover:text-red-700 text-xs p-1"
                        title="Retirer du classement"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderUniqueRanking = () => (
    <div className="space-y-4 mb-4">
      {Array.from({ length: maxRank }, (_, index) => {
        const rank = index + 1;
        const articlesInRank = getArticlesByRank(rank);
        const article = articlesInRank[0]; // Un seul article par rank
        
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
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnRank(e, rank)}
            >
              {!article ? (
                <div className="text-center py-4 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-sm">rank {rank} - Glissez un film ici</p>
                </div>
              ) : (
                <div
                  className={`bg-gray-50 rounded-lg p-3 border border-gray-200 cursor-grab transition-all duration-200 ${
                    draggedItem?.id === article.id ? 'opacity-50 scale-95' : 'hover:shadow-md hover:scale-105'
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, article, false)}
                  onDragEnd={handleDragEnd}
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
                      onClick={() => removeFromRanking(article.id)}
                      className="text-red-500 hover:text-red-700 text-xs p-1"
                      title="Retirer du classement"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {/* Bouton pour ajouter une nouvelle rank */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex-shrink-0"></div>
        <button
          onClick={addNewRankColumn}
          className="flex-1 bg-gray-200 hover:bg-gray-300 border-2 border-dashed border-gray-400 rounded-lg p-4 flex items-center justify-center text-gray-600 transition-colors"
        >
          <span className="text-xl mr-2">+</span>
          <span className="text-sm">Ajouter rank {maxRank + 1}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-800">Mon Classement de Films</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={switchMode}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isTierListMode 
                  ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white shadow-lg' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              }`}
            >
              {isTierListMode ? '🏆 Tier List' : '📍 Classement'}
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {isTierListMode 
            ? 'Mode Tier List - Glissez les films vers les tiers S, A, B, C, D'
            : 'Mode Classement Unique - Un seul film par rank, classement vertical'
          }
        </p>
      </div>

      {/* Zone de classement */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="mb-6">
          {isTierListMode ? renderTierList() : renderUniqueRanking()}
        </div>

        {/* Films non classés */}
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
              onDragOver={handleDragOver}
              onDrop={handleDropOnUnranked}
            >
              <p className="text-gray-500">Tous vos films sont classés ! 🎉</p>
            </div>
          ) : (
            <div 
              className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3"
              onDragOver={handleDragOver}
              onDrop={handleDropOnUnranked}
            >
              {unrankedArticles.map((article) => (
                <div
                  key={article.id}
                  className={`bg-gray-50 rounded-lg p-2 border border-gray-200 cursor-grab transition-all duration-200 ${
                    draggedItem?.id === article.id ? 'opacity-50 scale-95' : 'hover:shadow-md hover:scale-105'
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, article, true)}
                  onDragEnd={handleDragEnd}
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
      </div>

      {/* Footer avec statistiques */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            {rankedArticles.length} film{rankedArticles.length > 1 ? 's' : ''} classé{rankedArticles.length > 1 ? 's' : ''}
          </span>
          <span>
            {unrankedArticles.length} film{unrankedArticles.length > 1 ? 's' : ''} non classé{unrankedArticles.length > 1 ? 's' : ''}
          </span>
          <span>
            Mode: {isTierListMode ? 'Tier List' : 'Classement Unique'}
          </span>
        </div>
      </div>
    </div>
  );
}