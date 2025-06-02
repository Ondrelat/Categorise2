// app/films/components/FilmCardCategorise.tsx
import { Star, Heart, Plus } from 'lucide-react';
import { Film } from '../../types';
import Image from 'next/image';
import { useState } from 'react';

interface FilmCardCategoriseProps {
  film: Film;
  onLike?: (filmId: string, liked: boolean) => void;
  onRateSlider?: (filmId: string, rating: number) => void;
  onAddToRanking?: (filmId: string) => void;
}

export default function FilmCardCategorise({ 
  film, 
  onLike, 
  onRateSlider, 
  onAddToRanking 
}: FilmCardCategoriseProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [sliderRating, setSliderRating] = useState(50);
  const [showRatingOptions, setShowRatingOptions] = useState(false);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    onLike?.(film.id, newLikedState);
  };

  const handleSliderChange = (value: number) => {
    setSliderRating(value);
    onRateSlider?.(film.id, value);
  };

  const handleAddToRanking = () => {
    onAddToRanking?.(film.id);
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 w-[500px]">
      <div className="p-3">
        <div className="flex gap-3">
          {/* Image section */}
          <div className="relative w-24 h-32 flex-shrink-0">
            {film.image_url ? (
              <Image
                src={film.image_url}
                alt={film.titre_fr || film.titre_en || 'Film'}
                fill
                className="object-cover rounded"
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                <span className="text-sm text-gray-400">No image</span>
              </div>
            )}
          </div>
          
          {/* Content section */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">
              {film.titre_fr || film.titre_en || 'Titre non disponible'}
            </h3>
            
            {film.titre_en && film.titre_fr && film.titre_en !== film.titre_fr && (
              <p className="text-sm text-gray-500 mb-1">
                {film.titre_en}
              </p>
            )}
            
            {/* Score Catégorisé 
            {film.scoreCategorise !== null && (
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-purple-400 fill-current" />
                <span className="font-semibold text-sm">
                  {film.scoreCategorise}/100
                </span>
                <span className="text-gray-500 text-sm">
                  (Score catégorisé)
                </span>
              </div>
            )}
            */}
            {/* Classement si disponible 
            {film.rankCategorise && (
              <div className="text-sm text-purple-600 mb-2">
                Classement: #{film.rankCategorise}
              </div>
            )}
            */}
            {/* Options de notation */}
            <div className="mt-2">
              <button
                onClick={() => setShowRatingOptions(!showRatingOptions)}
                className="text-sm text-blue-600 hover:text-blue-800 mb-2"
              >
                {showRatingOptions ? 'Masquer les options' : 'Noter ce film'}
              </button>
              
              {showRatingOptions && (
                <div className="space-y-2 border-t pt-2">
                  {/* Option Like */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition ${
                        isLiked 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      {isLiked ? 'Aimé' : 'Aimer'}
                    </button>
                  </div>
                  
                  {/* Option Slider */}
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">
                      Note personnelle: {sliderRating}/100
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderRating}
                      onChange={(e) => handleSliderChange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  {/* Option Ajout classement */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddToRanking}
                      className="flex items-center gap-1 px-2 py-1 rounded text-sm bg-green-100 hover:bg-green-200 text-green-700 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter au classement
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}