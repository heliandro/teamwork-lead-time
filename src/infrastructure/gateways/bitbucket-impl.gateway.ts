import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { ConsoleLoggerService } from 'src/utils/services/console-logger.service';
import { BitbucketGateway } from 'src/application/gateways/bitbucket.gateway';

interface BitbucketRequestOptions {
    headers: { Authorization: string };
    queryParams: { limit: number };
}

class BitbucketRequest {
    url: string;
    options: BitbucketRequestOptions;
    
    constructor(url: string, options: BitbucketRequestOptions) {
        this.url = url;
        this.options = options;
    }
}

@Injectable()
export class BitbucketImplGateway implements BitbucketGateway {
    private bitbucketBaseUrl: string;
    private bitbucketProjectSlug: string;
    private bitbucketApiToken: string;
    private projectsRequest: BitbucketRequest
    private commitsRequest: BitbucketRequest

    constructor(
        private httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject('ConsoleLogger') private readonly logger: ConsoleLoggerService,
    ) {
        this.logger.setContext(BitbucketImplGateway.name);
        this.initEnv();
        this.initRequestConfigurations();
    }

    private initEnv() {
        this.bitbucketBaseUrl = this.configService.get<string>('BITBUCKET_API_URL');
        this.bitbucketProjectSlug = this.configService.get<string>(
            'BITBUCKET_PROJECT_SLUG',
        );
        this.bitbucketApiToken = this.configService.get<string>('BITBUCKET_API_TOKEN');
    }

    private initRequestConfigurations() {
        this.projectsRequest = new BitbucketRequest(
            `${this.bitbucketBaseUrl}/rest/api/latest/projects/${this.bitbucketProjectSlug}/repos`,
            {
                headers: {
                    Authorization: `Bearer ${this.bitbucketApiToken}`,
                },
                queryParams: {
                    limit: 200,
                },
            },
        );
        this.commitsRequest = new BitbucketRequest(
            `${this.bitbucketBaseUrl}/rest/api/latest/projects/${this.bitbucketProjectSlug}/repos/__PROJECTID__/commits`,
            {
                headers: {
                    Authorization: `Bearer ${this.bitbucketApiToken}`,
                },
                queryParams: {
                    limit: 1000,
                },
            },
        );
    }

    async fetchProjects(ids?: string[]): Promise<any[]> {
        this.logger.log('recuperando projetos do bitbucket...');

        let projects = await this._getProjectsPaginated();
        projects = this._filterProjects(projects, ids);

        this.logger.log(`${projects.length} projetos do bitbucket foram recuperados com sucesso!`);
        return projects;
    }

    private async _getProjectsPaginated(): Promise<any[]> {
        const queryParameters = `?start=0&limit=${this.projectsRequest.options.queryParams.limit}`;

        const response = await this.httpService.axiosRef.get(
            `${this.projectsRequest.url}${queryParameters}`,
            { headers: this.projectsRequest.options.headers }
        );

        const projects = await this._getProjectsNextPages(response);
        return projects;
    }

    private async _getProjectsNextPages(response: AxiosResponse<any>): Promise<any[]> {
        const projects = [...response.data.values];

        if (response.data.isLastPage) {
            return projects;
        }

        this.logger.log('a consulta está paginada, recuperando os demais projetos...');
        let isLastPage = false;
        let startPage = response.data.nextPageStart;

        while (!isLastPage) {
            const nextPageQueryParameters = `?start=${startPage}&limit=${this.projectsRequest.options.queryParams.limit}`;
            const nextPageResponse = await this.httpService.axiosRef.get(
                `${this.projectsRequest.url}${nextPageQueryParameters}`,
                { headers: this.projectsRequest.options.headers },
            );

            projects.push(...nextPageResponse.data.values);
            isLastPage = nextPageResponse.data.isLastPage;
            startPage = nextPageResponse.data.nextPageStart;
        }

        return projects;
    }

    private _filterProjects(projects: any[], ids: string[]): any[] {
        let filteredProjects = [];
        if (ids?.length > 0) {
            filteredProjects = projects.filter((project) => ids.includes(project.slug));
            return filteredProjects;
        }
        return projects;
    }

    async fetchCommits(projectId: string, limit?: number): Promise<any> {
        this.logger.log('recuperando commits do bitbucket...');

        let commitsUrl = this.commitsRequest.url.replace('__PROJECTID__', projectId);
        let queryLimit = limit ? limit : this.commitsRequest.options.queryParams.limit;
        const queryParameters = `?limit=${queryLimit}`;

        const response = await this.httpService.axiosRef.get(
            `${commitsUrl}${queryParameters}`,
            { headers: this.commitsRequest.options.headers }
        );

        this.logger.log('commits do bitbucket recuperados com sucesso!');
        return response.data;
    }
}
