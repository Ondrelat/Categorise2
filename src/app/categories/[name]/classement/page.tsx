// app/classement/[name]/page.tsx
import ClientOfficialClassement from './ClientOfficialClassement';
import { articleClassementInMyList } from '@/app/types';
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

  const officialClassement = await getclassementsSortedByRating(categoryName, ratingSource, userId);


  const myList: articleClassementInMyList[] = userId
    ? await fetchMyList(userId, categoryName)
    : [];

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
