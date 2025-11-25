import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [UserModule, DbModule, ArtistModule, AlbumModule, TrackModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
