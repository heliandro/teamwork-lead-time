import { SetProjectsInputDTO } from "src/application/dtos/set-projects-input.dto";

export interface SetProjectsUseCase {
    execute(input: SetProjectsInputDTO): Promise<void>;
}