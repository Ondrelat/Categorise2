import { schema } from "@/lib/schema";
import db from "@/lib/db/db";
import { executeAction } from "@/lib/executeAction";
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

// Schéma de validation
const ArticleSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  content: z.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
  type: z.enum(["article", "tutorial", "news"], {
    errorMap: () => ({ message: "Type d&apos;article invalide" }),
  }),
  categoryId: z.string(),
  isActive: z.boolean()
});

export type ActionState = {
  success: boolean;
  message: string;
  errors: Record<string, string[]>;
};


export async function createArticle(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const validatedFields = ArticleSchema.safeParse({
      title: formData.get('title'),
      content: formData.get('content'),
      type: formData.get('type'),
      categoryId: formData.get('categoryId'),
      isActive: true,
    });

    console.log('Données reçues:', Object.fromEntries(formData));
    console.log('Résultat validation:', validatedFields);

    if (!validatedFields.success) {
      console.log('Erreurs de validation:', validatedFields.error.flatten());
      return {
        success: false,
        message: 'Erreur de validation des champs',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    await prisma.article.create({
      data: validatedFields.data,
    });

    revalidatePath('/categories/[name]');
        // Redirection vers la page de la catégorie après création
    redirect(`/categories/${validatedFields.data.categoryId}`);
    
    return {
      success: true,
      message: 'Article créé avec succès',
      errors: {},
    };
  } catch (error) {
    console.error('Erreur de création:', error);
    return {
      success: false,
      message: 'Erreur lors de la création de l&apos;article',
      errors: {},
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
