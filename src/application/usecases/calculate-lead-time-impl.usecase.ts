import { SquadLeadTime } from './../../domain/entities/squad-lead-time.entity';
import { Inject, Injectable } from "@nestjs/common";
import { CalculateLeadTimeUseCase } from "./interfaces/calculate-lead-time.usecase";
import { SquadRepository } from "src/infrastructure/repositories/squad.repository";
import { CalculateLeadTimeInputDTO } from "../dtos/calculate-lead-time-input.dto";
import { CalculateLeadTimeOutputDTO } from "../dtos/calculate-lead-time-output.dto";
import { CommitRepository } from "src/infrastructure/repositories/commit.repository";
import { ConsoleLoggerService } from "src/utils/services/console-logger.service";
import { CommitDocument } from "src/domain/schemas/commit.schema";
import { SquadDocument } from "src/domain/schemas/squad.schema";
import { ProjectLeadTime } from 'src/domain/entities/project-lead-time.entity';
import { LeadTime, LeadTimeBuilder } from 'src/domain/entities/lead-time.entity';


interface HistoryObjectMapped {
    historyId: string,
    commits?: CommitDocument[]
}

interface ProjectObjectMapped {
    projectId: string,
    jiraIssues?: HistoryObjectMapped[]
}

interface SquadObjectMapped {
    squadId: string,
    projects?: ProjectObjectMapped[]
}

interface ProjectObject {
    projectId: string;
    commits: CommitDocument[];
}

interface SquadObject {
    squadId: string;
    projects: ProjectObject[];
}

@Injectable()
export class CalculateLeadTimeImplUseCase implements CalculateLeadTimeUseCase {
    constructor(
        @Inject('ConsoleLogger') private readonly logger: ConsoleLoggerService,
        @Inject('SquadRepository') private readonly squadRepository: SquadRepository,
        @Inject('CommitRepository') private readonly commitRepository: CommitRepository,
    ) {
        this.logger.setContext(CalculateLeadTimeImplUseCase.name);
    }

    async execute(input: CalculateLeadTimeInputDTO): Promise<CalculateLeadTimeOutputDTO> {
        this.logger.log(`executando caso de uso para calcular lead time`);
        console.log(`input: ${JSON.stringify(input, null, 2)}`);

        const squads = await this._getSquads();
        const allCommitsFromSquads: SquadObject[] = await this._getCommitsFromSquads(squads, input);
        const squadsProjectsWithCommitsGroupedByHistory: SquadObjectMapped[] = await this._groupSquadsProjectsCommitsByHistory(allCommitsFromSquads);
        const squadsLeadTime: SquadLeadTime[] = this._calculateLeadTime(squadsProjectsWithCommitsGroupedByHistory);
        return new CalculateLeadTimeOutputDTO(squadsLeadTime);
    }

    private async _getSquads(): Promise<any> {
        return this.squadRepository.getAll();
    }

    private async _getCommitsFromSquads(squads: SquadDocument[], input: CalculateLeadTimeInputDTO): Promise<SquadObject[]> {
        let squadsMap = new Map<string, { projectId: string, commits: CommitDocument[] }[]>();
        let squadLinkedProjectsMap = new Map<string, CommitDocument[]>();

        for (const squad of squads) {
            let commits: CommitDocument[] = [];
            for (const project of squad.linkedProjects) {
                commits = await this._getCommitsBySquad(squad.documentId, project.name, input);
                squadLinkedProjectsMap.set(project.name, commits);
            }
            squadsMap = this._linkProjectsCommitsToSquad(squad.documentId, squadLinkedProjectsMap, squadsMap);
        }

        return this._mapProjectsToSquads(squadsMap);
    }

    private async _getCommitsBySquad(squadId: string, projectId: string, input: CalculateLeadTimeInputDTO): Promise<CommitDocument[]> {
        const fields = { projectId, squadId, date: new Date(input.startDate) }
        const commits = await this.commitRepository.getAllByFieldsAndSortedByDate(fields, true);
        return commits;
    }

    private _linkProjectsCommitsToSquad(
        squadId: string, projectsMap: Map<string, CommitDocument[]>,
        squadsMap: Map<string, { projectId: string, commits: CommitDocument[] }[]>
    ): Map<string, { projectId: string, commits: CommitDocument[] }[]> {
        projectsMap.forEach((value, key) => {
            const project = {
                projectId: key,
                commits: value
            };
            if (squadsMap.has(squadId)) {
                const existingSquadProjects = squadsMap.get(squadId);
                existingSquadProjects.push(project);
                squadsMap.set(squadId, existingSquadProjects);
            } else {
                squadsMap.set(squadId, [project]);
            }
        });
        return squadsMap;
    }

    private _mapProjectsToSquads(squadsMap: Map<string, ProjectObject[]>): SquadObject[] {
        const squads: SquadObject[] = [];
        squadsMap.forEach((value, key) => {
            squads.push({
                squadId: key,
                projects: value
            });
        });
        return squads;
    }

    private _groupSquadsProjectsCommitsByHistory(squads: SquadObject[]): SquadObjectMapped[] {
        const newSquads: SquadObjectMapped[] = [];

        squads.forEach((squad: SquadObject) => {
            let newSquad: SquadObjectMapped = { squadId: squad.squadId, projects: [] };

            squad.projects.forEach((project: ProjectObject) => {
                const commits: HistoryObjectMapped[] = this._groupCommitsByHistory(project.commits);

                newSquad.projects.push({
                    projectId: project.projectId,
                    jiraIssues: commits
                })
            });
            newSquads.push(newSquad);
        });

        return newSquads;
    }

    private _groupCommitsByHistory(commits: CommitDocument[]): HistoryObjectMapped[] {
        let commitsDoProjeto: HistoryObjectMapped[] = [];

        const commitsMap = commits.reduce((acc, commit) => {
            if (acc.has(commit.jiraHistoryId)) {
                const grupo = acc.get(commit.jiraHistoryId);
                grupo.push(commit);
                acc.set(commit.jiraHistoryId, grupo);
            } else {
                acc.set(commit.jiraHistoryId, [commit]);
            }

            return acc;
        }, new Map<string, CommitDocument[]>());

        commitsMap.forEach((commits, historia) => {
            commitsDoProjeto.push({
                historyId: historia,
                commits
            });
        });

        return commitsDoProjeto;
    }

    private _calculateLeadTime(squads: SquadObjectMapped[]): SquadLeadTime[]  {
        let squadsLeadTime: SquadLeadTime[] = [];
        squads.forEach((squad: SquadObjectMapped) => {
            let projectsLeadTime: ProjectLeadTime[] = [];

            squad.projects.forEach((project: ProjectObjectMapped) => {
                
                let historiesLeadTime: LeadTime[] = [];

                project.jiraIssues.forEach((history: HistoryObjectMapped) => {
                    const oldestCommit = history.commits.reduce((acc, commit) => {
                        if (acc.date < commit.date)
                            return acc;
                        return commit;
                    }, history.commits[history.commits.length -1]);

                    const newestCommit = history.commits.reduce((acc, commit) => {
                        if (acc.date > commit.date)
                            return acc;
                        return commit;
                    }, history.commits[0]);

                    // const diff = newestCommit.date.getTime() - oldestCommit.date.getTime();
                    // const diffInDays = diff / (1000 * 60 * 60 * 24);
                    const lead = new LeadTime(
                        history.historyId,
                        oldestCommit.documentId,
                        newestCommit.documentId,
                        oldestCommit.date,
                        newestCommit.date,
                    );

                    historiesLeadTime.push(new LeadTimeBuilder()
                        .withJiraHistoryId(lead.getJiraHistoryId())
                        .withFirstCommitDate(lead.getFirstCommitDate())
                        .withLastCommitDate(lead.getLastCommitDate())
                        .withTimeInDays(lead.getTimeInDays())
                        .build()
                    )
                })
                projectsLeadTime.push(new ProjectLeadTime(project.projectId, historiesLeadTime))
                
            })
            squadsLeadTime.push(new SquadLeadTime(squad.squadId, projectsLeadTime));
            
        });

        return squadsLeadTime;
    }
}