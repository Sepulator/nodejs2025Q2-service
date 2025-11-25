import { Injectable } from '@nestjs/common';
import { Artist } from 'src/artist/entities/artist.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class InMemoryDbService {
  users: User[] = [];
  artists: Artist[] = [];
}
