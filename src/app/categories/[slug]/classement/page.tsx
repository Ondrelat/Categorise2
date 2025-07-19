// app/categories/[slug]/classement/page.tsx
import ClientOfficialClassement from './ClientOfficialClassement';

import { getclassementsSortedByRating } from '@/lib/articles';
import { fetchMyList } from '@/lib/myList';

import { getSession } from '@/lib/session';


export default async function ClassementPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const categorySlug = decodeURIComponent(resolvedParams.slug || 'Action');
  const ratingSource = 'categorise';

  // 1. Récupérer la session UNE seule fois
  const session = await getSession();
  const userId = session?.user?.id as string | undefined;

  // 2. Passer userId directement aux fonctions
  const [officialClassement, myList] = await Promise.all([
    getclassementsSortedByRating(categorySlug, 'categorise', userId),
    userId ? fetchMyList(userId, categorySlug) : Promise.resolve([])
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
    <ClientOfficialClassement
      categorySlug={categorySlug}
      OfficialClassement={officialClassement}
      initialRatingSource={ratingSource}
      isAuthenticated={!!userId}
      MyList={myList}
    />
    </div>
  );
}
