import {GameServer} from "./server/server";
import {config} from "dotenv";
import "reflect-metadata";
import "./extensions";

config({
	path: process.env.NODE_ENV ? `.${process.env.NODE_ENV}.env` : '.env'
});

const bootstrap = async () => {
	const server = new GameServer();
	await server.run();
}

bootstrap();