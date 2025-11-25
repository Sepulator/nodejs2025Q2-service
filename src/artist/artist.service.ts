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
    const artist = this.db.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    Object.assign(artist, updateArtistDto);
    return artist;
  }

  remove(id: string): void {
    const artistIndex = this.db.artists.findIndex((u) => u.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.db.artists.splice(artistIndex, 1);
    return;
  }
}
