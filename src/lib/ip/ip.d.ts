/// <reference types="emscripten" />

export type IP_address = [number, number, number, number];
export type BinaryAddress = [string, string, string, string];
export type ClassType = { value: 1 | 2 | 3 };

export interface IP {
	address: IP_address;
	submask: IP_address;
	netId: IP_address;
	hostId: IP_address;
	broadcast: IP_address;
	binary: BinaryAddress;
	classType: ClassType;
}

export type IP_address = [number, number, number, number];

interface ModuleIP extends EmscriptenModule {
	make_IP(address: IP_address): IP;
}

declare const Module: EmscriptenModuleFactory<ModuleIP>;
export default Module;
