// components/Ranking/ArticleClassementCard.tsx
import { Star, Heart, Plus, ChevronDown, ChevronUp, List, Trash2, Trophy, Tag } from 'lucide-react';
import { articleClassement } from '@/app/types';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import { toggleLikeArticle, handleRateSlider, AddToMyList, RemoveFromMyList } from './actions';

interface ArticleClassementCardProps {
  articleOfficialClassement: articleClassement;
  ratingSource: 'imdb' | 'categorise';
  onShowMyList?: () => void;
  onWatched?: (articleid: string, watched: boolean) => void;
  IsInMyList?: boolean;
  categorySlug: string;
  rank?: number;
}

export default function ArticleClassementCard({
  articleOfficialClassement,
  ratingSource,
  onShowMyList,
  IsInMyList = false,
  categorySlug,
  rank
}: ArticleClassementCardProps) {
  const [isInMyList, setIsInMyList] = useState(IsInMyList);
  const [liked, setLiked] = useState(articleOfficialClassement.liked);
  const [rating, setRating] = useState(articleOfficialClassement.rating ?? 0);
  const [showRatingTool, setShowRatingTool] = useState(false);
  const [confirmedRating, setConfirmedRating] = useState<number | null>(
    articleOfficialClassement.rating ? articleOfficialClassement.rating : null
  );
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  useEffect(() => {
    setIsInMyList(IsInMyList);
  }, [IsInMyList]);

  function getRatingLabel(score: number): string {
    if (score < 20) return 'Décevant';
    if (score < 40) return 'Moyen';
    if (score < 60) return 'Correct';
    if (score < 75) return 'Bon';
    if (score < 90) return 'Excellent';
    return 'Parfait';
  }

  function getRatingColor(score: number): string {
    if (score < 40) return 'text-rose-600';
    if (score < 60) return 'text-amber-600';
    if (score < 75) return 'text-blue-600';
    if (score < 90) return 'text-emerald-600';
    return 'text-slate-800';
  }

  const handleLike = async () => {
    try {
      await toggleLikeArticle(articleOfficialClassement.id, !liked);
      setLiked(!liked);
    } catch (error: unknown) {
      console.error('Erreur lors du like:', error);
    }
  };

  const handleSliderChange = (value: number) => {
    setRating(value);
  };

  const handleConfirmRating = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setConfirmedRating(rating);
    setShowRatingTool(false);

    try {
      await handleRateSlider(articleOfficialClassement.id, rating);
    } catch (error: unknown) {
      setShowRatingTool(true);
      console.error('Erreur lors de la notation:', error);
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
        setIsInMyList(true);
      } catch (error: unknown) {
        console.error("Erreur lors de l'ajout à la liste :", error);
      }
    }
  };

  const handleRemoveFromList = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await RemoveFromMyList(articleOfficialClassement.id, categorySlug);
      setIsInMyList(false);
      setShowConfirmRemove(false);
    } catch (error: unknown) {
      console.error("Erreur lors de la suppression de la liste :", error);
    }
  };

  const handleToggleRatingTool = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRatingTool(!showRatingTool);
  };

  const currentRating = ratingSource === 'imdb' ? articleOfficialClassement.averageRatingIMDB : articleOfficialClassement.scoreCategorise;
  const currentVotes = ratingSource === 'imdb' ? articleOfficialClassement.numVotesIMDB : null;
  const currentRank = ratingSource === 'categorise' ? articleOfficialClassement.rankCategorise : null;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-4xl group border border-slate-200 relative">
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="relative w-32 h-48 sm:w-20 sm:h-28 md:w-24 md:h-32 shrink-0 mx-auto md:mx-0">
            {articleOfficialClassement.image_url ? (
              <Image
                src={articleOfficialClassement.image_url}
                alt={articleOfficialClassement.titre_fr || articleOfficialClassement.titre_en || 'classement'}
                fill
                className="object-cover rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-xs text-slate-500 font-medium">No image</span>
              </div>
            )}
            
            {/* Badge de rang Catégorisé */}
            {ratingSource === 'categorise' && currentRank && (
              <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <Trophy size={10} />
                #{currentRank}
              </div>
            )}

            {/* Badge de rang général */}
            {rank && (
              <div className="absolute -top-1 -left-1 bg-slate-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                #{rank}
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col min-w-0 relative items-center md:items-start text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 w-full">
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {articleOfficialClassement.titre_fr || articleOfficialClassement.titre_en || 'Titre non disponible'}
                  </h3>
                  {articleOfficialClassement.titre_en && 
                   articleOfficialClassement.titre_fr && 
                   articleOfficialClassement.titre_en !== articleOfficialClassement.titre_fr && (
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 italic">
                      {articleOfficialClassement.titre_en}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                  {/* Note IMDB/Catégorisé */}
                  {currentRating !== null && (
                    <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                      <Star 
                        className={`w-4 h-4 fill-current ${ratingSource === 'imdb' ? 'text-amber-500' : 'text-blue-500'}`}
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-xs sm:text-sm text-slate-800">
                          {ratingSource === 'imdb' ? 
                            currentRating.toFixed(1) : 
                            `${Number(currentRating)}/10`
                          }
                        </span>
                        <span className="text-xs text-slate-500">
                          {ratingSource === 'imdb' ? 
                            (currentVotes ? `${currentVotes.toLocaleString()} votes` : 'IMDB') : 
                            'Catégorisé'
                          }
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg">
                    <Tag size={12} />
                    <span className="text-xs capitalize">{categorySlug}</span>
                  </div>

                  {/* Statut dans ma liste */}
                  {isInMyList && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      Dans ma liste
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-2 sm:gap-3 shrink-0 mt-4 md:mt-0 relative">
                {/* Bouton Like */}
                <button
                  type="button"
                  onClick={handleLike}
                  className={`group/like p-2 rounded-lg transition-all duration-200 shrink-0 ${
                    liked
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-transform group-hover/like:scale-110 ${liked ? 'fill-current' : ''}`} />
                </button>

                {/* Bouton Ma note */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleToggleRatingTool}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all duration-200 border border-slate-200 hover:border-slate-300 group/rating whitespace-nowrap shrink-0"
                  >
                    <Star className="w-3 h-3 text-amber-500 group-hover/rating:text-amber-600 transition-colors shrink-0" />
                    <span className="hidden sm:inline">Ma note</span>
                    {confirmedRating !== null && (
                      <span className={`font-bold ${getRatingColor(confirmedRating * 10)}`}>
                        ({confirmedRating})
                      </span>
                    )}
                    {showRatingTool ? (
                      <ChevronUp className="w-3 h-3 transition-transform shrink-0" />
                    ) : (
                      <ChevronDown className="w-3 h-3 transition-transform shrink-0" />
                    )}
                  </button>

                  {/* Outil de notation */}
                  {showRatingTool && (
                    <div className="absolute top-full right-0 mt-2 border border-slate-200 p-4 rounded-xl bg-white shadow-xl transform transition-all duration-300 ease-out scale-100 opacity-100 w-72 z-50">
                      <div className="flex flex-col items-center mb-3">
                        <span className="text-3xl font-bold text-slate-800 mb-1">
                          {rating}
                          <span className="text-lg text-slate-500">/10</span>
                        </span>
                        <span className={`text-sm font-semibold ${getRatingColor(rating * 10)}`}>
                          {getRatingLabel(rating * 10)}
                        </span>
                      </div>

                      <div className="relative mb-3">
                        <div className="w-full h-2 bg-gradient-to-r from-slate-200 via-amber-400 to-emerald-400 rounded-full shadow-inner" />
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.1"
                          value={rating}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSliderChange(Number(e.target.value))}
                          className="absolute top-0 w-full h-2 appearance-none bg-transparent cursor-pointer custom-slider-thumb"
                        />
                      </div>

                      <div className="flex justify-between text-xs text-slate-500 mb-3">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleConfirmRating}
                        className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-xs font-bold shadow-md hover:shadow-lg"
                      >
                        Valider la note
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions principales */}
                {isInMyList ? (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onShowMyList) onShowMyList();
                      }}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
                    >
                      <List className="w-3 h-3 shrink-0" />
                      <span className="hidden lg:inline">Mon classement</span>
                    </button>

                    {!showConfirmRemove ? (
                      <button
                        type="button"
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowConfirmRemove(true);
                        }}
                        className="flex items-center gap-1 px-2 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all duration-200 border border-slate-200"
                      >
                        <Trash2 className="w-3 h-3 shrink-0" />
                      </button>
                    ) : (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={handleRemoveFromList}
                          className="px-2 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium rounded-lg transition-all duration-200"
                        >
                          ✓
                        </button>
                        <button
                          type="button"
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowConfirmRemove(false);
                          }}
                          className="px-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-all duration-200"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToMyList}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
                  >
                    <Plus className="w-3 h-3 shrink-0" />
                    <span>Ajouter</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}