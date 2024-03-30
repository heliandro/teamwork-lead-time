// Execute before all - Open DB connection, setup environments and more...
export default async function globalSetup() {
    const globalSetup = global as any;
    globalSetup.start = true;

    console.log('\n----- JEST E2E Global Setup -----');
}