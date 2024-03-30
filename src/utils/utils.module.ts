import { Module } from '@nestjs/common';
import { ConsoleLoggerService } from './services/console-logger.service';

@Module({
    providers: [{ provide: 'ConsoleLogger', useClass: ConsoleLoggerService }],
    exports: [{ provide: 'ConsoleLogger', useClass: ConsoleLoggerService }],
})
export class UtilsModule {}
