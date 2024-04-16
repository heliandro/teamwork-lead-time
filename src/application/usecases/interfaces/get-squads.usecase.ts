import { GetSquadsResponseSuccessDTO } from 'src/application/dtos/get-squads-response-success.dto';

export default interface GetSquadsUseCase {
    execute(): Promise<GetSquadsResponseSuccessDTO>;
}