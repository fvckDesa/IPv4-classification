import "allotment/dist/style.css";
import Box from "@mui/material/Box";
import { Allotment } from "allotment";
import { useState } from "react";
import IpList, { WrapperIP } from "./components/IpList";
import { uuid } from "./utils/uuid";
import { IP } from "@src/utils/ip";
import ClassifiedIP from "./components/ClassifiedIP";

function App() {
	const [list, setList] = useState<WrapperIP[]>([]);
	const [selectedIp, setSelectedIp] = useState<string | null>(null);

	function handlerIpAdd(ip: IP) {
		setList((list) =>
			list.concat({
				id: uuid(),
				ip,
			})
		);
	}

	function handlerDelete(id: string) {
		setList((list) => list.filter((wrap) => wrap.id !== id));
		setSelectedIp((prev) => (prev === id ? null : prev));
	}

	function handlerSelect(id: string | null) {
		setSelectedIp((oldId) => (oldId === id ? null : id));
	}

	return (
		<Box sx={{ width: "100vw", height: "100vh" }}>
			<Allotment minSize={300}>
				<Allotment.Pane preferredSize="30%">
					<IpList
						selectedIp={selectedIp}
						list={list}
						onIpAdd={handlerIpAdd}
						onDelete={handlerDelete}
						onSelect={handlerSelect}
					/>
				</Allotment.Pane>
				<Allotment.Pane preferredSize="70%">
					<ClassifiedIP
						selectedIp={selectedIp}
						list={list}
						onSelect={handlerSelect}
					/>
				</Allotment.Pane>
			</Allotment>
		</Box>
	);
}

export default App;
