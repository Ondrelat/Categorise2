'use server'

import { likeArticle, NoteArticle } from '@/lib/articles';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';


export async function toggleLikeArticle(articleId: string, liked: boolean, categoryName: string) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  const result = await likeArticle(articleId, liked, userId);
  
  // Ne pas revalider la page entière pour un simple like
  // revalidatePath(`/classement/${categoryName}`, 'page');
  
  return result;
}

export async function handleRateSlider(articleId: string, rating: number, categoryName: string)  {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  const result = await NoteArticle(articleId, rating, userId);
  
  // Ne revalider que si nécessaire (ex: si ça affecte le classement)
  // revalidatePath(`/classement/${categoryName}`, 'page');
  
  return result;
}