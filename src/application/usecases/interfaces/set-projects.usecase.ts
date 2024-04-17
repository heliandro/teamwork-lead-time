import { SetProjectsRequestDTO } from "src/application/dtos/set-projects-request.dto";

export interface SetProjectsUseCase {
    execute(input: SetProjectsRequestDTO): Promise<void>;
}