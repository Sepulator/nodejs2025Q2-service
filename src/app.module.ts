import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [UserModule, DbModule, ArtistModule, AlbumModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
