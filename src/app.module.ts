import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavsModule } from './favs/favs.module';
import { PrismaModule } from './prisma/prisma.module';
import { DbModule } from './db/db.module';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [UserModule, ArtistModule, AlbumModule, TrackModule, FavsModule, PrismaModule, DbModule, LoggingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
