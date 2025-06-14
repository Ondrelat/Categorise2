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

  // validation avec schéma dynamique
  const validatedFields = ArticleSchema.safeParse(parsedData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Erreur de validation des champs',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    const category = await getCategoryById(data.categoryId);
    if (!category) {
      return {
        success: false,
        message: 'Catégorie introuvable',
        errors: {
          categoryId: ['La catégorie spécifiée est introuvable.'],
        },
      };
    }

    await prisma.article.create({ data });

    revalidatePath(`/categories/${encodeURIComponent(category.name)}/${data.type.toLowerCase()}`);
    redirect(`/categories/${encodeURIComponent(category.name)}/${data.type.toLowerCase()}`);
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de la création de l'article",
      errors: { general: [String(error)] },
    };
  }
}

export async function getArticleById(id: string) {
  const debutArticle = performance.now();

  try {
    const article = await prisma.article.findUnique({
      where: {
        id: id,
      }
    });

    const finArticle = performance.now();
    console.log(`Temps d'exécution : ${finArticle - debutArticle} ms`);

    if (!article) {
      throw new Error(`Article avec l'ID ${id} non trouvé`);
    }

    return article;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    throw error;
  }
}