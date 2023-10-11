import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cors from 'cors'

async function start() {
    const PORT = '5000';
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*',
    });

    const config = new DocumentBuilder()
        .setTitle('Task 4')
        .setDescription('Task 4 backend with Nest JS')
        .setVersion('1.0.0')
        .addTag('Vladimir Starovoyt')
        .addBearerAuth()
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);

    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

start();