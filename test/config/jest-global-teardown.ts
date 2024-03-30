// Execute after all tests - close DB connection, clear environment and more...
export default async function globalTeardown() {
    const globalSetup = global as any;

    if (globalSetup.start) {
        console.log('\n----- JEST Global Teardown -----\n');
    }
}