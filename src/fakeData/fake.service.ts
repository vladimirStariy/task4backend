import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FakeDataRequest } from './dto/fake.request.dto';
import { FakePesronDto } from './dto/fake.person.dto';
import { corruptData, getRandomizedIndex } from './helpers/corruptor';
import { fakerEN_US, fakerRU, fakerPL } from '@faker-js/faker';

@Injectable()
export class FakeService {

    constructor() {}

    async generateData(fakeRequestDto: FakeDataRequest) {
        const resultSeed = fakeRequestDto.fakerSeed + fakeRequestDto.pageNumber;        
        const data: FakePesronDto[] = [];
        let alph = this.alphabetSwitcher(Number(fakeRequestDto.locale));
        const faker = this.localeSwitcher(Number(fakeRequestDto.locale));
        faker.seed(resultSeed);

        let errorsCount = 0;
        
        if(fakeRequestDto.errorOffset > 0) {
            if(Number.isInteger(fakeRequestDto.errorOffset)) {
                errorsCount = fakeRequestDto.errorOffset;
            } else {
                let variantPart = fakeRequestDto.errorOffset - Math.trunc(fakeRequestDto.errorOffset);
                errorsCount = Math.trunc(fakeRequestDto.errorOffset);
                const errorSeed = this.generateSeed(fakeRequestDto.errorOffset * resultSeed);
                if(getRandomizedIndex(errorSeed, 1 / variantPart) === 1) 
                    errorsCount += 1;
            }
        }

        for (let i = 0; i < fakeRequestDto.recordsCount; i++) {
            let fakePesron: FakePesronDto = new FakePesronDto(
                ((fakeRequestDto.pageNumber * fakeRequestDto.recordsCount)-(fakeRequestDto.recordsCount-(i+1))).toString(),
                faker.string.uuid(),
                faker.person.fullName(),
                `${faker.location.city()}, ${faker.location.streetAddress()}, ${faker.location.secondaryAddress()}`,
                faker.phone.number()
            );
            if(errorsCount > 0) {
                fakePesron = this.applyErrors(resultSeed, errorsCount, fakePesron, alph);
            }
            data.push(fakePesron);
        }

        return data;
    }

    private generateSeed = (value: number) => {
        const seedrandom = require('seedrandom');
        var commonGen = seedrandom(value);
        var seed = commonGen();
        return seed;
    }

    private applyErrors = (resultSeed: number, errorsCount: number, record: FakePesronDto, alph: string) => {
        let prev = 1; let ind = 0; let maxLen = 0;
        for(let x = 0; x < errorsCount; x++) { 
            const fieldSeed = this.generateSeed(errorsCount * resultSeed  / (x * Number(record.num) * 999 + 1));
            const errorTypeSeed = this.generateSeed(errorsCount * resultSeed * (prev * 100 ));
            prev = getRandomizedIndex(fieldSeed, Object.keys(record).length - 2) + 2;
            const value: string = record[`${Object.keys(record)[prev]}`];
            maxLen = value.length;
            const indexError = this.generateSeed(errorsCount + resultSeed * (maxLen + 10));
            record[`${Object.keys(record)[prev]}`] = corruptData(record[`${Object.keys(record)[prev]}`], errorTypeSeed, indexError, maxLen, alph);
            ind++;
        }
        return record;
    }

    private localeSwitcher = (locale: number) => {
        switch(locale) {
            case 0: return fakerEN_US;
            case 1: return fakerRU;
            case 2: return fakerPL;
        }
    }

    private alphabetSwitcher = (locale: number) => {
        switch(locale) {
            case 0: return 'lat';
            case 1: return 'cyr';
            case 2: return 'lat';
        }
    }
}

