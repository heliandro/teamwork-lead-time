import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JiraGateway } from "src/application/gateways/jira.gateway";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";

interface JiraRequestOptions {
    headers: { Authorization: string };
    queryParams?: { start?: number, limit?: number };
}

class JiraRequest {
    url: string;
    options: JiraRequestOptions;
    
    constructor(url: string, options: JiraRequestOptions) {
        this.url = url;
        this.options = options;
    }
}

@Injectable()
export class JiraImplGateway implements JiraGateway {
    private jiraBaseUrl: string;
    private jiraApiToken: string;
    private request: JiraRequest;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject('ConsoleLogger') private readonly logger: ConsoleLoggerService,
    ) {
        this.logger.setContext(JiraImplGateway.name);
        this.initEnv();
        this.initRequestConfigurations();
    }

    private initEnv() {
        this.jiraBaseUrl = this.configService.get<string>('JIRA_API_URL');
        this.jiraApiToken = this.configService.get<string>('JIRA_API_TOKEN');
    }

    private initRequestConfigurations() {
        this.request = new JiraRequest(
            `${this.jiraBaseUrl}/rest/api/latest/issue/__ISSUEID__`,
            {
                headers: {
                    Authorization: `Bearer ${this.jiraApiToken}`,
                },
                queryParams: {
                    limit: 200,
                },
            },
        );
    }

    async fetchIssue(issueId: string): Promise<any> {
        this.logger.log('recuperando informações extras do commit no Jira...');
        try {
            const url = this.request.url.replace('__ISSUEID__', issueId);
            const response = await this.httpService.axiosRef.get(
                url,
                { headers: this.request.options.headers }
            );
            this.logger.log('informações extras do commit no Jira recuperadas com sucesso!');
            return response.data;
        } catch (error) {
            this.logger.error(`error:: ${error}`);
            throw error;
        }
    }
}