import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto) {
    const newTrack = await this.prisma.track.create({
      data: {
        ...createTrackDto,
        albumId: createTrackDto.albumId ?? null,
        artistId: createTrackDto.artistId ?? null,
      },
    });

    return newTrack;
  }

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    await this.findOne(id);

    const track = await this.prisma.track.update({
      where: { id },
      data: {
        ...updateTrackDto,
      },
    });

    return track;
  }

  async remove(id: string) {
    try {
      await this.prisma.track.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Track not found');
      }
      throw new ServiceUnavailableException('Could not delete track at this time');
    }

    return;
  }
}
