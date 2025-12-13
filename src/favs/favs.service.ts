import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { FavoritesResponse } from 'src/favs/entities/fav.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<FavoritesResponse> {
    const favs: FavoritesResponse = { artists: [], albums: [], tracks: [] };

    const trackFavs = await this.prisma.trackFavorites.findMany({
      select: { track: true },
    });
    favs.tracks = trackFavs.map((fav) => fav.track);

    const artistFavs = await this.prisma.artistFavorites.findMany({
      select: { artist: true },
    });
    favs.artists = artistFavs.map((fav) => fav.artist);

    const albumFavs = await this.prisma.albumFavorites.findMany({
      select: { album: true },
    });
    favs.albums = albumFavs.map((fav) => fav.album);

    return favs;
  }

  async createTrackFavs(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }

    await this.prisma.trackFavorites.create({ data: { trackId: id } });

    return track;
  }

  async removeTrackFavs(id: string) {
    try {
      await this.prisma.trackFavorites.delete({ where: { trackId: id } });
    } catch (error) {
      throw new NotFoundException('Track not found');
    }
  }

  async createAlbumFavs(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }

    await this.prisma.albumFavorites.create({ data: { albumId: id } });

    return album;
  }

  async removeAlbumFavs(id: string) {
    try {
      await this.prisma.albumFavorites.delete({ where: { albumId: id } });
    } catch (error) {
      throw new NotFoundException('Album not found');
    }
  }

  async createArtistFavs(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }

    await this.prisma.artistFavorites.create({ data: { artistId: id } });

    return artist;
  }

  async removeArtistFavs(id: string) {
    try {
      await this.prisma.artistFavorites.delete({ where: { artistId: id } });
    } catch (error) {
      throw new NotFoundException('Artist not found');
    }
  }
}
