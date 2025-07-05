// app/classement/[name]/page.tsx
import ClientOfficialClassement from './ClientOfficialClassement';
import { auth } from "@/auth"
import { getclassementsSortedByRating } from '@/lib/articles';
import { fetchMyList } from '@/lib/myList';

export default async function ClassementPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.name || 'Action');

  const ratingSource = 'categorise';

  const session = await auth()
  const userId = session?.user?.id as string | undefined;

  const [officialClassement, myList] = await Promise.all([
    getclassementsSortedByRating(categoryName, ratingSource, userId),
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
