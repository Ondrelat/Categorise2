'use client';

import { useEffect, useState } from 'react';
import FilmCard from './FilmCard';
import { Film } from '@/app/types';

export default function FilmsPage({ categoryName }: { categoryName: string }) {
  const [ratingSource, setRatingSource] = useState<'imdb' | 'categorise'>('categorise');
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

  // Handlers pour les interactions de notation
  const handleLike = async (filmId: string, liked: boolean) => {
    try {
      await fetch('/api/films/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filmId, liked })
      });
      console.log(`Film ${filmId} ${liked ? 'aimé' : 'retiré des favoris'}`);
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  const handleRateSlider = async (filmId: string, rating: number) => {
    try {
      await fetch('/api/films/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filmId, rating })
      });
      console.log(`Film ${filmId} noté ${rating}/100`);
    } catch (error) {
      console.error('Erreur lors de la notation:', error);
    }
  };

  const handleAddToRanking = async (filmId: string) => {
    try {
      await fetch('/api/films/ranking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filmId })
      });
      console.log(`Film ${filmId} ajouté au classement`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au classement:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center">
      <div className="max-w-6xl px-4 py-8 w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {categoryName} les mieux notés ({ratingSource === 'imdb' ? 'IMDB' : 'Catégorisé'})
        </h1>

        <div className="flex justify-center gap-4 mb-6">
                    <button
            onClick={() => setRatingSource('categorise')}
            className={`px-4 py-2 rounded transition ${
              ratingSource === 'categorise' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Voir par Catégorisation
          </button>
          <button
            onClick={() => setRatingSource('imdb')}
            className={`px-4 py-2 rounded transition ${
              ratingSource === 'imdb' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Voir par IMDB
          </button>

        </div>

        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : (
          <div className="flex flex-col items-center gap-6">
            {films.map((film: Film) => (
              <FilmCard
                key={film.id}
                film={film}
                ratingSource={ratingSource}
                onLike={handleLike}
                onRateSlider={handleRateSlider}
                onAddToRanking={handleAddToRanking}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}