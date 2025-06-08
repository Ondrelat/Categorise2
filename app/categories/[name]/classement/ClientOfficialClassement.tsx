// app/classements/classementsClientPage.tsx
'use client';

import { useEffect, useState, useTransition } from 'react';
import ArticleClassementCard from '@/app/components/Ranking/articleClassementCard';
import { articleClassement, articleClassementInMyList } from '@/app/types';
import Modal from '@/app/components/MyList/Modal';
import MyListModalContent from '@/app/components/MyList/MyListModalContent';

interface ClassementClientPageProps {
  OfficialClassement: articleClassement[];
  categoryName: string;
  initialRatingSource: 'imdb' | 'categorise';
  isAuthenticated: boolean;
  MyList: articleClassementInMyList[];
  // Props pour les Server Actions
  onLike: (articleId: string, liked: boolean, categoryName: string) => Promise<{ success: boolean }>;
  onRateSlider: (articleId: string, rating: number, categoryName: string) => Promise<{ success: boolean }>;
  onAddToMyList: (articleId: string, categoryName: string) => Promise<{ success: boolean }>;
  onRemoveFromMyList: (articleId: string, categoryName: string) => Promise<{ success: boolean }>;
  onReorderMyList: (articleId: string[], categoryName: string) => Promise<{ success: boolean }>;
}

export default function ClientOfficialClassement({
  OfficialClassement,
  categoryName,
  initialRatingSource,
  isAuthenticated: initialIsAuthenticated,
  MyList,
  // Récupération des Server Actions
  onLike,
  onRateSlider,
  onAddToMyList,
  onRemoveFromMyList,
  onReorderMyList,
}: ClassementClientPageProps) {
  const [loading, setLoading] = useState(false);
  const [ratingSource, setRatingSource] = useState<'imdb' | 'categorise'>(initialRatingSource);
  const [officialClassement, setOfficialClassements] = useState<articleClassement[]>(OfficialClassement);
  const [myList, setMyList] = useState<articleClassement[]>(MyList);
  const [showmyList, setShowMyList] = useState(false);
  const [isAuthenticated] = useState<boolean>(initialIsAuthenticated);
  
  // useTransition pour gérer les états de chargement des Server Actions
  const [isPending, startTransition] = useTransition();

  // Liste des catégories qui doivent utiliser FilmPage                   
  const categoriesToUseFilmPage = ["Film", "Série", "Vidéo", "Short", "Anime", "Jeu vidéo", "Épisode", "Mini Série"];

  useEffect(() => {
    if (ratingSource !== initialRatingSource) {
      console.log(`[Client] Rating source changed to: ${ratingSource}. Page reload might be needed.`);
    }
  }, [ratingSource, categoryName, initialRatingSource]);

  // --- Gestionnaires d'événements appelant les Server Actions ---

  const handleRateSliderChange = async (articleId: string, rating: number) => {
    // Mise à jour optimiste de l'état local
    setOfficialClassements(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, rating: rating * 10 } // Convertir de 0-10 à 0-100
          : article
      )
    );

    startTransition(async () => {
      const result = await onRateSlider(articleId, rating, categoryName);
      if (!result.success) {
        // Revert en cas d'échec
        setOfficialClassements(prev => 
          prev.map(article => 
            article.id === articleId 
              ? { ...article, rating: OfficialClassement.find(a => a.id === articleId)?.rating ?? 50 }
              : article
          )
        );
        console.error("Échec de la mise à jour de la note côté serveur.");
      }
    });
  };

  const handleLikeClick = async (articleId: string, liked: boolean) => {
    // Mise à jour optimiste de l'état local AVANT l'appel serveur
    setOfficialClassements(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, liked }
          : article
      )
    );

    startTransition(async () => {
      const result = await onLike(articleId, liked, categoryName);
      if (!result.success) {
        // Revert en cas d'échec
        setOfficialClassements(prev => 
          prev.map(article => 
            article.id === articleId 
              ? { ...article, liked: !liked } // Revert à l'état précédent
              : article
          )
        );
        console.error("Échec de la mise à jour du like côté serveur.");
      }
    });
  };

  const handleAddToMyList = async (articleClassement: articleClassement) => {
    if (isAuthenticated) {
      // Mise à jour optimiste
      setMyList(prev => {
        if (!prev.find(f => f.id === articleClassement.id)) {
          return [...prev, articleClassement];
        }
        return prev;
      });

      startTransition(async () => {
        const result = await onAddToMyList(articleClassement.id, categoryName);
        if (!result.success) {
          // Revert en cas d'échec
          setMyList(prev => prev.filter(f => f.id !== articleClassement.id));
          console.error("Échec de l'ajout à la liste côté serveur.");
        }
      });
    } else {
      // Si l'utilisateur n'est pas connecté, ajoutez à la liste temporaire locale
      if (!myList.find(f => f.id === articleClassement.id)) {
        setMyList(prev => [...prev, articleClassement]);
        console.log(`Classement ${articleClassement.id} ajouté au classement temporaire local.`);
      }
    }
  };

  const handleRemoveFromMyList = async (articleId: string) => {
    if (isAuthenticated) {
      // Sauvegarde pour revert si nécessaire
      const previousMyList = [...myList];
      
      // Mise à jour optimiste
      setMyList(prev => prev.filter(f => f.id !== articleId));

      startTransition(async () => {
        const result = await onRemoveFromMyList(articleId, categoryName);
        if (!result.success) {
          // Revert en cas d'échec
          setMyList(previousMyList);
          console.error("Échec de la suppression de la liste côté serveur.");
        }
      });
    } else {
      setMyList(prev => prev.filter(f => f.id !== articleId));
      console.log(`Article ${articleId} retiré du classement temporaire.`);
    }
  };

  const handleReorderMyList = async (newmyList: articleClassement[]) => {
    // Sauvegarde pour revert si nécessaire
    const previousMyList = [...myList];
    
    // Mise à jour optimiste de l'UI
    setMyList(newmyList);
    
    if (isAuthenticated) {
      startTransition(async () => {
        const classementids = newmyList.map(article => article.id);
        const result = await onReorderMyList(classementids, categoryName);
        if (!result.success) {
          // Revert en cas d'échec
          setMyList(previousMyList);
          console.error("Échec de la mise à jour du classement côté serveur.");
        }
      });
    }
  };

  const handleShowMyList = () => {
    setShowMyList(true);
  };

  const handleCloseMyListModal = () => {
    setShowMyList(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center">
      <div className="max-w-6xl px-4 py-8 w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {categoryName} les mieux notés ({ratingSource === 'imdb' ? 'IMDB' : 'Catégorisé'})
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setRatingSource('categorise')}
            className={`px-4 py-2 rounded transition ${
              ratingSource === 'categorise'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Voir par Catégorisation
          </button>
          <button
            onClick={() => setRatingSource('imdb')}
            className={`px-4 py-2 rounded transition ${
              ratingSource === 'imdb'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Voir par IMDB
          </button>

          {myList.length > 0 && (
            <button
              onClick={handleShowMyList}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              disabled={isPending}
            >
              Voir mon classement ({myList.length})
            </button>
          )}
        </div>

        {loading || isPending ? (
          <p className="text-center">Chargement...</p>
        ) : (
          <div className="flex flex-col items-center gap-6">
            {officialClassement.map((articleOfficialClassement: articleClassement) => (
              <ArticleClassementCard
                key={articleOfficialClassement.id}
                articleOfficialClassement={articleOfficialClassement}
                ratingSource={ratingSource}
                onLike={handleLikeClick}
                onRateSlider={handleRateSliderChange}
                onAddToMyList={handleAddToMyList}
                onShowMyList={handleShowMyList}
                isInMyList={myList.some(f => f.id === articleOfficialClassement.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showmyList}
        onClose={handleCloseMyListModal}
        title="Mon classement Personnel"
      >
        <MyListModalContent
          myList={myList}
          onRemoveFromMyList={handleRemoveFromMyList}
          onReorderMyList={handleReorderMyList}
          onSaveMyList={handleReorderMyList}
        />
      </Modal>
    </main>
  );
}