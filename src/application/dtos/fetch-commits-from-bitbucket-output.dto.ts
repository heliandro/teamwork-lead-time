export class FetchCommitsFromBitbucketOutputDTO {
    
    error?: boolean;

    constructor(error?: boolean) {
        this.error = error;
    }
}