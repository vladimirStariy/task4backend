import {Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes} from '@nestjs/common';
import { FakeService } from './fake.service';
import { FakeDataRequest } from './dto/fake.request.dto';

@Controller('')
export class FakeController {

    constructor(private fakeService: FakeService) {}

    @Post('/persons')
    getPersons(@Body() fakeDataRequest: FakeDataRequest) {
        return this.fakeService.generateData(fakeDataRequest);
    }
}
