import { IP_address, BinaryAddress, ClassType } from "@src/lib/ip/ip";

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
