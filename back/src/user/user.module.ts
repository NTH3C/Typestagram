import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule], // pour utiliser AuthService
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}