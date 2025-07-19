'use client';

// app/categories/[slug]/classement/ClientOfficialClassement.tsx
import { useEffect, useState, useTransition } from 'react';
import ArticleClassementCard from '@/components/Ranking/articleClassementCard';
import { articleClassement, articleClassementInMyList } from '@/app/types';
import Modal from '@/components/MyList/Modal';
import MyListModalContent from '@/components/MyList/MyListModalContent';
import { ReorderMyList } from '@/components/Ranking/actions';
import { 
  Users, 
  Eye, 
} from 'lucide-react';

interface ClassementClientPageProps {
  OfficialClassement: articleClassement[];
  categorySlug: string;
  initialRatingSource: 'imdb' | 'categorise';
  isAuthenticated: boolean;
  MyList: articleClassementInMyList[];
}

const TabButton = ({ 
  id, 
  label, 
  icon: Icon, 
  isActive, 
  onClick 
}: { 
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isActive: boolean;
  onClick: (id: string) => void;
}) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

export default function ClientOfficialClassement({
  OfficialClassement,
  categorySlug,
  initialRatingSource,
  isAuthenticated: initialIsAuthenticated,
  MyList,
}: ClassementClientPageProps) {
  const [ratingSource, setRatingSource] = useState<'imdb' | 'categorise'>(initialRatingSource);
  const [officialClassement] = useState<articleClassement[]>(OfficialClassement);
  const [myList, setMyList] = useState<articleClassement[]>(MyList);
  const [showmyList, setShowMyList] = useState(false);
  const [isAuthenticated] = useState<boolean>(initialIsAuthenticated);
  const [activeTab, setActiveTab] = useState<'official' | 'mylist'>('official');

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (ratingSource !== initialRatingSource) {
      console.log(`[Client] Rating source changed to: ${ratingSource}. Page reload might be needed.`);
    }
  }, [ratingSource, categorySlug, initialRatingSource]);

  const handleReorderMyList = async (newmyList: articleClassement[]) => {
    const previousMyList = [...myList];
    setMyList(newmyList);

    if (isAuthenticated) {
      startTransition(async () => {
        const classementids = newmyList.map((article: articleClassement) => article.id);
        const result = await ReorderMyList(classementids, categorySlug);
        if (!result.success) {
          setMyList(previousMyList);
          console.error("Échec de la mise à jour du classement côté serveur.");
        }
      });
    }
  };

  const handleShowMyList = () => {
    setShowMyList(true);
  };

  const handleCloseMyListModal = () => {
    setShowMyList(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="flex gap-2">
              {myList.length > 0 && (
                <TabButton
                  id="mylist"
                  label={`Mon classement (${myList.length})`}
                  icon={Users}
                  isActive={activeTab === 'mylist'}
                  onClick={(id: string) => setActiveTab(id as 'official' | 'mylist')}
                />
              )}
            </div>

            {/* Sélecteur de source de notation */}
            <div className="flex gap-2">
              <button
                onClick={() => setRatingSource('categorise')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  ratingSource === 'categorise'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Catégorisé
              </button>
              <button
                onClick={() => setRatingSource('imdb')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  ratingSource === 'imdb'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                IMDB
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'official' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              {myList.length > 0 && (
                <button
                  onClick={handleShowMyList}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                  disabled={isPending}
                >
                  <Eye size={16} />
                  Voir mon classement ({myList.length})
                </button>
              )}
            </div>

            <div className="flex flex-col items-center gap-8">
              {officialClassement.map((articleOfficialClassement: articleClassement, index: number) => (
                <ArticleClassementCard
                  key={articleOfficialClassement.id}
                  articleOfficialClassement={articleOfficialClassement}
                  ratingSource={ratingSource}
                  onShowMyList={handleShowMyList}
                  IsInMyList={myList.some((f: articleClassement) => f.id === articleOfficialClassement.id)}
                  categorySlug={categorySlug}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mylist' && myList.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Mon classement personnel
              </h2>
              <div className="text-sm text-slate-600">
                {myList.length} élément{myList.length > 1 ? 's' : ''} dans votre liste
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
              <MyListModalContent
                myList={myList}
                onReorderMyList={handleReorderMyList}
                onSaveMyList={handleReorderMyList}
              />
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showmyList}
        onClose={handleCloseMyListModal}
        title="Mon classement Personnel"
      >
        <MyListModalContent
          myList={myList}
          onReorderMyList={handleReorderMyList}
          onSaveMyList={handleReorderMyList}
        />
      </Modal>
    </div>
  );
}