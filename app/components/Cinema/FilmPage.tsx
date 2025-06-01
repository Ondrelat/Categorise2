'use client';

import { useEffect, useState } from 'react';
import FilmCard from './FilmCard';
import { Film } from '@/app/types';

export default function FilmsPage({ categoryName }: { categoryName: string }) {
  const [ratingSource, setRatingSource] = useState<'imdb' | 'categorise'>('imdb');
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilms = async () => {
      setLoading(true);
      const res = await fetch(`/api/films?category=${categoryName}&sort=${ratingSource}`);
      const data = await res.json();
      setFilms(data);
      setLoading(false);
    };

    fetchFilms();
  }, [categoryName, ratingSource]);

  const toggleRatingSource = () => {
    setRatingSource((prev) => (prev === 'imdb' ? 'categorise' : 'imdb'));
  };

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center">
      <div className="max-w-6xl px-4 py-8 w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {categoryName} les mieux notés ({ratingSource === 'imdb' ? 'IMDB' : 'Catégorisé'})
        </h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={toggleRatingSource}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Voir par {ratingSource === 'imdb' ? 'Catégorisation' : 'IMDB'}
          </button>
        </div>

        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : (
          <div className="flex flex-col items-center gap-6">
            {films.map((film: Film) => (
              <FilmCard key={film.id} film={film} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
