import http from "http";
import { promises as fs } from "fs";
import { resolve } from "path";

const PORT: number = parseInt(process.env.PORT) || 3000;
const STORAGE: string = process.env.STORAGE
	? resolve(__dirname, "..", process.env.STORAGE)
	: resolve(__dirname, "..", "counter.txt");

http
	.createServer(
		async (
			req: http.IncomingMessage,
			res: http.ServerResponse
		): Promise<void> => {
			res.writeHead(200, { "Content-Type": "text/plain" });
			switch (req.url) {
				case "/get":
				case "/get/":
					res.write(await fs.readFile(STORAGE));
					break;
				case "/update":
				case "/update/":
					const counter: number = parseInt(
						(await fs.readFile(STORAGE)).toString("utf-8")
					);
					await fs.writeFile(STORAGE, (counter + 1).toString(), "utf-8");
					res.write((counter + 1).toString());
					break;
			}
			res.end();
		}
	)
	.listen(PORT);
