print(">>>> Script mongo-init.js está sendo executado! <<<<<<<");

db.getSiblingDB('admin').auth(
    process.env.MONGO_INITDB_ROOT_USERNAME,
    process.env.MONGO_INITDB_ROOT_PASSWORD
);

db.createUser({
  user: "heliandro",
  pwd: "pass123",
  roles: [{ role: "readWrite", db: "company_metrics" }]
})

db.createCollection("app_configurations")
db.app_configurations.insert(
    {
        documentId: "app_update_config",
        bitbucketProjectsLastUpdate: null,
        bitbucketCommitsLastUpdate: null,
        bambooLastUpdate: null,
        jiraLastUpdate: null,
    }
);

db.createCollection("squads")
db.squads.insertMany([
    { 
        documentId: "grecia",
        name: "Grécia",
        members: [],
        linkedProjects: [
            { name: "sigla_projeto-bff-nome_projeto" },
            { name: "sigla_projeto-fed-nome_projeto" },
            { name: "sigla_projeto-srv-nome_projeto" },
        ]
    },
    {
        documentId: "alemanha",
        name: "Alemanha",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "egito",
        name: "Egito",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "luxemburgo",
        name: "Luxemburgo",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "panama",
        name: "Panama",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "madagascar",
        name: "Madagascar",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "japao",
        name: "Japão",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "canada",
        name: "Canadá",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "dinamarca",
        name: "Dinamarca",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "brasil",
        name: "Brasil",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "suica",
        name: "Suíça",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "china",
        name: "China",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "filipinas",
        name: "Filipinas",
        members: [],
        linkedProjects: [
        ]
    },
])