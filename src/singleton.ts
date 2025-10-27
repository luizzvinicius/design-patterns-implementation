import { format } from "date-fns";

class Log {
	private storedLogs: string[] = [];

	constructor(storedLogs: string[]) {
		this.storedLogs = storedLogs;
	}

	get logs() {
		return this.storedLogs;
	}

	loggin(message: string, level: string) {
		const formattedDate = format(Date.now(), "yyyy-MM-dd HH:mm:ss:SS");
		const log = `${formattedDate} [${level.toUpperCase()}] ${message}`;
		this.storedLogs.push(log);
		console.log(log);
	}
}

let log: Log | null = null;

export function getLog() {
	if (log !== null) {
		return log;
	}

	log = new Log([]);
	return log;
}
