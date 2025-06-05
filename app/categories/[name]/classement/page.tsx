import ClientClassement from './ClientClassement';
import { Classement } from '@/app/types';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/pages/api/auth/[...nextauth]'; // adapte ce chemin si besoin
import {
  getclassementsSortedByRating,
  fetchUserRankingsFromDB,
  likeArticle
} from '@/app/lib/articles';

export default async function ClassementPage({
  params
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.name);

  const categoryName = name || 'Action';
  const ratingSource = 'categorise';
  const classement = await getclassementsSortedByRating(categoryName, ratingSource);
  const session = await getServerSession(authConfig);
  console.log("Session", session);
  const userId = session?.user?.id as string | undefined;

  const getUserRanking = async (): Promise<Classement[]> => {
    if (!userId) {
      console.log("[Server] User not authenticated, not fetching ranking.");
      return [];
    }
    const rankings = await fetchUserRankingsFromDB(userId);
    return rankings;
  };

  const handleLike = async (articleId: string, liked: boolean) => {
    'use server';

    if (userId) {
      console.log(`[Server Action] Article ${articleId} ${liked ? 'liké' : 'unliké'}`);
      return await likeArticle(articleId, liked, userId);
    }
    return { success: false };
  };

  const handleRateSlider = async (classementId: string, rating: number) => {
    'use server';
    console.log(`[Server Action] classement ${classementId} noté ${rating}/100`);
    return { success: true };
  };

  const handleAddclassementToUserRanking = async (classement: Classement) => {
    'use server';
    console.log(`[Server Action] Ajout du classement ${classement.id} au classement utilisateur.`);
    return { success: true };
  };

  const handleRemoveclassementFromUserRanking = async (classementId: string) => {
    'use server';
    console.log(`[Server Action] Retrait du classement ${classementId} du classement utilisateur.`);
    return { success: true };
  };

  const handleReorderUserRanking = async (classementIds: string[]) => {
    'use server';
    console.log(`[Server Action] Réordonnancement du classement utilisateur: ${classementIds}`);
    return { success: true };
  };

  const initialUserRanking = await getUserRanking();
  const isAuthenticated = !!userId;

  return (
    <ClientClassement
      initialClassement={classement}
      categoryName={categoryName}
      initialRatingSource={ratingSource}
      isAuthenticated={isAuthenticated}
      initialUserRanking={initialUserRanking}
      onLike={handleLike}
      onRateSlider={handleRateSlider}
      onAddclassementToUserRanking={handleAddclassementToUserRanking}
      onRemoveclassementFromUserRanking={handleRemoveclassementFromUserRanking}
      onReorderUserRanking={handleReorderUserRanking}
    />
  );
}
