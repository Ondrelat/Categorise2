


// app/classements/components/classementCard.tsx
import { Star, Heart, Plus, ChevronDown, ChevronUp, Eye, List } from 'lucide-react';
import { articleClassement } from '../../types';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface articleClassementCardProps {
  articleOfficialClassement: articleClassement;
  ratingSource: 'imdb' | 'categorise';
  onLike?: (articleid: string, liked: boolean) => void;
  onRateSlider?: (articleid: string, rating: number) => void;
  onAddToMyList?: (article: articleClassement) => void;
  onShowMyList?: () => void;
  onWatched?: (articleid: string, watched: boolean) => void;
  isInMyList?: boolean;
}

export default function ArticleClassementCard({
  articleOfficialClassement,
  ratingSource,
  onLike,
  onRateSlider,
  onAddToMyList,
  onShowMyList,
  isInMyList = false,
}: articleClassementCardProps) {
  // États locaux synchronisés avec les props
  const [localLiked, setLocalLiked] = useState(articleOfficialClassement.liked ?? false);
  const [localRating, setLocalRating] = useState(articleOfficialClassement.rating ?? 50);
  const [sliderRating, setSliderRating] = useState(articleOfficialClassement.rating ?? 50);
  const [showRatingTool, setShowRatingTool] = useState(false);
  const [confirmedRating, setConfirmedRating] = useState<number | null>(
    articleOfficialClassement.rating ? articleOfficialClassement.rating / 10 : null
  );

  // États pour gérer les états de chargement
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isRatingLoading, setIsRatingLoading] = useState(false);

  // Synchroniser l'état local avec les props quand elles changent
  useEffect(() => {
    setLocalLiked(articleOfficialClassement.liked ?? false);
    setLocalRating(articleOfficialClassement.rating ?? 50);
    setSliderRating(articleOfficialClassement.rating ?? 50);
    setConfirmedRating(articleOfficialClassement.rating ? articleOfficialClassement.rating / 10 : null);
  }, [articleOfficialClassement.liked, articleOfficialClassement.rating]);

  function getRatingLabel(score: number): string {
    if (score < 20) return 'Mauvais'; // 0.0-1.9
    if (score < 40) return 'Insuffisant'; // 2.0-3.9
    if (score < 60) return 'Moyen'; // 4.0-5.9
    if (score < 75) return 'Bon'; // 6.0-7.4
    if (score < 90) return 'Très bon'; // 7.5-8.9
    return 'Excellent'; // 9.0-10.0
  }

  const handleLike = async (e: React.MouseEvent) => {
    // Empêcher la propagation d'événements qui pourraient causer un rechargement
    e.preventDefault();
    e.stopPropagation();
    
    if (isLikeLoading) return;
    
    const newLikedState = !localLiked;
    
    // Mise à jour immédiate de l'UI (optimiste)
    setLocalLiked(newLikedState);
    setIsLikeLoading(true);
    
    try {
      if (onLike) {
        await onLike(articleOfficialClassement.id, newLikedState);
        console.log('Like mis à jour avec succès');
      }
    } catch (error) {
      // En cas d'erreur, on revert l'état local
      console.error('Erreur lors de la mise à jour du like:', error);
      setLocalLiked(!newLikedState);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleSliderChange = (value: number) => {
    setSliderRating(value);
  };

  const handleConfirmRating = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isRatingLoading) return;
    
    const finalRating = parseFloat((sliderRating / 10).toFixed(1));
    const finalRatingFor100Scale = sliderRating;
    
    // Mise à jour immédiate de l'UI (optimiste)
    setConfirmedRating(finalRating);
    setLocalRating(finalRatingFor100Scale);
    setShowRatingTool(false);
    setIsRatingLoading(true);
    
    try {
      if (onRateSlider) {
        await onRateSlider(articleOfficialClassement.id, finalRating);
        console.log('Note mise à jour avec succès');
      }
    } catch (error) {
      // En cas d'erreur, on revert l'état local
      console.error('Erreur lors de la mise à jour de la note:', error);
      const previousRating = articleOfficialClassement.rating ?? 50;
      setLocalRating(previousRating);
      setSliderRating(previousRating);
      setConfirmedRating(previousRating ? previousRating / 10 : null);
      setShowRatingTool(true);
    } finally {
      setIsRatingLoading(false);
    }
  };

  const handleRankingAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInMyList && onShowMyList) {
      onShowMyList();
    } else if (onAddToMyList) {
      onAddToMyList(articleOfficialClassement);
    }
  };

  const handleToggleRatingTool = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRatingTool(!showRatingTool);
  };

  // Calculate the display rating (0.0-10.0)
  const displayRating = (sliderRating / 10).toFixed(1);

  return (
    <>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 w-[700px]">
        <div className="p-4">
          <div className="flex gap-4">
            {/* Image section */}
            <div className="relative w-28 h-36 flex-shrink-0">
              {articleOfficialClassement.image_url ? (
                <Image
                  src={articleOfficialClassement.image_url}
                  alt={articleOfficialClassement.titre_fr || articleOfficialClassement.titre_en || 'classement'}
                  fill
                  className="object-cover rounded"
                  sizes="112px"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-sm text-gray-400">No image</span>
                </div>
              )}
            </div>

            {/* Content section */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                {/* Infos à gauche */}
                <div className="flex flex-col items-start gap-2">
                  <h3 className="text-xl font-semibold">
                    {articleOfficialClassement.titre_fr || articleOfficialClassement.titre_en || 'Titre non disponible'}
                  </h3>
                  {articleOfficialClassement.titre_en && articleOfficialClassement.titre_fr && articleOfficialClassement.titre_en !== articleOfficialClassement.titre_fr && (
                    <p className="text-sm text-gray-500">{articleOfficialClassement.titre_en}</p>
                  )}

                  {/* Note IMDB ou Catégorisé */}
                  {ratingSource === 'imdb' ? (
                    articleOfficialClassement.averageRatingIMDB !== null && articleOfficialClassement.numVotesIMDB !== null && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">
                          {articleOfficialClassement.averageRatingIMDB.toFixed(1)}
                        </span>
                        <span className="text-gray-500">
                          ({articleOfficialClassement.numVotesIMDB.toLocaleString()} votes IMDB)
                        </span>
                      </div>
                    )
                  ) : (
                    <>
                      {articleOfficialClassement.scoreCategorise !== null && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-purple-400 fill-current" />
                          <span className="font-semibold">
                            {Number(articleOfficialClassement.scoreCategorise)}/100
                          </span>
                          <span className="text-gray-500">(Score catégorisé)</span>
                        </div>
                      )}
                      {articleOfficialClassement.rankCategorise && (
                        <div className="text-sm text-purple-600">
                          Classement: #{Number(articleOfficialClassement.rankCategorise)}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Actions à droite */}
                <div className="flex flex-col items-end gap-3">
                  {/* Boutons d'action : Like */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleLike}
                      disabled={isLikeLoading}
                      className={`p-2 rounded-full transition relative ${
                        localLiked
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      } ${isLikeLoading ? 'opacity-70' : ''}`}
                    >
                      <Heart className={`w-5 h-5 ${localLiked ? 'fill-current' : ''}`} />
                      {isLikeLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Bouton pour afficher/cacher la notation personnelle */}
                  <button
                    type="button"
                    onClick={handleToggleRatingTool}
                    disabled={isRatingLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition-all duration-300 ease-in-out group ${
                      isRatingLoading ? 'opacity-70' : ''
                    }`}
                  >
                    <Star className="w-4 h-4 text-indigo-500" />
                    Ma note
                    {confirmedRating !== null && (
                      <span className="ml-1 text-indigo-900 font-bold">
                        ({confirmedRating}/10)
                      </span>
                    )}
                    {showRatingTool ? (
                      <ChevronUp className="w-4 h-4 ml-1 group-hover:translate-y-0.5 transition-transform" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1 group-hover:-translate-y-0.5 transition-transform" />
                    )}
                    {isRatingLoading && (
                      <div className="w-3 h-3 border border-indigo-500 border-t-transparent rounded-full animate-spin ml-2"></div>
                    )}
                  </button>

                  {/* Notation personnelle (conditionnellement affichée) */}
                  {showRatingTool && (
                    <div className="text-right border border-gray-200 p-4 rounded-lg mt-2 bg-gray-50 transform origin-top transition-all duration-300 ease-in-out scale-y-100 opacity-100">
                      <div className="flex flex-col items-end mb-2">
                        <span className="text-3xl font-extrabold text-gray-800">
                          {displayRating}
                          <span className="text-lg text-gray-500">/10</span>
                        </span>
                        <span className="text-base font-semibold text-indigo-600">
                          {getRatingLabel(sliderRating)}
                        </span>
                      </div>

                      <div className="relative flex justify-end mt-2">
                        <div className="w-48 h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={sliderRating}
                          onChange={(e) => handleSliderChange(Number(e.target.value))}
                          className="absolute top-0 w-48 h-2 appearance-none bg-transparent cursor-pointer custom-slider-thumb"
                          disabled={isRatingLoading}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 w-48 mx-auto mt-1">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleConfirmRating}
                        disabled={isRatingLoading}
                        className={`mt-4 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-base font-bold shadow-md ${
                          isRatingLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isRatingLoading ? 'Validation...' : 'Valider la note'}
                      </button>
                    </div>
                  )}

                  {/* Bouton Ajout/Voir classement */}
                  <button
                    type="button"
                    onClick={handleRankingAction}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition ${
                      isInMyList
                        ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                    }`}
                  >
                    {isInMyList ? (
                      <>
                        <List className="w-4 h-4" />
                        Voir mon classement
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Ajouter à ma liste
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Style du pouce du slider */
        .custom-slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px; /* Taille du cercle */
          height: 16px; /* Taille du cercle */
          background: #ffffff; /* Couleur du pouce */
          border: 2px solid #4f46e5; /* Bordure violette */
          border-radius: 50%; /* Forme circulaire */
          cursor: pointer;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* Ombre légère */
          margin-top: -7px; /* Ajuster la position verticale pour centrer */
        }

        .custom-slider-thumb::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #ffffff;
          border: 2px solid #4f46e5;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Style de la piste du slider (la partie remplie avant le pouce) */
        .custom-slider-thumb::-webkit-slider-runnable-track {
          background: transparent; /* La piste sera gérée par le div sous-jacent */
          border-radius: 5px;
        }

        .custom-slider-thumb::-moz-range-track {
          background: transparent; /* La piste sera gérée par le div sous-jacent */
          border-radius: 5px;
        }

        .custom-slider-thumb:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}