import { GetSquadsOutputSuccessDTO } from 'src/application/dtos/get-squads-output-success.dto';

export default interface GetSquadsUseCase {
    execute(): Promise<GetSquadsOutputSuccessDTO>;
}