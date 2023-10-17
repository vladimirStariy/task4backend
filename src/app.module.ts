import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FakeModule } from "./fakeData/fake.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        FakeModule
    ],
    controllers: [],
    providers: []
})

export class AppModule {}