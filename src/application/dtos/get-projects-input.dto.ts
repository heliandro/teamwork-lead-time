export class GetProjectsInputDTO {

    projectIds?: string[];

    constructor(projectIds?: string[]) {
        this.projectIds = projectIds;
    }
}