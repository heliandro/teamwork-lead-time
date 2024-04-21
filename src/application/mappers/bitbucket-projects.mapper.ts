import { Project, ProjectBuilder } from "src/domain/entities/project.entity";

export class BitbucketProjectsMapper {
    static toEntity(bitbucketProjects: any[]): Project[] {
        return bitbucketProjects.map((bitbucketProject: any) => {
            return new ProjectBuilder()
                .withDocumentId(bitbucketProject.slug)
                .withName(bitbucketProject.name)
                .withGroup(bitbucketProject.project?.key)
                .build();
        });
    }
}