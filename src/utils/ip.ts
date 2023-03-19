import { IP_address, BinaryAddress, ClassType } from "@src/lib/ip/ip";

export type IP = `${number}.${number}.${number}.${number}`;

const ipRegex =
	/^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/;

export function isIP(str: string): str is IP {
	return ipRegex.test(str);
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
