export class Project {
    private slug: string;
    private name: string;
    private group: string;

    constructor(slug: string, name: string, group: string) {
        this.slug = slug;
        this.name = name;
        this.group = group;
    }

    getSlug(): string {
        return this.slug;
    }

    getName(): string {
        return this.name;
    }

    getGroup(): string {
        return this.group;
    }
}

export class ProjectBuilder {

    private slug: string;
    private name: string;
    private group: string;

    constructor() {
        this.slug = '';
        this.name = '';
        this.group = '';
    }

    withSlug(slug: string): ProjectBuilder {
        this.slug = slug;
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
        return new Project(this.slug, this.name, this.group);
    }
}