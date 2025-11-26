import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InMemoryDbService } from 'src/db/in-memory-db.service';
import { FavoritesResponse } from 'src/favs/entities/fav.entity';

@Injectable()
export class FavsService {
  constructor(private db: InMemoryDbService) {}

  findAll() {
    const favs: FavoritesResponse = { artists: [], albums: [], tracks: [] };

    this.db.favs.tracks.forEach((trackId) => {
      const track = this.db.tracks.find((t) => t.id === trackId);
      if (track) {
        favs.tracks.push(track);
      }
    });

    this.db.favs.artists.forEach((artistId) => {
      const artist = this.db.artists.find((a) => a.id === artistId);
      if (artist) {
        favs.artists.push(artist);
      }
    });

    this.db.favs.albums.forEach((albumId) => {
      const album = this.db.albums.find((a) => a.id === albumId);
      if (album) {
        favs.albums.push(album);
      }
    });

    return favs;
  }

  createTrackFavs(id: string) {
    const track = this.db.tracks.find((t) => t.id === id);

    console.log(track);

    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }

    this.db.favs.tracks.push(id);

    return track;
  }

  removeTrackFavs(id: string) {
    const trackIndex = this.db.favs.tracks.findIndex((t) => t === id);

    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    this.db.favs.tracks.splice(trackIndex, 1);
    return;
  }

  createAlbumFavs(id: string) {
    const album = this.db.albums.find((t) => t.id === id);

    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }
    this.db.favs.albums.push(id);

    return album;
  }

  removeAlbumFavs(id: string) {
    const albumIndex = this.db.favs.albums.findIndex((a) => a === id);

    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    this.db.favs.albums.splice(albumIndex, 1);
    return;
  }

  createArtistFavs(id: string) {
    const artist = this.db.artists.find((a) => a.id === id);

    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }
    this.db.favs.artists.push(id);

    return artist;
  }

  removeArtistFavs(id: string) {
    const artistIndex = this.db.favs.artists.findIndex((a) => a === id);

    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.db.favs.artists.splice(artistIndex, 1);
    return;
  }
}
