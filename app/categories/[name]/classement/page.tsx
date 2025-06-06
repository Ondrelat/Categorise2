// app/classement/[name]/page.tsx
import ClientClassement from './ClientClassement';
import { articleClassement } from '@/app/types';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/pages/api/auth/[...nextauth]';
import {
  getclassementsSortedByRating,
  fetchMyClassement,
} from '@/app/lib/articles';
import {
  handleLike,
  handleRateSlider,
  handleReorderMyClassement,
  handleRemoveFromMyClassement,
  handleAddToMyClassement
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

  const myClassement: articleClassement[] = userId
    ? await fetchMyClassement(userId)
    : [];

  return (
<ClientClassement
  categoryName={name}
  OfficialClassement={officialClassement}
  initialRatingSource={ratingSource}
  isAuthenticated={!!userId}
  MyClassement={myClassement}
  onLike={handleLike}
  onRateSlider={handleRateSlider}
  onAddToMyClassement={handleAddToMyClassement}  // <-- ajouté ici
  onRemoveFromMyClassement={handleRemoveFromMyClassement}
  onReorderMyClassement={handleReorderMyClassement}
/>
  );
}
