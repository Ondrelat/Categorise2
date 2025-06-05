// app/classements/classementsClientPage.tsx
'use client';

import { useEffect, useState, useTransition } from 'react'; // useTransition pour les Server Actions
import ClassementCard from '@/app/components/ClassementCard';
import { Classement } from '@/app/types';
import Modal from '@/app/components/Modal';
import RankingModalContent from '@/app/components/RankingModalContent';

interface ClassementClientPageProps {
  initialClassement: Classement[];
  categoryName: string;
  initialRatingSource: 'imdb' | 'categorise';
  isAuthenticated: boolean;
  initialUserRanking: Classement[];
  // Props pour les Server Actions
  onLike: (classementid: string, liked: boolean) => Promise<{ success: boolean }>;
  onRateSlider: (classementid: string, rating: number) => Promise<{ success: boolean }>;
  onAddclassementToUserRanking: (classement: Classement) => Promise<{ success: boolean }>;
  onRemoveclassementFromUserRanking: (classementid: string) => Promise<{ success: boolean }>;
  onReorderUserRanking: (classementids: string[]) => Promise<{ success: boolean }>;
}

export default function ClientClassement({
  initialClassement,
  categoryName,
  initialRatingSource,
  isAuthenticated: initialIsAuthenticated,
  initialUserRanking,
  // Récupération des Server Actions
  onLike,
  onRateSlider,
  onAddclassementToUserRanking,
  onRemoveclassementFromUserRanking,
  onReorderUserRanking,
}: ClassementClientPageProps) {
  const [ratingSource, setRatingSource] = useState<'imdb' | 'categorise'>(initialRatingSource);
  const [classement, setclassements] = useState<Classement[]>(initialClassement);
  const [loading, setLoading] = useState(false); // Le chargement initial est fait par le serveur
  const [tempRanking, setTempRanking] = useState<Classement[]>(initialUserRanking);
  const [showRanking, setShowRanking] = useState(false);
  const [isAuthenticated] = useState<boolean>(initialIsAuthenticated); // L'authentification est gérée côté serveur

  // useTransition pour gérer les états de chargement des Server Actions
  const [isPending, startTransition] = useTransition();

  // Liste des catégories qui doivent utiliser FilmPage                   
  const categoriesToUseFilmPage = ["Film", "Série", "Vidéo", "Short", "Anime", "Jeu vidéo", "Épisode", "Mini Série"];

  // Si la source de classement change, nous avons besoin de recharger les classements.
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

  const handleLikeClick = async (classementid: string, liked: boolean) => {
    startTransition(async () => {
      await onLike(classementid, liked);
      // Optionnel : Mettre à jour l'état local si l'action serveur a un impact immédiat sur l'UI
      // (ex: un compteur de likes sur le classement, un changement de couleur du bouton)
    });
  };

  const handleRateSliderChange = async (classementid: string, rating: number) => {
    startTransition(async () => {
      await onRateSlider(classementid, rating);
    });
  };

  const handleAddToRanking = async (classement: Classement) => {
    if (isAuthenticated) {
      startTransition(async () => {
        const result = await onAddclassementToUserRanking(classement);
        if (result.success) {
          // Mettre à jour l'état local après succès de l'action serveur
          setTempRanking(prev => {
            if (!prev.find(f => f.id === classement.id)) {
              return [...prev, classement];
            }
            return prev;
          });
        }
      });
    } else {
      // Si l'utilisateur n'est pas connecté, ajoutez à la liste temporaire locale
      if (!tempRanking.find(f => f.id === classement.id)) {
        setTempRanking(prev => [...prev, classement]);
        console.log(`classement ${classement.id} ajouté au classement temporaire local.`);
      }
    }
  };

  const handleRemoveFromRanking = async (classementid: string) => {
    if (isAuthenticated) {
      startTransition(async () => {
        const result = await onRemoveclassementFromUserRanking(classementid);
        if (result.success) {
          // Mettre à jour l'état local après succès de l'action serveur
          setTempRanking(prev => prev.filter(f => f.id !== classementid));
        }
      });
    } else {
      setTempRanking(prev => prev.filter(f => f.id !== classementid));
      console.log(`classement ${classementid} retiré du classement temporaire.`);
    }
  };

  const handleReorderRanking = async (newRanking: Classement[]) => {
    setTempRanking(newRanking); // Mise à jour optimiste de l'UI
    if (isAuthenticated) {
      startTransition(async () => {
        const classementids = newRanking.map(classement => classement.id);
        const result = await onReorderUserRanking(classementids);
        if (!result.success) {
          // Gérer l'échec : potentiellement revenir à l'ancien état si l'opération a échoué
          console.error("Échec de la mise à jour du classement côté serveur.");
        }
      });
    }
  };

  const handleShowRanking = () => {
    setShowRanking(true);
  };

  const handleCloseRankingModal = () => {
    setShowRanking(false);
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

          {tempRanking.length > 0 && (
            <button
              onClick={handleShowRanking}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              disabled={isPending} // Désactiver le bouton pendant que les actions serveur s'exécutent
            >
              Voir mon classement ({tempRanking.length})
            </button>
          )}
        </div>

        {loading || isPending ? ( // Afficher "Chargement..." aussi si une Server Action est en cours
          <p className="text-center">Chargement...</p>
        ) : (
          <div className="flex flex-col items-center gap-6">
            {classement.map((classement: Classement) => (
              <ClassementCard
                key={classement.id}
                classement={classement}
                ratingSource={ratingSource}
                onLike={handleLikeClick}
                onRateSlider={handleRateSliderChange}
                onAddToRanking={() => handleAddToRanking(classement)}
                onShowRanking={handleShowRanking}
                isInRanking={tempRanking.some(f => f.id === classement.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showRanking}
        onClose={handleCloseRankingModal}
        title="Mon Classement Personnel"
      >
        <RankingModalContent
          ranking={tempRanking}
          onRemoveFromRanking={handleRemoveFromRanking}
          onReorderRanking={handleReorderRanking}
        />
      </Modal>
    </main>
  );
}