export interface SquadMember {
    id?: string;
    name?: string;
    email?: string;
}
export class Squad {
    private documentId: string;
    private name: string;
    private members: SquadMember[];
    private linkedProjects: { name: string }[];

    constructor(documentId: string, name: string, members: SquadMember[], linkedProjects: { name: string }[]) {
        this.documentId = documentId;
        this.name = name;
        this.members = members;
        this.linkedProjects = linkedProjects;
    }

    getDocumentId(): string {
        return this.documentId;
    }

    getName(): string {
        return this.name;
    }

    getMembers(): SquadMember[] {
        return this.members;
    }

    getLinkedProjects(): { name: string }[] {
        return this.linkedProjects;
    }
}

export class SquadBuilder {
    private documentId: string;
    private name: string;
    private members: SquadMember[];
    private linkedProjects: { name: string }[];

    constructor() {
        this.documentId = '';
        this.name = '';
        this.members = [];
        this.linkedProjects = [];
    }

    withDocumentId(documentId: string): SquadBuilder {
        this.documentId = documentId;
        return this;
    }

    withName(name: string): SquadBuilder {
        this.name = name;
        return this;
    }

    withMembers(members: SquadMember[]): SquadBuilder {
        this.members = members;
        return this;
    }

    withLinkedProjects(linkedProjects: { name: string }[]): SquadBuilder {
        this.linkedProjects = linkedProjects;
        return this;
    }

    build(): Squad {
        return new Squad(this.documentId, this.name, this.members, this.linkedProjects);
    }
}