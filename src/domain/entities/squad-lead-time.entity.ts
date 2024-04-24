import { ProjectLeadTime } from "./project-lead-time.entity";

export class SquadLeadTime {

    private squadId: string;
    private projects: ProjectLeadTime[];

    constructor(squadId: string, projects: ProjectLeadTime[]) {
        this.squadId = squadId;
        this.projects = projects;
    }

    public getSquadId(): string {
        return this.squadId;
    }

    public getProjects(): ProjectLeadTime[] {
        return this.projects;
    }
}