// app/classements/components/classementCard.tsx
import { Star, Heart, Plus, ChevronDown, ChevronUp, List, Trash2 } from 'lucide-react';
import { articleClassement } from '@/app/types';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import { toggleLikeArticle, handleRateSlider, AddToMyList, RemoveFromMyList } from './actions'

interface articleClassementCardProps {
  articleOfficialClassement: articleClassement;
  ratingSource: 'imdb' | 'categorise';
  onShowMyList?: () => void;
  onWatched?: (articleid: string, watched: boolean) => void;
  IsInMyList?: boolean;
  categorySlug: string
}

export default function ArticleClassementCard({
  articleOfficialClassement,
  ratingSource,
  onShowMyList,
  IsInMyList = false,
  categorySlug
}: articleClassementCardProps) {
  // États locaux synchronisés avec les props
  const [isInMyList, setIsInMyList] = useState(IsInMyList)
  const [liked, setLiked] = useState(articleOfficialClassement.liked);
  const [rating, setRating] = useState(articleOfficialClassement.rating ?? 0);
  const [showRatingTool, setShowRatingTool] = useState(false);
  const [confirmedRating, setConfirmedRating] = useState<number | null>(
    articleOfficialClassement.rating ? articleOfficialClassement.rating : null
  );
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  // Synchroniser l'état local avec la prop
  useEffect(() => {
    setIsInMyList(IsInMyList);
  }, [IsInMyList]);

  function getRatingLabel(score: number): string {
    if (score < 20) return 'Mauvais'; // 0.0-1.9
    if (score < 40) return 'Insuffisant'; // 2.0-3.9
    if (score < 60) return 'Moyen'; // 4.0-5.9
    if (score < 75) return 'Bon'; // 6.0-7.4
    if (score < 90) return 'Très bon'; // 7.5-8.9
    return 'Excellent'; // 9.0-10.0
  }

  const handleLike = async () => {
    try {
      await toggleLikeArticle(articleOfficialClassement.id, !liked);
      setLiked(!liked);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSliderChange = (value: number) => {
    setRating(value);
  };

  const handleConfirmRating = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Mise à jour immédiate de l'UI
    setConfirmedRating(rating);
    setShowRatingTool(false);

    try {
      await handleRateSlider(articleOfficialClassement.id, rating);
    } catch (error) {
      setShowRatingTool(true);
      console.error(error);
    }
  };

  const handleAddToMyList = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInMyList && onShowMyList) {
      onShowMyList();
    } else {
      try {
        await AddToMyList(articleOfficialClassement.id, categorySlug);
        // Mettre à jour l'état local après succès
        setIsInMyList(true);
      } catch (error) {
        // Optionnel : afficher une erreur, rollback UI, etc.
        console.error("Erreur lors de l'ajout à la liste :", error);
      }
    }
  };

  const handleRemoveFromList = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await RemoveFromMyList(articleOfficialClassement.id, categorySlug);
      // Mettre à jour l'état local après succès
      setIsInMyList(false);
      setShowConfirmRemove(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de la liste :", error);
    }
  };

  const handleToggleRatingTool = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRatingTool(!showRatingTool);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 w-[700px]">
        <div className="p-4">
          <div className="flex gap-4">
            {/* Image section */}
            <div className="relative w-28 h-36 shrink-0">
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
                            {Number(articleOfficialClassement.scoreCategorise)}/10
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
                      className={`p-2 rounded-full transition ${liked
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                    >
                      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Bouton pour afficher/cacher la notation personnelle */}
                  <button
                    type="button"
                    onClick={handleToggleRatingTool}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition-all duration-300 ease-in-out group ${rating ? 'opacity-70' : ''
                      }`}
                  >
                    <Star className="w-4 h-4 text-indigo-500" />
                    Ma note
                    {confirmedRating !== null && (
                      <span className="ml-1 text-indigo-900 font-bold">
                        ({confirmedRating})
                      </span>
                    )}
                    {showRatingTool ? (
                      <ChevronUp className="w-4 h-4 ml-1 group-hover:translate-y-0.5 transition-transform" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1 group-hover:-translate-y-0.5 transition-transform" />
                    )}
                  </button>

                  {/* Notation personnelle (conditionnellement affichée) */}
                  {showRatingTool && (
                    <div className="text-right border border-gray-200 p-4 rounded-lg mt-2 bg-gray-50 transform origin-top transition-all duration-300 ease-in-out scale-y-100 opacity-100">
                      <div className="flex flex-col items-end mb-2">
                        <span className="text-3xl font-extrabold text-gray-800">
                          {rating}
                          <span className="text-lg text-gray-500">/10</span>
                        </span>
                        <span className="text-base font-semibold text-indigo-600">
                          {getRatingLabel(rating)}
                        </span>
                      </div>

                      <div className="relative flex justify-end mt-2">
                        <div className="w-48 h-2 bg-linear-to-r from-red-500 via-yellow-400 to-green-500 rounded-full" />
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.1"
                          value={rating}
                          onChange={(e) => handleSliderChange(Number(e.target.value))}
                          className="absolute top-0 w-48 h-2 appearance-none bg-transparent cursor-pointer custom-slider-thumb"
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
                        className={`mt-4 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-base font-bold shadow-md
                        }`}
                      >
                        {'Valider la note'}
                      </button>
                    </div>
                  )}

                  {/* Section des boutons d'action pour la liste - VERSION AMÉLIORÉE */}
                  <div className="flex flex-col gap-2 w-full">
                    {isInMyList ? (
                      <>
                        {/* Bouton principal "Voir mon classement" */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onShowMyList) onShowMyList();
                          }}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-xs min-w-[180px]"
                        >
                          <List className="w-4 h-4" />
                          <span>Voir mon classement</span>
                        </button>

                        {/* Bouton retirer avec confirmation */}
                        {!showConfirmRemove ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowConfirmRemove(true);
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-red-200 min-w-[180px]"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Retirer de ma liste</span>
                          </button>
                        ) : (
                          <div className="flex flex-col gap-1 p-3 bg-red-50 border border-red-200 rounded-lg min-w-[180px]">
                            <p className="text-xs text-red-700 text-center font-medium mb-2">
                              Confirmer la suppression ?
                            </p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={handleRemoveFromList}
                                className="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
                              >
                                Oui, retirer
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setShowConfirmRemove(false);
                                }}
                                className="flex-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded transition-colors"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Bouton "Ajouter à ma liste" quand pas dans la liste */
                      <button
                        type="button"
                        onClick={handleAddToMyList}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors shadow-xs min-w-[180px]"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter à ma liste</span>
                      </button>
                    )}
                  </div>
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