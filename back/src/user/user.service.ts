import { Injectable, NotFoundException } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class UserService {

    constructor(private authService: AuthService) {}

    async get(id: string) {
        const user = this.authService.getUserById(Number(id))

        if(!user) {
            throw new NotFoundException("User not found")
        }

        return user;
    }

}