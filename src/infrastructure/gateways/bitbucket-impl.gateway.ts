import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { ConsoleLoggerService } from 'src/utils/services/console-logger.service';

export interface BitbucketGateway {
    getProjects(): Promise<any>;
    // getCommits(repository: string): Promise<string[]>;
}

@Injectable()
export class BitbucketImplGateway implements BitbucketGateway {
    private env: {
        baseUrl: string;
        projectSlug: string;
        apiToken: string;
    };

    private queryParamConfig = {
        projectsLimit: 200,
    };

    private url: {
        repositories: string;
    };

    private requestHeaders: {
        headers: any;
    };

    constructor(
        private httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject('ConsoleLogger') private readonly logger: ConsoleLoggerService,
    ) {
        this.logger.setContext(BitbucketImplGateway.name);
        this.env = {
            baseUrl: this.configService.get<string>('BITBUCKET_API_URL'),
            projectSlug: this.configService.get<string>(
                'BITBUCKET_PROJECT_SLUG',
            ),
            apiToken: this.configService.get<string>('BITBUCKET_API_TOKEN'),
        };
        this.url = {
            repositories: `${this.env.baseUrl}/rest/api/latest/projects/${this.env.projectSlug}/repos`,
        };
        this.requestHeaders = {
            headers: {
                Authorization: `Bearer ${this.env.apiToken}`,
            },
        };
    }

    async getProjects(): Promise<any[]> {
        this.logger.log('recuperando projetos do bitbucket...');
        const queryParameters = `?start=0&limit=${this.queryParamConfig.projectsLimit}`;

        const response = await this.httpService.axiosRef.get(
            `${this.url.repositories}${queryParameters}`,
            this.requestHeaders,
        );

        const projects = await this._getAllProjects(response);
        this.logger.log(`${projects.length} projetos do bitbucket foram recuperados com sucesso!`);

        return projects;
    }

    private async _getAllProjects(response: AxiosResponse<any>): Promise<any[]> {
        const projects = [...response.data.values];

        if (response.data.isLastPage) {
            return projects;
        }

        this.logger.log('a consulta está paginada, recuperando os demais projetos...');

        let isLastPage = false;
        let startPage = response.data.nextPageStart;

        while (!isLastPage) {
            const nextPageQueryParameters = `?start=${startPage}&limit=${this.queryParamConfig.projectsLimit}`;
            const nextPageResponse = await this.httpService.axiosRef.get(
                `${this.url.repositories}${nextPageQueryParameters}`,
                this.requestHeaders,
            );

            projects.push(...nextPageResponse.data.values);
            isLastPage = nextPageResponse.data.isLastPage;
            startPage = nextPageResponse.data.nextPageStart;
            const { values, ...resto } = nextPageResponse.data;
        }

        return projects;
    }

    // async getCommits(repository: string): Promise<any[]> {
    //     const response: { data: any[] } = await this.httpService
    //         .get(`${this.baseUrl}/repositories/${repository}/commits`)
    //         .toPromise();
    //     return response.data;
    // }
}
