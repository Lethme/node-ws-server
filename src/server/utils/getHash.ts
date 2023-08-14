import {createHash} from "crypto";

export function getHash(str: string) {
	return createHash("sha256").update(str).digest("hex");
}