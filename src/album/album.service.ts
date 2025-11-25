import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InMemoryDbService } from 'src/db/in-memory-db.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AlbumService {
  constructor(private db: InMemoryDbService) {}

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = {
      id: randomUUID(),
      ...createAlbumDto,
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
    const album = this.db.albums.find((a) => a.id === id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    Object.assign(album, updateAlbumDto);
    return album;
  }

  remove(id: string): void {
    const album = this.db.albums.find((a) => a.id === id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    this.db.albums = this.db.albums.filter((a) => a.id !== id);

    return;
  }
}
