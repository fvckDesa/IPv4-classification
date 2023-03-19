import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { WrapperIP } from "./IpList";
import { IP_address, IP } from "@src/lib/ip/ip";
import { useDeferredValue, useEffect, useState } from "react";
import { format } from "@src/utils/ip";
import { useIPModule } from "@src/hooks/useIPModule";

interface Column {
	id: keyof IP;
	label: string;
	minWidth?: number;
	align?: "right";
}

const columns: readonly Column[] = [
	{ id: "address", label: "address" },
	{
		id: "submask",
		label: "subnet mask",
		minWidth: 125,
	},
	{ id: "netId", label: "netId" },
	{ id: "hostId", label: "hostId" },
	{ id: "broadcast", label: "broadcast" },
	{ id: "binary", label: "binary" },
	{
		id: "classType",
		label: "class",
	},
];

interface IClassifiedIP {
	selectedIp: string | null;
	list: WrapperIP[];
	onSelect: (id: string) => void;
}

type ClassifiedList = Record<string, IP>;

function ClassifiedIP({ selectedIp, list, onSelect }: IClassifiedIP) {
	const { isLoading, make_IP } = useIPModule();
	const [classifiedList, setClassifiedList] = useState<ClassifiedList>({});
	const deferredList = useDeferredValue(list);

	useEffect(() => {
		if (isLoading) return;
		setClassifiedList((prev) =>
			deferredList.reduce<ClassifiedList>((classifiedList, { id, ip }) => {
				if (make_IP === undefined) return {};
				classifiedList[id] =
					id in prev
						? prev[id]
						: make_IP(ip.split(".").map(Number) as IP_address);
				return classifiedList;
			}, {})
		);
	}, [deferredList]);

	if (isLoading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<TableContainer sx={{ maxHeight: "100vh" }}>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						{columns.map((column) => (
							<TableCell
								key={column.id}
								align={column.align}
								style={{ minWidth: column.minWidth }}
							>
								{column.label}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.entries(classifiedList).map(([id, row]) => (
						<TableRow
							hover
							role="checkbox"
							tabIndex={-1}
							key={id}
							selected={selectedIp === id}
							onClick={() => onSelect(id)}
						>
							{columns.map((column) => {
								return (
									<TableCell key={column.id} align={column.align}>
										{format(row[column.id])}
									</TableCell>
								);
							})}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default ClassifiedIP;
