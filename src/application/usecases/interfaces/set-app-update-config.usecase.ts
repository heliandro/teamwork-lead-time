import { SetAppUpdateConfigInputDTO } from "src/application/dtos/set-app-update-config-input.dto";

export interface SetAppUpdateConfigUseCase {
    execute(input: SetAppUpdateConfigInputDTO): Promise<void>;
}