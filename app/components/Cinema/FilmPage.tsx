'use client';

import { useEffect, useState } from 'react';
import FilmCardIMDB from './FilmCardIMDB';
import FilmCardCategorise from './FilmCardCategorise';
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
              ratingSource === 'imdb' ? (
                <FilmCardIMDB
                  key={film.id}
                  film={film}
                  onLike={handleLike}
                  onRateSlider={handleRateSlider}
                  onAddToRanking={handleAddToRanking}
                />
              ) : (
                <FilmCardCategorise
                  key={film.id}
                  film={film}
                  onLike={handleLike}
                  onRateSlider={handleRateSlider}
                  onAddToRanking={handleAddToRanking}
                />
              )
            ))}
          </div>
        )}
      </div>
    </main>
  );
}