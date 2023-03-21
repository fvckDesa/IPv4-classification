import {
	IP_address,
	BinaryAddress,
	ClassType,
	IP as ClassifiedIP,
} from "@src/lib/ip/ip";

export type IP = `${number}.${number}.${number}.${number}`;

const ipRegex =
	/(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))/;

export function isIP(str: string): str is IP {
	return new RegExp(`^${ipRegex.source}$`).test(str);
}

const CLASS_TYPE = {
	1: "A",
	2: "B",
	3: "C",
} as const;

export function format(el: IP_address | BinaryAddress | ClassType) {
	if (Array.isArray(el)) {
		return el.join(".");
	}

	return CLASS_TYPE[el.value];
}

async function parseTxtFile(file: File) {
	const txt = await file.text();
	return Array.from(txt.matchAll(new RegExp(ipRegex, "mg"))).map(
		(m) => m[0] as IP
	);
}

function getFileExtension(fileName: string) {
	return fileName.split(".").pop();
}

export async function getListIpFromFile(file: File) {
	let ipList: IP[] = [];
	let message: string;
	let status = false;
	try {
		switch (file.type) {
			case "text/plain":
				ipList = await parseTxtFile(file);
				break;
			default:
				throw new Error(
					`".${getFileExtension(file.name)}" is not valid file extension`
				);
		}
		status = true;
		message = `Found ${ipList.length} IPs`;
	} catch (err) {
		message = err instanceof Error ? err.message : "Oops.. something was wrong";
	}

	return {
		status,
		list: ipList,
		file: file.name,
		message,
	};
}

export async function findIpFromFiles(files: FileList | null) {
	if (!files) return [];
	return Promise.all(Array.from(files).map(getListIpFromFile));
}

function downloader(file: File) {
	const a = document.createElement("a");
	const url = URL.createObjectURL(file);
	a.href = url;
	a.download = file.name;
	a.click();
	URL.revokeObjectURL(url);
}

type FileType = "text/plane" | "text/csv" | "application/json";

interface DownloadOptions {
	list: Record<string, ClassifiedIP>;
	name: string;
	type: FileType;
}

export function downloadClassifiedList({ list, name, type }: DownloadOptions) {
	let content: string;
	switch (type) {
		case "text/plane":
			content = createTxt(list);
			break;
		case "text/csv":
			content = createCSV(list);
			break;
		case "application/json":
			content = createJSON(list);
			break;
		default:
			throw new Error(`File format "${type}" is not supported`);
	}

	downloader(new File([content], getFileName(name, type), { type }));
}

function getFileName(name: string, type: FileType) {
	const extensionMap = {
		"text/plane": ".txt",
		"text/csv": ".csv",
		"application/json": ".json",
	} satisfies Record<FileType, string>;

	return name + extensionMap[type];
}

function createTxt(list: Record<string, ClassifiedIP>) {
	const MAX_LENGTHS = [15, 15, 15, 15, 15, 35, 5];
	return [
		"address            submask            netId              hostId             broadcast          binary                                 classType",
		...Object.values(list).map((classifiedIP) =>
			Object.values(classifiedIP)
				.map((prop, idx) => format(prop).padEnd(MAX_LENGTHS[idx], " "))
				.join("    ")
		),
	].join("\n");
}

function createCSV(list: Record<string, ClassifiedIP>) {
	return [
		"address,submask,netId,hostId,broadcast,binary,classType",
		...Object.values(list).map((classifiedIP) =>
			Object.values(classifiedIP).map(format).join(",")
		),
	].join("\n");
}

function createJSON(list: Record<string, ClassifiedIP>) {
	return JSON.stringify(
		Object.values(list).map((classifiedIP) =>
			Object.entries(classifiedIP).reduce<Record<string, string>>(
				(obj, [key, value]) => {
					obj[key] = format(value);
					return obj;
				},
				{}
			)
		)
	);
}
