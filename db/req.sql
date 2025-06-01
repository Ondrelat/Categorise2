SELECT *
FROM anime a
WHERE a.members::INTEGER > 30000
  AND NOT EXISTS (
    SELECT 1
    FROM article_classement ac
    WHERE LOWER(ac.titre_original) = LOWER(a.name)
);


UPDATE article_classement
SET primary_title = movies.primarytitle
FROM movies
WHERE article_classement.id = movies.tconst;


CREATE TABLE movies (
    tconst TEXT PRIMARY KEY,
    titleType TEXT,
    primaryTitle TEXT,
    originalTitle TEXT,
    isAdult BOOLEAN,
    startYear INTEGER,
    endYear INTEGER,
    runtimeMinutes INTEGER,
    genres TEXT
);

BEGIN;

-- Insertion si name correspond exactement à titre_original ou titre_en, et plus de 30 000 membres
INSERT INTO "ArticleClassementCategory" ("articleId", "categoryId")
SELECT ac.id, '7ba9dbf0-4382-44c8-8561-66e0ae2079ab'
FROM anime a
JOIN article_classement ac
  ON ac.titre_original = a.name
     OR ac.titre_en = a.name
WHERE a.members::INTEGER > 30000
  AND NOT EXISTS (
    SELECT 1 FROM "ArticleClassementCategory" acc
    WHERE acc."articleId" = ac.id AND acc."categoryId" = '7ba9dbf0-4382-44c8-8561-66e0ae2079ab'
  );

-- Suppression des animes qui ont un match avec article_classement
DELETE FROM anime
WHERE members::INTEGER > 30000
  AND EXISTS (
    SELECT 1
    FROM article_classement ac
    WHERE ac.titre_original = anime.name
       OR ac.titre_en = anime.name
  );

COMMIT;

SELECT * 
FROM public."ArticleClassementCategory"
WHERE "categoryId" ILIKE '7ba%';
                                                  