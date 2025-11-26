import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InMemoryDbService } from 'src/db/in-memory-db.service';
import { randomUUID } from 'crypto';
import { Album } from 'src/album/entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(private db: InMemoryDbService) {}

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum: Album = {
      id: randomUUID(),
      ...createAlbumDto,
      artistId: createAlbumDto.artistId ?? null,
    };

    this.db.albums.push(newAlbum);

    return newAlbum;
  }

  findAll() {
    return this.db.albums;
  }

  findOne(id: string) {
    const album = this.db.albums.find((a) => a.id === id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.findOne(id);

    Object.assign(album, updateAlbumDto);
    return album;
  }

  remove(id: string): void {
    this.findOne(id);

    this.db.albums = this.db.albums.filter((a) => a.id !== id);

    for (const track of this.db.tracks) {
      if (track.albumId === id) {
        track.albumId = null;
      }
    }

    return;
  }
}
