// app/classements/classementsClientPage.tsx
'use client';

import { useEffect, useState, useTransition } from 'react'; // useTransition pour les Server Actions
import ArticleClassementCard from '@/app/components/Ranking/articleClassementCard';
import { articleClassement, articleClassementUserDataExtended } from '@/app/types';
import Modal from '@/app/components/MyList/Modal';
import MyListModalContent from '@/app/components/MyList/MyListModalContent';

interface ClassementClientPageProps {
  OfficialClassement: articleClassement[];
  categoryName: string;
  initialRatingSource: 'imdb' | 'categorise';
  isAuthenticated: boolean;
  MyList: articleClassementUserDataExtended[];
  // Props pour les Server Actions
  onLike: (articleId: string, liked: boolean, categoryName: string) => Promise<{ success: boolean }>;
  onRateSlider: (articleId: string, rating: number, categoryName: string) => Promise<{ success: boolean }>;
  onAddToMyList: (articleId: string, categoryName: string) => Promise<{ success: boolean }>;
  onRemoveFromMyList: (articleId: string, categoryName: string) => Promise<{ success: boolean }>;
  onReorderMyList: (articleId: string[], categoryName: string) => Promise<{ success: boolean }>;
}

export default function ClientOfficialClassement ({
  OfficialClassement,
  categoryName,
  initialRatingSource,
  isAuthenticated: initialIsAuthenticated,
  MyList,
  // Récupération des Server Actions
  onLike,
  onRateSlider,
  onAddToMyList
,
  onRemoveFromMyList,
  onReorderMyList,
}: ClassementClientPageProps) {
  const [loading, setLoading] = useState(false); // Le chargement initial est fait par le serveur

  const [ratingSource, setRatingSource] = useState<'imdb' | 'categorise'>(initialRatingSource);

  const [officialClassement, setOfficialClassements] = useState<articleClassement[]>(OfficialClassement);
  const [myList, setMyList] = useState<articleClassement[]>(MyList);
  const [showmyList, setShowMyList] = useState(false);
  
  const [isAuthenticated] = useState<boolean>(initialIsAuthenticated); // L'authentification est gérée côté serveur

  // useTransition pour gérer les états de chargement des Server Actions
  const [isPending, startTransition] = useTransition();

  // Liste des catégories qui doivent utiliser FilmPage                   
  const categoriesToUseFilmPage = ["Film", "Série", "Vidéo", "Short", "Anime", "Jeu vidéo", "Épisode", "Mini Série"];

  // Si la source de officialClassementchange, nous avons besoin de recharger les classements.
  // Dans un cas réel, cela impliquerait soit un rafraîchissement côté serveur avec les searchParams,
  // soit un appel client à une Server Action dédiée à la recherche.
  // Pour l'exemple, nous allons simuler un rechargement simple en réutilisant la logique.
  // Idéalement, vous feriez un `router.replace` pour changer le `searchParam` `sort`
  // et laisser Next.js recharger la page côté serveur avec les nouvelles données.
  useEffect(() => {
    if (ratingSource !== initialRatingSource) {
      // Simuler une "recherche" via URL pour déclencher un rechargement serveur
      // C'est la meilleure façon de "refetch" les données quand la source change
      // Pour une vraie application, vous utiliseriez `next/navigation` pour cela.
      // Par exemple:
      // import { useRouter } from 'next/navigation';
      // const router = useRouter();
      // router.replace(`?category=${categoryName}&sort=${ratingSource}`);

      // Puisque nous ne pouvons pas appeler `router` ici directement et que l'on veut éviter le fetch client,
      // on simule juste le fait que la source change (mais les classements ne se mettront pas à jour sans rechargement serveur)
      console.log(`[Client] Rating source changed to: ${ratingSource}. Page reload might be needed.`);
      // En production, vous voudriez naviguer vers la nouvelle URL pour que le composant serveur se recharge.
      // // window.location.href = `?category=${categoryName}&sort=${ratingSource}`; // Cela rechargerait la page entière.
    }
  }, [ratingSource, categoryName, initialRatingSource]);


  // --- Gestionnaires d'événements appelant les Server Actions ---

  const handleRateSliderChange = async (articleId: string, rating: number) => {
    startTransition(async () => {
      await onRateSlider(articleId, rating, categoryName);
    });
  };

  const handleLikeClick = async (articleId: string, liked: boolean) => {
    startTransition(async () => {
      await onLike(articleId, liked, categoryName);
      // Optionnel : Mettre à jour l'état local si l'action serveur a un impact immédiat sur l'UI
      // (ex: un compteur de likes sur le classement, un changement de couleur du bouton)
    });
  };


const handleAddToMyList = async (articleClassement: articleClassement) => {
  if (isAuthenticated) {
    startTransition(async () => {
      const result = await onAddToMyList(articleClassement.id, categoryName);
      if (result.success) {
        // Mettre à jour l'état local après succès de l'action serveur
        setMyList(prev => {
            if (!prev.find(f => f.id === articleClassement.id)) {
              return [...prev, articleClassement];
            }
            return prev;
          });
        }
      });
    } else {
      // Si l'utilisateur n'est pas connecté, ajoutez à la liste temporaire locale
      if (!myList.find(f => f.id === articleClassement.id)) {
        setMyList(prev => [...prev, articleClassement]);
        console.log(`classement ${articleClassement.id} ajouté au classement temporaire local.`);
      }
    }
  };


  const handleRemoveFromMyList = async (articleId: string) => {
    if (isAuthenticated) {
      startTransition(async () => {
        const result = await onRemoveFromMyList(articleId, categoryName);
        if (result.success) {
          // Mettre à jour l'état local après succès de l'action serveur
          setMyList(prev => prev.filter(f => f.id !== articleId));
        }
      });
    } else {
      setMyList(prev => prev.filter(f => f.id !== articleId));
      console.log(`officialClassement${articleId} retiré du officialClassementtemporaire.`);
    }
  };

  const handleReorderMyList = async (newmyList: articleClassement[]) => {
    setMyList(newmyList); // Mise à jour optimiste de l'UI
    if (isAuthenticated) {
      startTransition(async () => {
        const classementids = newmyList.map(articleId=> articleId.id);
        const result = await onReorderMyList(classementids, categoryName);
        if (!result.success) {
          // Gérer l'échec : potentiellement revenir à l'ancien état si l'opération a échoué
          console.error("Échec de la mise à jour du officialClassementcôté serveur.");
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
              disabled={isPending} // Désactiver le bouton pendant que les actions serveur s'exécutent
            >
              Voir mon officialClassement({myList.length})
            </button>
          )}
        </div>

        {loading || isPending ? ( // Afficher "Chargement..." aussi si une Server Action est en cours
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
        title="Mon officialClassementPersonnel"
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