import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = this.prisma.album.create({
      data: {
        ...createAlbumDto,
        artistId: createAlbumDto.artistId ?? null,
      },
    });

    return newAlbum;
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    await this.findOne(id);

    const album = this.prisma.album.update({
      where: { id },
      data: {
        ...updateAlbumDto,
      },
    });

    return album;
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.album.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Album not found');
      }

      throw new ServiceUnavailableException('Could not delete album at this time');
    }

    return;
  }
}
