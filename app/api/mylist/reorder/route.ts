import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';
import { ReOrderMyList } from '@/lib/myList';
import { revalidatePath } from 'next/cache';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authConfig);
    const userId = session?.user?.id as string | undefined;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { articleIds, categoryName } = req.body;
    
    if (!Array.isArray(articleIds) || !categoryName) {
      return res.status(400).json({ error: 'Missing or invalid parameters' });
    }

    const formattedIds = articleIds.map(id => ({ id }));
    const result = await ReOrderMyList(formattedIds, userId, categoryName);
    
    if (result.success) {
      revalidatePath(`/classement/${categoryName}`, 'page');
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in reorder API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}