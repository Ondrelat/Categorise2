// app/classement/[name]/page.tsx
import ClientOfficialClassement from './ClientOfficialClassement';

import { getclassementsSortedByRating } from '@/lib/articles';
import { fetchMyList } from '@/lib/myList';

import { getSession } from '@/lib/session';


export default async function ClassementPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.name || 'Action');
  const ratingSource = 'categorise';

  // 1. Récupérer la session UNE seule fois
  const session = await getSession();
  const userId = session?.user?.id as string | undefined;

  // 2. Passer userId directement aux fonctions
  const [officialClassement, myList] = await Promise.all([
    getclassementsSortedByRating(categoryName, 'categorise', userId),
    userId ? fetchMyList(userId, categoryName) : Promise.resolve([])
  ]);

  return (
    <ClientOfficialClassement
      categoryName={categoryName}
      OfficialClassement={officialClassement}
      initialRatingSource={ratingSource}
      isAuthenticated={!!userId}
      MyList={myList}
    />
  );
}
