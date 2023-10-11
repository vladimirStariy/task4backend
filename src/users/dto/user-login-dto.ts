import {ApiProperty} from "@nestjs/swagger";

export class LoginUserDto {
    @ApiProperty({example: 'user@mail.ru', description: 'User email'})
    readonly email: string;
    @ApiProperty({example: 'password', description: 'User password'})
    readonly password: string;
}