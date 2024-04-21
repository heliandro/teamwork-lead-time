import { RabbitSubscribe, Nack, AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class CommitConsumerQueue {
    constructor(private readonly amqpConnection: AmqpConnection) {
        console.log('CommitConsumerQueue');
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
    public async pubSubHandler(message: any, amqpMessage: ConsumeMessage){
        console.log(`Received subscribe 222: ${JSON.stringify(message)}`);
        // console.log(`Received message: ${JSON.stringify(amqpMessage)}`);
        // return new Nack(false); // enviar para dead letter
    }

    @RabbitSubscribe({
        exchange: 'dead_letter_bitbucket_commits_exchange',
        routingKey: 'bitbucket.commits.get.*',
        queue: 'dead_letter_dataloader_bitbucket_commits_queue',
    })
    public async handleDeadLetterMessages(message: any, amqpMessage: ConsumeMessage) {
        console.log(`Received dead letter message: ${JSON.stringify(message)}`);
    }
}