/*
  Warnings:

  - You are about to drop the column `favoritesId` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `favoritesId` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `favoritesId` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the `Favorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_favoritesId_fkey";

-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_favoritesId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_favoritesId_fkey";

-- DropIndex
DROP INDEX "User_login_key";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "favoritesId";

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "favoritesId",
ALTER COLUMN "grammy" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "favoritesId";

-- DropTable
DROP TABLE "Favorites";

-- CreateTable
CREATE TABLE "AlbumFavorites" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,

    CONSTRAINT "AlbumFavorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackFavorites" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "TrackFavorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistFavorites" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "ArtistFavorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlbumFavorites_albumId_key" ON "AlbumFavorites"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackFavorites_trackId_key" ON "TrackFavorites"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistFavorites_artistId_key" ON "ArtistFavorites"("artistId");

-- AddForeignKey
ALTER TABLE "AlbumFavorites" ADD CONSTRAINT "AlbumFavorites_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackFavorites" ADD CONSTRAINT "TrackFavorites_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistFavorites" ADD CONSTRAINT "ArtistFavorites_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
