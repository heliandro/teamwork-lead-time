import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class ConsoleLoggerService extends ConsoleLogger {
    private printLog(
        message: string,
        level: string = 'log',
        trace?: any,
        otherContext?: string,
    ) {
        const timestamp = new Date().toISOString();
        const logObject = {
            timestamp,
            level,
            className: this.context,
            context: otherContext,
            message,
        };

        if (trace) {
            logObject['trace'] = trace;
        }

        const logJSON = JSON.stringify(logObject);
        const logJSONFormatted = logJSON.replace(/(":|,)/g, ($1) => `${$1} `);

        console.log(logJSONFormatted);
    }

    log(message: string, context?: string) {
        this.printLog(message, 'log', null, context);
    }

    error(message: string, trace?: any, context?: string) {
        this.printLog(message, 'error', trace, context);
    }

    warn(message: string, context?: string) {
        this.printLog(message, 'warn', null, context);
    }

    debug(message: string, context?: string) {
        this.printLog(message, 'debug', null, context);
    }

    verbose(message: string, context?: string) {
        this.printLog(message, 'verbose', null, context);
    }
}
