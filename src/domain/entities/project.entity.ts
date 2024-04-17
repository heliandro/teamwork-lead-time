export class Project {
    private documentId: string;
    private name: string;
    private group: string;

    constructor(documentId: string, name: string, group: string) {
        this.documentId = documentId;
        this.name = name;
        this.group = group;
    }

    getDocumentId(): string {
        return this.documentId;
    }

    getName(): string {
        return this.name;
    }

    getGroup(): string {
        return this.group;
    }
}

export class ProjectBuilder {

    private documentId: string;
    private name: string;
    private group: string;

    constructor() {
        this.documentId = '';
        this.name = '';
        this.group = '';
    }

    withDocumentId(documentId: string): ProjectBuilder {
        this.documentId = documentId;
        return this;
    }

    withName(name: string): ProjectBuilder {
        this.name = name;
        return this;
    }

    withGroup(group: string): ProjectBuilder {
        this.group = group;
        return this;
    }

    build(): Project {
        return new Project(this.documentId, this.name, this.group);
    }
}