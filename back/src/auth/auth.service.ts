import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

// src/auth/auth.types.ts
export interface User {
  username: string;
  id: number;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private users:User[] = [];

  getUserById(id: number): Omit<User, 'password'> | null {
    const user = this.users.find(u => u.id === id);
    if (!user) return null;

    const { password, ...safeUser } = user;
    return safeUser;
  }

  constructor(private jwtService: JwtService) {}

  async register(username:string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = { id: Date.now(), username, email, password: hashed };
    this.users.push(user);
    return { message: 'Compte créé', user: { id: user.id, email: user.email } };
  }

  async validateUser(email: string, password: string) {
    const user = this.users.find(u => u.email === email);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) return null;

    const payload = { username: user.username, email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: { username: user.username, id: user.id, email: user.email },
    };
  }
}