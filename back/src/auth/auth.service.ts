import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs/promises';
import * as path from 'path';

// src/auth/auth.types.ts
export interface User {
  username: string;
  id: number;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private filePath = path.join(process.cwd(), 'data', 'users.json');

  constructor(private jwtService: JwtService) {}

  // Lire les utilisateurs
  private async readUsers(): Promise<User[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  // Écrire les utilisateurs
  private async writeUsers(users: User[]) {
    await fs.writeFile(this.filePath, JSON.stringify(users, null, 2));
  }

  async getUserById(id: number): Promise<Omit<User, 'password'> | null> {
    const users = await this.readUsers();
    const user = users.find(u => u.id === id);
    if (!user) return null;

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async register(username: string, email: string, password: string) {
    const users = await this.readUsers();

    // Vérifier si email existe
    if (users.some(u => u.email === email)) {
      throw new Error('Email déjà utilisé');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user: User = {
      id: Date.now(),
      username,
      email,
      password: hashed,
    };

    users.push(user);
    await this.writeUsers(users);

    return { message: 'Compte créé', user: { id: user.id, email: user.email } };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const users = await this.readUsers();
    const user = users.find(u => u.email === email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) return null;

    const payload = { username: user.username, email: user.email, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: { username: user.username, id: user.id, email: user.email },
    };
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.readUsers();
    return users.map(({ password, ...safeUser }) => safeUser);
  }
}