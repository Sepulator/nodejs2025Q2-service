import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { ArtistModule } from './artist/artist.module';

@Module({
  imports: [UserModule, DbModule, ArtistModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
