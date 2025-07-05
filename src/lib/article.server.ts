"use server"
import prisma from './db/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCategoryById } from '@/lib/categories';
import { ArticleSchema } from './articles';
import { auth } from "@/auth";

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
  console.log("try create category")
  // Validation avec schéma dynamique
  const validatedFields = ArticleSchema.safeParse(parsedData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Erreur de validation des champs',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return {
      success: false,
      message: 'Utilisateur non authentifié',
      errors: { general: ['Vous devez être connecté pour créer un article.'] },
    };
  }

  const userId = session.user.id;

  const data = validatedFields.data;
  let categoryName: string | null = null; // 1. On stocke juste le nom nécessaire

  const dataWithUser = {
    ...data,
    userId,
  };

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
    if (data.type === "Apprentissage") {
      await prisma.tutorial.create({ data: dataWithUser });
    } else if (data.type === "Forum") {
      await prisma.discussion.create({ data: dataWithUser });
    }
    else if (data.type == "Classement") {
      await prisma.articleClassement.create({ data: dataWithUser });
    }
    else {

    }

    revalidatePath(`/categories/${encodeURIComponent(categoryName!)}/${data.type.toLowerCase()}`);

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erreur complète Prisma :", error);

      return {
        success: false,
        message: "Erreur lors de la création de l'article",
        errors: {
          general: [
            error.message,
          ],
        },
      };
    }

    // Si ce n’est pas une erreur JS classique
    console.error("Erreur inconnue :", error);
    return {
      success: false,
      message: "Erreur inconnue lors de la création",
      errors: {
        general: ["Une erreur inattendue s'est produite."],
      },
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