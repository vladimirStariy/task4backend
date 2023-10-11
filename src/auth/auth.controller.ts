import {Body, Controller, Get, Post, UseGuards, UsePipes} from '@nestjs/common';
import { LoginUserDto } from 'src/users/dto/user-login-dto';
import { RegisterUserDto } from 'src/users/dto/user-register-dto';
import { AuthService } from './auth.service';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { User } from 'src/users/user.model';

@Controller('')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: 'Login'})
    @ApiResponse({status: 200, type: ''})
    @Post('/login')
    login(@Body() loginDto: LoginUserDto) {
        
        return this.authService.login(loginDto)
    }
    
    @Post('/registration')
    registration(@Body() registerDto: RegisterUserDto) {
        return this.authService.register(registerDto);
    }
}
