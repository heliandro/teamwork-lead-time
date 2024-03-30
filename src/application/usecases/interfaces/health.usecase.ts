import HealthResponseDTO from 'src/application/dtos/health-response.dto';

export default interface HealthUseCase {
    execute(): HealthResponseDTO;
}
