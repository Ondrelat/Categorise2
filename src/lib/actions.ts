"use server"
import { schema } from "@/lib/schema";
import db from "@/lib/db/db";
import { executeAction } from "@/lib/executeAction";
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ARTICLE_TYPES, ContentSection } from '@/app/types';
import { getCategoryById } from '@/lib/categories';



const prisma = new PrismaClient();
export const BaseSchema = z.object({
  type: z.enum(ARTICLE_TYPES, {
    errorMap: () => ({ message: "Type d'article invalide" }),
  }),
  content: z.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
  categoryId: z.string(),
  isActive: z.boolean().default(true),
});

// Définir un schéma par type
const ForumSchema = BaseSchema.extend({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
});

const ApprentissageSchema = BaseSchema.extend({
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  title: z.literal(undefined), // empêche le champ "title"
});

const ClassementSchema = BaseSchema.extend({
  imageUrl: z.string().url("URL d'image invalide").optional(),
  title: z.literal(undefined), // empêche aussi "title"
});

const GenericSchema = BaseSchema.extend({
  title: z.literal(undefined),
});

export const ArticleSchema = z.discriminatedUnion('type', [
  ForumSchema,
  ApprentissageSchema,
  ClassementSchema,
  GenericSchema, // pour tout type non listé ici
]);

export type ArticleInput = z.infer<typeof ArticleSchema>;
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




const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email");
      const password = formData.get("password");
      const validatedData = schema.parse({ email, password });
      await db.user.create({
        data: {
          email: validatedData.email.toLocaleLowerCase(),
          password: validatedData.password,
        },
      });
    },
    successMessage: "Signed up successfully",
  });
};

export { signUp };


export async function getMissingArticleTypes(categoryName: string): Promise<ContentSection[]> {
  const typesManquants: ContentSection[] = []

  // D'abord, récupérer la catégorie par son nom
  const category = await prisma.categories.findFirst({
    where: {
      name: categoryName,
    },
    select: {
      id: true,
    },
  })

  if (!category) {
    throw new Error(`Category with name "${categoryName}" not found`)
  }

  const categorieId = category.id

  const [hasClassement, hasForum, hasApprentissage, hasMedia] = await Promise.all([
    prisma.articleClassementCategory.findFirst({
      where: {
        categoryId: categorieId,
      },
      select: {
        articleId: true,
      },
    }),
    prisma.article.findFirst({
      where: { categoryId: categorieId, type: 'Forum' },
      select: { id: true },
    }),
    prisma.article.findFirst({
      where: { categoryId: categorieId, type: 'Apprentissage' },
      select: { id: true },
    }),
    prisma.article.findFirst({
      where: { categoryId: categorieId, type: 'Media' },
      select: { id: true },
    }),
  ])

  if (!hasClassement) typesManquants.push('Classement')
  if (!hasForum) typesManquants.push('Forum')
  if (!hasApprentissage) typesManquants.push('Apprentissage')
  if (!hasMedia) typesManquants.push('Media')

  return typesManquants
}