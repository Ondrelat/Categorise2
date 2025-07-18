import ExpandableCard from '@/components/ExpandableCard'; // Assure-toi que le chemin est correct

import ClientOfficialClassement from '../classement/ClientOfficialClassement';

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

  // Si le classement officiel est vide, retourne null (pas de card affichée)
  if (officialClassement.length === 0) {
    return null;
  }

  const content = (
    <ClientOfficialClassement
      categorySlug={categorySlug}
      OfficialClassement={officialClassement}
      initialRatingSource={ratingSource}
      isAuthenticated={!!userId}
      MyList={myList}
    />
  );

  return (
    <ExpandableCard
      title="Classement des utilisateurs"
      iconName="Trophy"
      previewContent={
        <div className="h-full overflow-hidden relative">
          {content}
          {/* Gradient fade pour indiquer qu'il y a plus de contenu */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>
      }
      loadingText="Chargement du classement..."
      showCount={officialClassement.length} // Optionnel : affiche le nombre d'éléments si pertinent
    >
      {content}
    </ExpandableCard>
  );
}