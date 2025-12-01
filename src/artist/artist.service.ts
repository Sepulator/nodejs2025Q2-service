import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto) {
    const artist = await this.prisma.artist.create({
      data: {
        ...createArtistDto,
      },
    });

    return artist;
  }

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.prisma.artist.update({
      where: { id },
      data: {
        ...updateArtistDto,
      },
    });

    return artist;
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.artist.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Artist not found');
      }
      throw new ServiceUnavailableException('Could not delete artist at this time');
    }

    return;
  }
}
