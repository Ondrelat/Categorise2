// app/classement/[name]/page.tsx
import ClientOfficialClassement from './ClientOfficialClassement';
import { articleClassement } from '@/app/types';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/pages/api/auth/[...nextauth]';
import {
  getclassementsSortedByRating,
  fetchMyList,
} from '@/app/lib/articles';
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
  const name = decodeURIComponent(resolvedParams.name || 'Action');

  const ratingSource = 'categorise';
  const officialClassement = await getclassementsSortedByRating(name, ratingSource);
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id as string | undefined;

  const myList: articleClassement[] = userId
    ? await fetchMyList(userId)
    : [];

  return (
<ClientOfficialClassement
  categoryName={name}
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
