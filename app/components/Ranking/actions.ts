'use server';

import { likeArticle, NoteArticle } from '@/lib/articles';
import { ReOrderMyList, AddOrRemoveToMyList } from '@/lib/myList';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

export async function handleLike(articleId: string, liked: boolean, categoryName: string) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  const result = await likeArticle(articleId, liked, userId);
  
  // Ne pas revalider la page entière pour un simple like
  // revalidatePath(`/classement/${categoryName}`, 'page');
  
  return result;
}

// Gardez la revalidation seulement pour les actions qui affectent la liste
export async function ReorderMyList(ArticleIds: string[], categoryName: string)  {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  const articleIds = ArticleIds.map(id => ({ id }));
  const result = await ReOrderMyList(articleIds, userId, categoryName);
  
  // Revalider seulement pour les changements de liste
  if (result.success) {
    revalidatePath(`/classement/${categoryName}`, 'page');
  }
  
  return result;
}

export async function RemoveFromMyList(articleId: string, categoryName: string)  {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  const result = await AddOrRemoveToMyList(articleId, false, userId, categoryName);
  
  if (result.success) {
    revalidatePath(`/classement/${categoryName}`, 'page');
  }
  
  return result;
}

export async function handleAddToMyList(articleId: string, categoryName: string) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  const result = await AddOrRemoveToMyList(articleId, true, userId, categoryName);
  
  if (result.success) {
    revalidatePath(`/classement/${categoryName}`, 'page');
  }
  
  return result;
}

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