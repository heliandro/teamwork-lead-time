export class GetProjectsRequestDTO {

    projectIds?: string[];

    constructor(projectIds?: string[]) {
        this.projectIds = projectIds;
    }
}