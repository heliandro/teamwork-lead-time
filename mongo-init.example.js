print(">>>> Script mongo-init.js está sendo executado! <<<<<<<");

db.getSiblingDB('admin').auth(
    process.env.MONGO_INITDB_ROOT_USERNAME,
    process.env.MONGO_INITDB_ROOT_PASSWORD
);

db.createUser({
  user: "heliandro",
  pwd: "pass123",
  roles: [{ role: "readWrite", db: "teamwork_leadtime" }]
})

db.createCollection("squads")

db.squads.insertMany([
    { 
        documentId: "grecia",
        squad: "Grécia",
        members: [],
        linkedProjects: [
            { name: "sigla_projeto-bff-nome_projeto" },
            { name: "sigla_projeto-fed-nome_projeto" },
            { name: "sigla_projeto-srv-nome_projeto" },
        ]
    },
    {
        documentId: "alemanha",
        squad: "Alemanha",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "egito",
        squad: "Egito",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "luxemburgo",
        squad: "Luxemburgo",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "panama",
        squad: "Panama",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "madagascar",
        squad: "Madagascar",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "japao",
        squad: "Japão",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "canada",
        squad: "Canadá",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "dinamarca",
        squad: "Dinamarca",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "brasil",
        squad: "Brasil",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "suica",
        squad: "Suíça",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "china",
        squad: "China",
        members: [],
        linkedProjects: [
        ]
    },
    {
        documentId: "filipinas",
        squad: "Filipinas",
        members: [],
        linkedProjects: [
        ]
    },
])