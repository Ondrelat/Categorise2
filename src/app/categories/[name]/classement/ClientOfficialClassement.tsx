// app/classements/classementsClientPage.tsx
'use client';

import { useEffect, useState, useTransition } from 'react';
import ArticleClassementCard from '@/components/Ranking/articleClassementCard';
import { articleClassement, articleClassementInMyList } from '@/app/types';
import Modal from '@/components/MyList/Modal';
import MyListModalContent from '@/components/MyList/MyListModalContent';
import { ReorderMyList } from '@//components/Ranking/actions'

interface ClassementClientPageProps {
  OfficialClassement: articleClassement[];
  categoryName: string;
  initialRatingSource: 'imdb' | 'categorise';
  isAuthenticated: boolean;
  MyList: articleClassementInMyList[];
}

export default function ClientOfficialClassement({
  OfficialClassement,
  categoryName,
  initialRatingSource,
  isAuthenticated: initialIsAuthenticated,
  MyList,
  // Récupération des Server Actions
}: ClassementClientPageProps) {
  const [ratingSource, setRatingSource] = useState<'imdb' | 'categorise'>(initialRatingSource);
  const [officialClassement] = useState<articleClassement[]>(OfficialClassement);
  const [myList, setMyList] = useState<articleClassement[]>(MyList);
  const [showmyList, setShowMyList] = useState(false);
  const [isAuthenticated] = useState<boolean>(initialIsAuthenticated);
  
  // useTransition pour gérer les états de chargement des Server Actions
  const [isPending, startTransition] = useTransition();

  // Liste des catégories qui doivent utiliser FilmPage                   
  //const categoriesToUseFilmPage = ["Film", "Série", "Vidéo", "Short", "Anime", "Jeu vidéo", "Épisode", "Mini Série"];

  useEffect(() => {
    if (ratingSource !== initialRatingSource) {
      console.log(`[Client] Rating source changed to: ${ratingSource}. Page reload might be needed.`);
    }
  }, [ratingSource, categoryName, initialRatingSource]);

  // --- Gestionnaires d'événements appelant les Server Actions -

  const handleReorderMyList = async (newmyList: articleClassement[]) => {
    // Sauvegarde pour revert si nécessaire
    const previousMyList = [...myList];
    
    // Mise à jour optimiste de l'UI
    setMyList(newmyList);
    
    if (isAuthenticated) {
      startTransition(async () => {
        const classementids = newmyList.map(article => article.id);
        const result = await ReorderMyList(classementids, categoryName);
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
          <div className="flex flex-col items-center gap-6">
            {officialClassement.map((articleOfficialClassement: articleClassement) => (
              <ArticleClassementCard
                key={articleOfficialClassement.id}
                articleOfficialClassement={articleOfficialClassement}
                ratingSource={ratingSource}
                onShowMyList={handleShowMyList}
                IsInMyList={myList.some(f => f.id === articleOfficialClassement.id)}
                categoryName={categoryName}
              />
            ))}
          </div>
      </div>

      <Modal
        isOpen={showmyList}
        onClose={handleCloseMyListModal}
        title="Mon classement Personnel"
      >
        <MyListModalContent
          myList={myList}
          onReorderMyList={handleReorderMyList}
          onSaveMyList={handleReorderMyList}
        />
      </Modal>
    </main>
  );
}