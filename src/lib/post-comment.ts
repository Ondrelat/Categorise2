// src/lib/post-comment.ts
'use server';

import prisma from './db/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function postComment(formData: FormData) {
    const content = formData.get('content')?.toString() || '';
    const discussionId = formData.get('discussionId')?.toString() || '';
    const parentId = formData.get('parentId')?.toString() || null;
    const categorySlug = formData.get('categorySlug') as string;

    const session = await auth();

    if (!session || !session.user || !session.user.id || !categorySlug) {
        return {
            success: false,
            message: 'Vous devez être connecté.',
        };
    }

    const userId = session.user.id;

    if (!content || !discussionId || !userId) {
        return {
            success: false,
            message: 'Champs manquants.',
        };
    }

    await prisma.comment.create({
        data: {
            content,
            discussionId,
            parentId,
            userId,
        },
    });

    revalidatePath(`/categories/${categorySlug}/${discussionId}`);

    return { success: true };
}
