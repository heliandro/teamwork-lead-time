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
