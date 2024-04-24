import { LeadTime } from "./lead-time.entity";

export class ProjectLeadTime {

    private projectId: string;
    private jiraIssues: LeadTime[];

    constructor(projectId: string, jiraIssues: LeadTime[]) {
        this.projectId = projectId;
        this.jiraIssues = jiraIssues;
    }
}