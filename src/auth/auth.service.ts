import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'
import { User } from 'src/users/user.model';
import { RegisterUserDto } from 'src/users/dto/user-register-dto';
import { LoginUserDto } from 'src/users/dto/user-login-dto';
import { UserLoginResponseDto } from 'src/users/dto/user.login.request.dto';

@Injectable()
export class AuthService {
   
    constructor(private userService: UsersService, private jwtService: JwtService) {}

    async login(loginDto: LoginUserDto) {
        const user = await this.validateUser(loginDto);
        await this.userService.updateLastLogin(user.id);
        const token = this.generateToken(user);
        const response: UserLoginResponseDto = new UserLoginResponseDto();
        response.id = user.id;
        response.name = user.name;
        response.token = (await token).token
        return response;
    }
    
    async register(registerDto: RegisterUserDto) {
        const user = await this.userService.getUserByEmail(registerDto.email);
        if(user) throw new HttpException("User with the same email already exists", HttpStatus.BAD_REQUEST);
        this.validateInput(registerDto);
        const hashPassword = await bcrypt.hash(registerDto.password, 10);
        const createdUser = await this.userService.registerUser({...registerDto, password: hashPassword});
        const token = this.generateToken(createdUser);
        const response: UserLoginResponseDto = new UserLoginResponseDto();
        response.id = createdUser.id;
        response.name = createdUser.name;
        response.token = (await token).token;
        return response;
    }

    private async generateToken(user: User) {
        const payload = {id: user.id, email: user.email}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: LoginUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        if(!user) throw new UnauthorizedException({message: 'No user with the same email.'});
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            if (user.isBanned) throw new UnauthorizedException({message: 'User is banned.'});
            return user;
        }
        console.log(user.isBanned)
        throw new UnauthorizedException({message: 'Invalid email or password.'});
    }

    private validateInput(registerDto: RegisterUserDto) {
        if(!registerDto.email.includes('@')) throw new HttpException('Invalid email adress.', HttpStatus.BAD_REQUEST);
        if(registerDto.name === '') throw new HttpException('Fill name.', HttpStatus.BAD_REQUEST);
        if(registerDto.password === '') throw new HttpException('Fill password.', HttpStatus.BAD_REQUEST);
        return true;
    }
}
