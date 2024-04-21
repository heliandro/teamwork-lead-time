import { GetProjectsInputDTO } from "src/application/dtos/get-projects-input.dto";
import { GetProjectsOutputSuccessDTO } from "src/application/dtos/get-projects-output-success.dto";

export interface GetProjectsUseCase {
    execute(input?: GetProjectsInputDTO): Promise<GetProjectsOutputSuccessDTO>;
}