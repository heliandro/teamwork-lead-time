import HealthOutputDTO from 'src/application/dtos/health-output.dto';

export default interface HealthUseCase {
    execute(): HealthOutputDTO;
}
