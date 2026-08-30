-- Artists become records of their own, pointed at from the catalogue and the
-- programme, instead of a name repeated on every artwork and a biography
-- repeated on every exhibition. The names already in both tables are carried
-- across rather than dropped: each distinct one becomes an artist, and the
-- biography and portrait an exhibition was holding move onto the artist it was
-- describing.

-- CreateTable
CREATE TABLE "artists" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "portrait" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exhibition_artists" (
    "exhibitionId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "exhibition_artists_pkey" PRIMARY KEY ("exhibitionId","artistId")
);

-- CreateIndex
CREATE UNIQUE INDEX "artists_slug_key" ON "artists"("slug");

-- CreateIndex
CREATE INDEX "artists_name_idx" ON "artists"("name");

-- CreateIndex
CREATE INDEX "exhibition_artists_artistId_idx" ON "exhibition_artists"("artistId");

-- The same slug rule `lib/admin/content` applies, in SQL: lowercase, runs of
-- anything but a letter or a digit collapsed to a hyphen, ends trimmed.
CREATE FUNCTION pg_temp.artist_slug(name TEXT) RETURNS TEXT AS $$
  SELECT trim(both '-' from lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')));
$$ LANGUAGE SQL IMMUTABLE;

-- Every name either table already holds becomes an artist. Two names that slug
-- alike are one artist, which is the point of slugging them.
INSERT INTO "artists" ("id", "slug", "name", "updatedAt")
SELECT gen_random_uuid()::text, pg_temp.artist_slug(named.name), named.name, CURRENT_TIMESTAMP
FROM (
    SELECT DISTINCT "artist" AS name FROM "artworks" WHERE trim("artist") <> ''
    UNION
    SELECT DISTINCT "artist" AS name FROM "exhibitions" WHERE trim("artist") <> ''
) AS named
ON CONFLICT ("slug") DO NOTHING;

-- The biography and portrait an exhibition carried belong to its artist. Where
-- several exhibitions describe the same person, the first non-empty one wins —
-- they are copies of each other in the seed, and a human settles the rest.
UPDATE "artists" a
SET "bio" = source."artistBio", "portrait" = source."artistProfile"
FROM (
    SELECT DISTINCT ON (pg_temp.artist_slug("artist"))
        pg_temp.artist_slug("artist") AS "slug", "artistBio", "artistProfile"
    FROM "exhibitions"
    WHERE trim("artist") <> ''
    ORDER BY pg_temp.artist_slug("artist"), ("artistBio" = '') ASC, "updatedAt" DESC
) AS source
WHERE a."slug" = source."slug" AND a."bio" = '';

-- AlterTable: artworks point at an artist instead of naming one
ALTER TABLE "artworks" ADD COLUMN "artistId" TEXT;

UPDATE "artworks" w
SET "artistId" = a."id"
FROM "artists" a
WHERE a."slug" = pg_temp.artist_slug(w."artist");

ALTER TABLE "artworks" DROP COLUMN "artist";

-- CreateIndex
CREATE INDEX "artworks_artistId_idx" ON "artworks"("artistId");

-- The programme's artists become links, one per exhibition as it stands today.
INSERT INTO "exhibition_artists" ("exhibitionId", "artistId", "position")
SELECT e."id", a."id", 0
FROM "exhibitions" e
JOIN "artists" a ON a."slug" = pg_temp.artist_slug(e."artist")
ON CONFLICT DO NOTHING;

-- AlterTable: the exhibition's own artist columns have moved
ALTER TABLE "exhibitions" DROP COLUMN "artist";
ALTER TABLE "exhibitions" DROP COLUMN "artistBio";
ALTER TABLE "exhibitions" DROP COLUMN "artistProfile";

-- AddForeignKey
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibition_artists" ADD CONSTRAINT "exhibition_artists_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "exhibitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibition_artists" ADD CONSTRAINT "exhibition_artists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
