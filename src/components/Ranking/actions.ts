'use server';

import { likeArticle, NoteArticle } from '@/lib/articles';
import { ReOrderMyList, AddOrRemoveToMyList } from '@/lib/myList';
import { auth } from "@/auth"
import { revalidatePath } from 'next/cache';

export async function handleLike(articleId: string, liked: boolean) {
  const session = await auth()
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  const result = await likeArticle(articleId, liked, userId);

  // Ne pas revalider la page entière pour un simple like
  // revalidatePath(`/classement/${categorySlug}`, 'page');

  return result;
}

// Gardez la revalidation seulement pour les actions qui affectent la liste
export async function ReorderMyList(ArticleIds: string[], categorySlug: string) {
  const session = await auth()
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  const articleIds = ArticleIds.map(id => ({ id }));
  const result = await ReOrderMyList(articleIds, userId, categorySlug);

  // Revalider seulement pour les changements de liste
  if (result.success) {
    revalidatePath(`/classement/${categorySlug}`, 'page');
  }

  return result;
}

export async function RemoveFromMyList(articleId: string, categorySlug: string) {
  const session = await auth()
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  const result = await AddOrRemoveToMyList(articleId, false, userId, categorySlug);

  if (result.success) {
    revalidatePath(`/classement/${categorySlug}`, 'page');
  }

  return result;
}

export async function AddToMyList(articleId: string, categorySlug: string) {
  const session = await auth()
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  const result = await AddOrRemoveToMyList(articleId, true, userId, categorySlug);

  if (result.success) {
    revalidatePath(`/classement/${categorySlug}`, 'page');
  }

  return result;
}

export async function toggleLikeArticle(articleId: string, liked: boolean) {
  const session = await auth()
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  const result = await likeArticle(articleId, liked, userId);

  // Ne pas revalider la page entière pour un simple like
  // revalidatePath(`/classement/${categorySlug}`, 'page');

  return result;
}

export async function handleRateSlider(articleId: string, rating: number) {
  const session = await auth()
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { success: false };

  const result = await NoteArticle(articleId, rating, userId);

  // Ne revalider que si nécessaire (ex: si ça affecte le classement)
  // revalidatePath(`/classement/${categorySlug}`, 'page');

  return result;
}