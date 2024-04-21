import { RabbitSubscribe, Nack, AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Inject, Injectable } from "@nestjs/common";
import { ConsumeMessage } from 'amqplib';
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";

@Injectable()
export class CommitConsumerQueue {
    constructor(
        @Inject('ConsoleLogger') private readonly logger: ConsoleLoggerService,
    ) {
        this.logger.setContext(CommitConsumerQueue.name);
    }

    @RabbitSubscribe({
        exchange: 'bitbucket_commits_exchange',
        routingKey: 'bitbucket.commits.get.*',
        queue: 'dataloader_bitbucket_commits_queue',
        queueOptions: {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': 'dead_letter_bitbucket_commits_exchange',
                'x-dead-letter-routing-key': 'bitbucket.commits.get.*',
            },
        }
    })
    public async pubSubHandler(message: any, amqpMessage: ConsumeMessage) {
        this.logger.log(`received message: ${JSON.stringify(message)}`);
        // console.log(`Received message: ${JSON.stringify(amqpMessage)}`);
        // return new Nack(false); // enviar para dead letter
    }

    @RabbitSubscribe({
        exchange: 'dead_letter_bitbucket_commits_exchange',
        routingKey: 'bitbucket.commits.get.*',
        queue: 'dead_letter_dataloader_bitbucket_commits_queue',
    })
    public async handleDeadLetterMessages(message: any, amqpMessage: ConsumeMessage) {
        this.logger.error(`received message: ${JSON.stringify(message)}`);
        // console.log(`Received message: ${JSON.stringify(amqpMessage)}`);
    }
}