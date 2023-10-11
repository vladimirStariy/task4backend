import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize'
import { User } from './user.model';
import { RegisterUserDto } from './dto/user-register-dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async registerUser(dto: RegisterUserDto) {
        const user = await this.userRepository.create(dto);
        this.updateLastLogin(user.id);
        return user;
    }

    async updateLastLogin(id: number) {
        const user = await this.userRepository.findByPk(id);
        user.lastLogin = new Date();
        await user.save();
        return user;
    }

    async getUsers() {
        const users = await this.userRepository.findAll();
        let usersDto: UserDto[] = [];
        users.forEach(elem => {
            let userDto: UserDto = new UserDto();
            userDto.email = elem.email;
            userDto.id = elem.id;
            userDto.isBanned = elem.isBanned;
            userDto.name = elem.name;

            const registeredAt = new Date(elem.registeredAt);
            const lastLogin = new Date(elem.lastLogin);

            userDto.lastLogin = `${lastLogin.toLocaleTimeString()}, ${lastLogin.toLocaleDateString()}`
            userDto.registeredAt = `${registeredAt.toLocaleTimeString()}, ${lastLogin.toLocaleDateString()}`

            usersDto.push(userDto);
        });
        return usersDto;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})
        return user;
    }

    async removeUser(id: number)
    {
        await this.userRepository.destroy({where: {id}});
    }

    async removeRange(userIds: number[])
    {
        await userIds.forEach(id => {
            this.userRepository.destroy({where: {id}});
        });
    }

    async blockRange(userIds: number[])
    {
        for(let id of userIds) {
            const user = await this.userRepository.findOne({where: {id}, include: {all: true}});
            if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            user.isBanned = true;
            await user.save();
        }
    }

    async unblockRange(userIds: number[])
    {
        for(let id of userIds) {
            const user = await this.userRepository.findOne({where: {id}, include: {all: true}});
            if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            user.isBanned = false;
            await user.save();
        }
    }

    async banUser(id: number)
    {
        const user = await this.userRepository.findByPk(id);
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        user.isBanned = true;
        await user.save();
        return user;
    }
}
