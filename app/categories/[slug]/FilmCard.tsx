// app/films/components/FilmCard.tsx
import { Star } from 'lucide-react';
import { Film } from './types';
import Image from 'next/image';

export default function FilmCard({ film }: { film: Film }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 w-[500px]">
      <div className="p-3"> {/* Réduit de p-4 à p-3 */}
        <div className="flex gap-3">
          {/* Image section - hauteur réduite */}
          <div className="relative w-24 h-32 flex-shrink-0"> {/* Réduit h-36 à h-32 */}
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
          
          {/* Content section avec espacements réduits */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1"> {/* Réduit mb-2 à mb-1 */}
              {film.titre_fr || film.titre_en || 'Titre non disponible'}
            </h3>
            {film.titre_en && film.titre_fr && film.titre_en !== film.titre_fr && (
              <p className="text-sm text-gray-500 mb-1"> {/* Réduit mb-2 à mb-1 */}
                {film.titre_en}
              </p>
            )}
            {film.averageRatingIMDB !== null && film.numVotesIMDB !== null && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold text-sm">
                  {film.averageRatingIMDB.toFixed(1)}
                </span>
                <span className="text-gray-500 text-sm">
                  ({film.numVotesIMDB.toLocaleString()} votes)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}