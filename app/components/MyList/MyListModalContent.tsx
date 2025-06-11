// components/MyListModalContent.tsx
import React, { useState, useEffect, useRef } from 'react';
import { TierListView } from './TierListView';
import { UniqueRankingView } from './UniqueRankingView';
import { UnrankedSection } from './UnrankedSection';
import { ListManager } from './ListManager';
import { articleClassementInMyList } from '@/app/types';

interface MyListModalContentProps {
  myList: articleClassementInMyList[];
  onReorderMyList: (newmyList: articleClassementInMyList[]) => void;
  onSaveMyList: (myList: articleClassementInMyList[]) => void;
  onClose?: () => void;
}

export default function MyListModalContent({
  myList,
  onReorderMyList,
  onSaveMyList,
}: MyListModalContentProps) {
  const [draggedItem, setDraggedItem] = useState<articleClassementInMyList | null>(null);
  const [draggedFromUnranked, setDraggedFromUnranked] = useState<boolean>(false);
  const [maxRank, setMaxRank] = useState<number>(3);
  const [isTierListMode, setIsTierListMode] = useState<boolean>(false);
  const isModifiedRef = useRef<boolean>(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const latestmyListRef = useRef<articleClassementInMyList[]>(myList);

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

  useEffect(() => {
    latestmyListRef.current = myList;
    if (!isTierListMode) {
      const highestRank = Math.max(
        ...rankedArticles.map(a => typeof a.rank === 'number' ? a.rank : 0), 
        0
      );
      setMaxRank(Math.max(highestRank + 3, 3));
    }
  }, [myList, rankedArticles, isTierListMode]);

  const handleReorder = (updatedList: articleClassementInMyList[]) => {
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, article: articleClassementInMyList, fromUnranked: boolean = false) => {
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
        updatedList[articleIndex] = { 
          ...updatedList[articleIndex], 
          rankTierList: String(targetRank),
          rank: undefined
        };
      } else {
        const existingArticleIndex = updatedList.findIndex(a => 
          a.rank === targetRank && 
          a.id !== draggedItem.id
        );

        if (existingArticleIndex !== -1) {
          updatedList[existingArticleIndex] = { 
            ...updatedList[existingArticleIndex], 
            rank: draggedItem.rank 
          };
        }
        
        updatedList[articleIndex] = { 
          ...updatedList[articleIndex], 
          rank: Number(targetRank),
          rankTierList: undefined
        };

        if (targetRank === maxRank) {
          setMaxRank(prev => prev + 3);
        }
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
    const updatedList = myList.map(article => ({
      ...article,
      rank: undefined,
      rankTierList: undefined
    }));
    handleReorder(updatedList);
    setIsTierListMode(!isTierListMode);
  };

  const getArticlesByRank = (rank: number | string) => {
    if (isTierListMode) {
      return rankedArticles.filter(article => article.rankTierList === rank);
    } else {
      return rankedArticles.filter(article => article.rank === rank);
    }
  };

  const handleImportList = (importedList: articleClassementInMyList[]) => {
    // Fusionner avec la liste existante
    const mergedList = [...myList];
    let nextAvailableRank = Math.max(...mergedList.map(a => a.rank || 0), 0) + 1;

    importedList.forEach(importedArticle => {
      const existingIndex = mergedList.findIndex(a => a.id === importedArticle.id);
      
      if (existingIndex !== -1) {
        // Article existe déjà, mettre à jour le rang
        mergedList[existingIndex] = {
          ...mergedList[existingIndex],
          rank: importedArticle.rank,
          rankTierList: importedArticle.rankTierList
        };
      } else {
        // Nouvel article, l'ajouter à la fin si pas de rang défini
        const newArticle = {
          ...importedArticle,
          rank: importedArticle.rank || (isTierListMode ? undefined : nextAvailableRank++),
          rankTierList: importedArticle.rankTierList
        };
        mergedList.push(newArticle);
      }
    });

    handleReorder(mergedList);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-800">Mon Classement de Films</h2>
          <div className="flex items-center gap-2">
            <ListManager 
              myList={myList}
              onImportList={handleImportList}
            />
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
            : 'Mode Classement Unique - Un seul film par position, glissez vers la dernière position pour créer de nouvelles positions'
          }
        </p>
      </div>

      {/* Zone de classement */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="mb-6">
          {isTierListMode ? (
            <TierListView
              getArticlesByRank={getArticlesByRank}
              draggedItem={draggedItem}
              draggedFromUnranked={draggedFromUnranked}
              onDragOver={handleDragOver}
              onDropOnRank={handleDropOnRank}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onRemoveFromRanking={removeFromRanking}
            />
          ) : (
            <UniqueRankingView
              maxRank={maxRank}
              getArticlesByRank={getArticlesByRank}
              draggedItem={draggedItem}
              draggedFromUnranked={draggedFromUnranked}
              onDragOver={handleDragOver}
              onDropOnRank={handleDropOnRank}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onRemoveFromRanking={removeFromRanking}
            />
          )}
        </div>

        <UnrankedSection
          unrankedArticles={unrankedArticles}
          draggedItem={draggedItem}
          onDragOver={handleDragOver}
          onDropOnUnranked={handleDropOnUnranked}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
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