import { RegisterProjectsInputDTO } from "src/application/dtos/register-projects-input.dto";

export interface RegisterProjectsUseCase {
    execute(input: RegisterProjectsInputDTO): Promise<void>;
}