import { GetAppUpdateConfigOutputSuccessDTO } from "src/application/dtos/get-app-update-config-output-success.dto";

export interface GetAppUpdateConfigUseCase {
    execute(): Promise<GetAppUpdateConfigOutputSuccessDTO>;
}