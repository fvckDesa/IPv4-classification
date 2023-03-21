import "allotment/dist/style.css";
import Box from "@mui/material/Box";
import { Allotment } from "allotment";
import { useState } from "react";
import IpList, { WrapperIP } from "./components/IpList";
import { uuid } from "./utils/uuid";
import { IP } from "@src/utils/ip";
import ClassifiedIPList from "./components/ClassifiedIPList";
import Header from "./components/Header";
import { IP as ClassifiedIP } from "@src/lib/ip/ip";

type ClassifiedList = Record<string, ClassifiedIP>;

function App() {
	const [list, setList] = useState<WrapperIP[]>([]);
	const [classifiedList, setClassifiedList] = useState<ClassifiedList>({});
	const [selectedIp, setSelectedIp] = useState<string | null>(null);

	function handlerIpAdd(...ipList: IP[]) {
		setList((list) =>
			list.concat(
				ipList.map((ip) => ({
					id: uuid(),
					ip,
				}))
			)
		);
	}

	function handlerDelete(id: string) {
		setList((list) => list.filter((wrap) => wrap.id !== id));
		setSelectedIp((prev) => (prev === id ? null : prev));
	}

	function handlerSelect(id: string | null) {
		setSelectedIp((oldId) => (oldId === id ? null : id));
	}

	function handlerClear() {
		setList([]);
		setSelectedIp(null);
	}

	function handlerClassifiedListChange(
		cb: (oldList: ClassifiedList) => ClassifiedList
	) {
		setClassifiedList(cb);
	}

	return (
		<Box sx={{ width: "100vw", height: "100vh" }}>
			<Allotment minSize={300}>
				<Allotment.Pane preferredSize="25%">
					<Box
						sx={{ display: "flex", flexDirection: "column", height: "100%" }}
					>
						<Header
							classifiedList={classifiedList}
							onIpAdd={handlerIpAdd}
							onClear={handlerClear}
						/>
						<IpList
							selectedIp={selectedIp}
							list={list}
							onIpAdd={handlerIpAdd}
							onDelete={handlerDelete}
							onSelect={handlerSelect}
						/>
					</Box>
				</Allotment.Pane>
				<Allotment.Pane preferredSize="75%">
					<ClassifiedIPList
						selectedIp={selectedIp}
						list={list}
						classifiedList={classifiedList}
						onSelect={handlerSelect}
						onClassifiedListChange={handlerClassifiedListChange}
					/>
				</Allotment.Pane>
			</Allotment>
		</Box>
	);
}

export default App;
