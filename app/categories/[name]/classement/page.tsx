// app/classement/[name]/page.tsx
import ClientOfficialClassement from './ClientOfficialClassement';
import { articleClassementInMyList } from '@/app/types';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/pages/api/auth/[...nextauth]';
import { getclassementsSortedByRating } from '@/app/lib/articles';
import { fetchMyList } from '@/app/lib/myList';
import {
  handleLike,
  handleRateSlider,
  handleReorderMyList,
  handleRemoveFromMyList,
  handleAddToMyList
} from './actions'; // Server actions déclarées à part

export default async function ClassementPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.name || 'Action');

  const ratingSource = 'categorise';

    const session = await getServerSession(authConfig);
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
  onLike={handleLike}
  onRateSlider={handleRateSlider}
  onAddToMyList={handleAddToMyList}  // <-- ajouté ici
  onRemoveFromMyList={handleRemoveFromMyList}
  onReorderMyList={handleReorderMyList}
/>
  );
}
