import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { isIP, IP } from "@src/utils/ip";

export type SubmitIP = (ip: IP) => void;

export function useIpField() {
	const [ip, setIp] = useState("");
	const [error, setError] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const ref = useRef<HTMLInputElement>(null);

	function shake() {
		if (!ref.current) return;

		function remove() {
			if (!ref.current) return;
			ref.current.classList.remove("shake");
			ref.current.removeEventListener("animationend", remove);
		}

		ref.current.addEventListener("animationend", remove);

		ref.current.classList.add("shake");
	}

	function onChange(e: ChangeEvent<HTMLInputElement>) {
		if (isSubmitted) {
			// set error if is not valid ip
			setError(!isIP(e.target.value));
		}

		setIp(e.target.value);
	}

	function handlerSubmit(cb: SubmitIP) {
		return function (e: FormEvent<HTMLFormElement>) {
			e.preventDefault();
			const isValidIP = isIP(ip);
			if (isValidIP) {
				cb(ip);
				setIp("");
			}
			// if is valid ip reset else set
			setIsSubmitted(!isValidIP);
			setError(!isValidIP);
			!isValidIP && shake();
		};
	}

	return { value: ip, onChange, ref, error, handlerSubmit };
}
