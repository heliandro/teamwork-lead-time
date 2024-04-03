export class Project {
    private slug: string;
    private name: string;
    private projectGroup: string;

    constructor(slug: string, name: string, projectGroup: string) {
        this.slug = slug;
        this.name = name;
        this.projectGroup = projectGroup;
    }

    getSlug(): string {
        return this.slug;
    }

    getName(): string {
        return this.name;
    }

    getProjectGroup(): string {
        return this.projectGroup;
    }
}
