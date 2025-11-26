import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { InMemoryDbService } from 'src/db/in-memory-db.service';
import { Track } from 'src/track/entities/track.entity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class TrackService {
  constructor(private db: InMemoryDbService) {}

  create(createTrackDto: CreateTrackDto) {
    const newTrack: Track = {
      id: randomUUID(),
      ...createTrackDto,
      albumId: createTrackDto.albumId ?? null,
      artistId: createTrackDto.artistId ?? null,
    };
    this.db.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return this.db.tracks;
  }

  findOne(id: string) {
    const track = this.db.tracks.find((t) => t.id === id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.findOne(id);

    Object.assign(track, updateTrackDto);

    return track;
  }

  remove(id: string) {
    this.findOne(id);

    this.db.tracks = this.db.tracks.filter((t) => t.id !== id);
    this.db.favs.tracks = this.db.favs.tracks.filter((trackId) => trackId !== id);

    return;
  }
}
