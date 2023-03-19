import { useState, useEffect } from "react";
import Module from "@src/lib/ip/ip";

type ModuleIP = Awaited<ReturnType<typeof Module>>;

export function useIPModule() {
	const [moduleIP, setModuleIP] = useState<ModuleIP>();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		Module()
			.then(setModuleIP)
			.finally(() => setIsLoading(false));
	}, []);

	return { isLoading, make_IP: moduleIP?.make_IP };
}
