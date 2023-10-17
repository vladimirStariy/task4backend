export class FakePesronDto {
    num: string;
    id: string;
    fullName: string;
    adress: string;
    phone: string;

    constructor(num: string, id: string, fullName: string, adress: string, phone: string) {
        this.num = num;
        this.id = id;
        this.fullName = fullName;
        this.adress = adress;
        this.phone = phone;
    }
}