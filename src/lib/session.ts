import { cache } from 'react';
import { auth } from '@/auth';

export const getSession = cache(auth);

export async function getCurrentUser() {
    const session = await getSession();
    return session?.user;
}