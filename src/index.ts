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
					try {
						res.write(await fs.readFile(STORAGE));
					} catch (e: unknown) {
						await fs.writeFile(STORAGE, "0", "utf-8");
						res.write("0");
					}
					break;
				case "/update":
				case "/update/":
					let counter: number = 0;
					try {
						counter = parseInt((await fs.readFile(STORAGE)).toString("utf-8"));
					} catch (e: unknown) {
						await fs.writeFile(STORAGE, "0", "utf-8");
					}
					counter += 1;
					await fs.writeFile(STORAGE, counter.toString(), "utf-8");
					res.write(counter.toString());
					break;
			}
			res.end();
		}
	)
	.listen(PORT);
