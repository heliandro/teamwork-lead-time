export class Squad {
    private documentId: string;
    private name: string;
    private members: string[];
    private linkedProjects: string[];

    constructor(documentId: string, name: string, members: string[], linkedProjects: string[]) {
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

    getMembers(): string[] {
        return this.members;
    }

    getLinkedProjects(): string[] {
        return this.linkedProjects;
    }
}

export class SquadBuilder {
    private documentId: string;
    private name: string;
    private members: string[];
    private linkedProjects: string[];

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

    withMembers(members: string[]): SquadBuilder {
        this.members = members;
        return this;
    }

    withLinkedProjects(linkedProjects: string[]): SquadBuilder {
        this.linkedProjects = linkedProjects;
        return this;
    }

    build(): Squad {
        return new Squad(this.documentId, this.name, this.members, this.linkedProjects);
    }
}