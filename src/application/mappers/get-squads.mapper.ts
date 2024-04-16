import { Squad, SquadBuilder } from "src/domain/entities/squad.entity";

export default class GetSquadsMapper {
    static toGetSquadsResponseDTO(squads: Squad[]): Squad[] {

        if (!squads.length) {
            return [];
        }

        let response: Squad[] = squads.map((squad: Squad) => {
            return new SquadBuilder()
                .setDocumentId(squad.getDocumentId())
                .setName(squad.getName())
                .setLinkedProjects(squad.getLinkedProjects())
                .build()
        });

        return response;
    }
}