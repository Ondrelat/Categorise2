export interface Film {
  id: string;
  tconst: string | null;
  averageRatingIMDB: number | null;
  numVotesIMDB: number | null;
  titre_fr: string | null;
  titre_en: string | null;
  image_url: string | null;
  createdAt: Date;
}