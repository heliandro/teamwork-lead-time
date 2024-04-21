import { ListProjectsInputDTO } from "src/application/dtos/list-projects-input.dto";
import { ListProjectsOutputSuccessDTO } from "src/application/dtos/list-projects-output-success.dto";

export interface ListProjectsUseCase {
    execute(input?: ListProjectsInputDTO): Promise<ListProjectsOutputSuccessDTO>;
}