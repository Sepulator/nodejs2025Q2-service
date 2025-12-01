import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InMemoryDbService } from 'src/db/in-memory-db.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class ArtistService {
  constructor(private db: InMemoryDbService) {}

  create(createArtistDto: CreateArtistDto) {
    const artist = { ...createArtistDto, id: randomUUID() };

    this.db.artists.push(artist);

    return artist;
  }

  findAll() {
    return this.db.artists;
  }

  findOne(id: string) {
    const artist = this.db.artists.find((a) => a.id === id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.findOne(id);

    Object.assign(artist, updateArtistDto);

    return artist;
  }

  remove(id: string): void {
    this.findOne(id);

    this.db.artists = this.db.artists.filter((a) => a.id !== id);

    for (const album of this.db.albums) {
      if (album.artistId === id) {
        album.artistId = null;
      }
    }

    for (const track of this.db.tracks) {
      if (track.artistId === id) {
        track.artistId = null;
      }
    }

    this.db.favs.artists = this.db.favs.artists.filter((artistId) => artistId !== id);

    return;
  }
}
