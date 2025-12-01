import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavsModule } from './favs/favs.module';

@Module({
  imports: [UserModule, DbModule, ArtistModule, AlbumModule, TrackModule, FavsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
