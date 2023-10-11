import {Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes} from '@nestjs/common';
import { RegisterUserDto } from './dto/user-register-dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Get('/users')
    @UseGuards(AuthGuard)
    getUsers() {
        return this.usersService.getUsers();
    }

    @Delete('/users/:id')
    @UseGuards(AuthGuard)
    removeUser(@Param() param) {
        return this.usersService.removeUser(param.id);
    }

    @Post('/removeUserRange')
    @UseGuards(AuthGuard)
    removeUserRange(@Body() userIds: number[]) {
        return this.usersService.removeRange(userIds);
    }

    @Post('/blockUserRange')
    @UseGuards(AuthGuard)
    blockUserRange(@Body() userIds: number[]) {
        return this.usersService.blockRange(userIds);
    }

    @Post('/unblockUserRange')
    @UseGuards(AuthGuard)
    unblockUserRange(@Body() userIds: number[]) {
        return this.usersService.unblockRange(userIds);
    }

    @Post('/block/:id')
    @UseGuards(AuthGuard)
    blockUser(@Param() param) {
        this.usersService.banUser(param.id);
        return 'success';
    }

    @Post('/unblock/:id')
    @UseGuards(AuthGuard)
    unblockUser(@Param() param) {
        this.usersService.banUser(param.id);
        return 'success';
    }
}
