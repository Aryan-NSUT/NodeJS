// import { fstat} from "fs";
// import { createServer } from "http";
const http = require("http");
const routes = require("./routes");

/**
 We created a router to handle the request coming from client. All the logic is sent there and we simply import the router file here from the above syntax. Const routes has multiple objects and handler is one of them. How to create them is described in routes file.
 */
const server = http.createServer(routes.handler);

server.listen(4000);
