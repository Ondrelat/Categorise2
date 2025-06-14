"use server"
import prisma from './db/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCategoryById } from '@/lib/categories';
import { ArticleSchema } from './articles';

export type ActionState = {
  success: boolean;
  message: string;
  errors: Record<string, string[]>;
};

export async function createArticle(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const formObject = Object.fromEntries(formData);
  const parsedData = {
    ...formObject,
    isActive: true,
  };

  // Validation avec schéma dynamique
  const validatedFields = ArticleSchema.safeParse(parsedData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Erreur de validation des champs',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;
  let categoryName: string | null = null; // 1. On stocke juste le nom nécessaire

  try {
    // 2. Vérification et récupération de la catégorie
    const category = await getCategoryById(data.categoryId);
    if (!category) {
      return {
        success: false,
        message: 'Catégorie introuvable',
        errors: { categoryId: ['La catégorie spécifiée est introuvable.'] },
      };
    }

    categoryName = category.name; // 3. On conserve uniquement ce dont on a besoin

    await prisma.article.create({ data });
    revalidatePath(`/categories/${encodeURIComponent(categoryName)}/${data.type.toLowerCase()}`);

  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de la création de l'article",
      errors: { general: [String(error)] },
    };
  }

  // 4. Redirection sécurisée
  if (!categoryName) {
    return {
      success: false,
      message: "Erreur critique : nom de catégorie manquant",
      errors: { general: ["Impossible de déterminer la catégorie"] },
    };
  }

  redirect(`/categories/${encodeURIComponent(categoryName)}/${data.type.toLowerCase()}`);
}