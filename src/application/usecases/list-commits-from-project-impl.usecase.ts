import { Inject } from '@nestjs/common';
import { CommitRepository } from 'src/infrastructure/repositories/commit.repository';
import { ConsoleLoggerService } from 'src/utils/services/console-logger.service';
import { ListCommitsFromProjectInputDTO } from '../dtos/list-commits-from-project-input.dto';
import { ListCommitsFromProjectOutputDTO } from '../dtos/list-commits-from-project-output.dto';
import { ListCommitsFromProjectUseCase } from './interfaces/list-commits-from-project.usecase';
import { ListProjectsUseCase } from './interfaces/list-projects.usecase';

export class ListCommitsFromProjectImplUseCase implements ListCommitsFromProjectUseCase {
    constructor(
        @Inject('ConsoleLogger') private readonly logger: ConsoleLoggerService,
        @Inject('CommitRepository') private readonly commitRepository: CommitRepository,
        @Inject('ListProjectsUseCase') private readonly listProjectsUseCase: ListProjectsUseCase,
    ) {
        this.logger.setContext(ListCommitsFromProjectImplUseCase.name);
    }

    async execute(input: ListCommitsFromProjectInputDTO): Promise<ListCommitsFromProjectOutputDTO> {
        this.logger.log('iniciando listagem de commits de um projeto');

        const commits = await this.commitRepository.getAllByFields({ statusQueue: 'Em Processamento', projectId: input.projectId });

        if (!commits.length) {
            this.logger.log(`Nenhum commit encontrado para o projeto: ${input.projectId}`);
        }

        this.logger.log('listagem de commits de um projeto finalizada');
        return new ListCommitsFromProjectOutputDTO(commits);
    }
}