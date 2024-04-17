import { GetAppLastUpdateResponseSuccessDTO } from "src/application/dtos/get-app-last-update-response-success.dto";

export interface GetAppLastUpdateUseCase {
    execute(): Promise<GetAppLastUpdateResponseSuccessDTO>;
}