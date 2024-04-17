import { SetAppLastUpdateRequestDTO } from "src/application/dtos/set-app-last-update-request.dto";

export interface SetAppLastUpdateUseCase {
    execute(input: SetAppLastUpdateRequestDTO): Promise<void>;
}