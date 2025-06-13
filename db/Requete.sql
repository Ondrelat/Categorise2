SELECT * FROM public.article_classement
WHERE article_classement."titleType" != 'movie';

SELECT DISTINCT "titleType" FROM article_classement

UPDATE "article_classement" ac
SET "categoryId" = c."id"
FROM "Categories" c
WHERE
  (
    (ac."titleType" IN ('short', 'tvShort') AND c."name" = 'Short')
    OR (ac."titleType" IN ('movie', 'tvMovie') AND c."name" = 'Film')
    OR (ac."titleType" IN ('tvMiniSeries') AND c."name" = 'Mini Série')
    OR (ac."titleType" IN ('tvEpisode') AND c."name" = 'Épisode')
    OR (ac."titleType" IN ('tvSeries') AND c."name" = 'Série')
    OR (ac."titleType" = 'videoGame' AND c."name" = 'Jeu vidéo')
    OR (ac."titleType" IN ('video') AND c."name" = 'Vidéo')
  );