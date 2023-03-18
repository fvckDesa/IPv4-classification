export type IP = `${number}.${number}.${number}.${number}`;

const ipRegex =
	/^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/;

export function isIP(str: string): str is IP {
	return ipRegex.test(str);
}
