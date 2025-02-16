import { getFilmsSortedByRating } from '@/app/lib/articles';
import FilmCard from './FilmCard';
import { Film } from '@/app/types';  


export default async function FilmsPage() {
  const films = await getFilmsSortedByRating();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Films Populaires</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {films.map((film: Film) => (
            <FilmCard 
              key={film.id} 
              film={film}
            />
          ))}
        </div>
      </div>
    </main>
  );
}