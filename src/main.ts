import {GameServer} from "./server/server";
import "reflect-metadata";

const bootstrap = async () => {
	const server = new GameServer();

	// const metadata = Reflect.getOwnMetadata(Config.LISTEN_METADATA_KEY, Server.prototype, "test");
	// console.log(metadata);
}

bootstrap();