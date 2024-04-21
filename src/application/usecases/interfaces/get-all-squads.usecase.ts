import { GetAllSquadsOutputSuccessDTO } from 'src/application/dtos/get-all-squads-output-success.dto';

export default interface GetAllSquadsUseCase {
    execute(): Promise<GetAllSquadsOutputSuccessDTO>;
}