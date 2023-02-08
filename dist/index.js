"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const server = (0, fastify_1.default)();
server.get("/auth", async (request, reply) => {
    const { username, password } = request.query;
    const customerHeader = request.headers["h-Custom"];
    // do something with request data
    return `logged in!`;
});
server.get("/ping", async (req, res) => {
    return "pong\n";
});
server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`Server listening on ${address}`);
});
