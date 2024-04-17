import { GetProjectsRequestDTO } from "src/application/dtos/get-projects-request.dto";
import { GetProjectsResponseSuccessDTO } from "src/application/dtos/get-projects-response-success.dto";

export interface GetProjectsUseCase {
    execute(input?: GetProjectsRequestDTO): Promise<GetProjectsResponseSuccessDTO>;
}