export interface DataExporter {
	export(data: unknown): string;
}

export function Compress(target: Function) {
	const original = target.prototype.export;
	target.prototype.export = function (data: unknown) {
		original.apply(this, [data]);
		console.log("Comprimindo arquivo");
		return "Retornando arquivo comprimido";
	};
}

export function Encrypt(target: Function) {
	const original = target.prototype.export;
	target.prototype.export = function (data: unknown) {
		original.apply(this, [data]);
		console.log("Criptografando arquivo...");
		return "Retornando arquivo Criptografado";
	};
}

@Compress
export class JsonDataExporter implements DataExporter {
	export(data: unknown): string {
		console.log("Exportando dados em JSON");
		return JSON.stringify(data, null, 2);
	}
}

@Encrypt
export class XmlDataExporter implements DataExporter {
	export(data: unknown): string {
		console.log("Exportando dados em XML");
		return JSON.stringify(data, null, 2);
	}
}

@Compress
export class CsvDataExporter implements DataExporter {
	export(data: unknown): string {
		console.log("Exportando dados em CSV");
		return JSON.stringify(data, null, 2);
	}
}

export abstract class ExporterDecorator implements DataExporter {
	constructor(protected wrappee: DataExporter) {}

	abstract export(data: unknown): string;
}
