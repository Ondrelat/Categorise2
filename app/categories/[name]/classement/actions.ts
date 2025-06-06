'use server';

import { likeArticle, NoteArticle, ReOrderClassement, AddOrRemoveToClassement } from '@/app/lib/articles';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/pages/api/auth/[...nextauth]';

export async function handleLike(articleId: string, liked: boolean, categoryName: string) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  return await likeArticle(articleId, liked, userId);
}

export async function handleRateSlider(articleId: string, rating: number, categoryName: string)  {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  return await NoteArticle(articleId, rating, userId);
}

export async function handleReorderMyClassement(classementIds: string[], categoryName: string)  {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  // transformer string[] en {id: string}[]
  const classements = classementIds.map(id => ({ id }));

  return await ReOrderClassement(classements, userId);
}

export async function handleRemoveFromMyClassement(articleId: string, categoryName: string)  {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  // TODO: Ajoute ici la logique pour supprimer le classement utilisateur
  return { success: true };
}

export async function handleAddToMyClassement(articleId: string, categoryName: string) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  // Par exemple, si ReOrderClassement attend un tableau, adapte ici.
  return await AddOrRemoveToClassement(articleId, true, userId);
}