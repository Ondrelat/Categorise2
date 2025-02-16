// app/films/components/FilmCard.tsx
import { Star } from 'lucide-react';
import { Film } from './types';
import Image from 'next/image';

export default function FilmCard({ film }: { film: Film }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex gap-4">
          {/* Image section */}
          <div className="relative w-32 h-48 flex-shrink-0">
            {film.image_url ? (
              <Image
                src={film.image_url}
                alt={film.titre_fr || film.titre_en || 'Film'}
                fill
                className="object-cover rounded"
                sizes="128px"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
          
          {/* Content section */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">
              {film.titre_fr || film.titre_en || 'Titre non disponible'}
            </h3>
            {film.titre_en && film.titre_fr && film.titre_en !== film.titre_fr && (
              <p className="text-gray-500 mb-2">{film.titre_en}</p>
            )}
            {film.averageRatingIMDB !== null && film.numVotesIMDB !== null && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">
                  {film.averageRatingIMDB.toFixed(1)}
                </span>
                <span className="text-gray-500">
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