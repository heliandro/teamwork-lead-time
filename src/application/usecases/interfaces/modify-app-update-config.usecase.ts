import { ModifyAppUpdateConfigInputDTO } from "src/application/dtos/modify-app-update-config-input.dto";

export interface ModifyAppUpdateConfigUseCase {
    execute(input: ModifyAppUpdateConfigInputDTO): Promise<void>;
}