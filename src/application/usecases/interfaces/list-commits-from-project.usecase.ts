import { ListCommitsFromProjectInputDTO } from "src/application/dtos/list-commits-from-project-input.dto";
import { ListCommitsFromProjectOutputDTO } from "src/application/dtos/list-commits-from-project-output.dto";

export interface ListCommitsFromProjectUseCase {
    execute(projectId: ListCommitsFromProjectInputDTO): Promise<ListCommitsFromProjectOutputDTO>;
}