import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { WrapperIP } from "./IpList";

interface Column {
	id:
		| "address"
		| "subnet mask"
		| "netId"
		| "hostId"
		| "broadcast"
		| "binary"
		| "class";
	label: string;
	minWidth?: number;
	align?: "right";
	format?: (value: number) => string;
}

const columns: readonly Column[] = [
	{ id: "address", label: "address" },
	{ id: "subnet mask", label: "subnet mask", minWidth: 125 },
	{ id: "netId", label: "netId" },
	{ id: "hostId", label: "hostId" },
	{ id: "broadcast", label: "broadcast" },
	{ id: "binary", label: "binary" },
	{ id: "class", label: "class" },
];

interface IClassifiedIP {
	selectedIp: string | null;
	list: WrapperIP[];
	onSelect: (id: string) => void;
}

function ClassifiedIP({ selectedIp, list, onSelect }: IClassifiedIP) {
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
					{list.map((row) => (
						<TableRow
							hover
							role="checkbox"
							tabIndex={-1}
							key={row.id}
							selected={selectedIp === row.id}
							onClick={() => onSelect(row.id)}
						>
							{columns.map((column) => {
								if (column.id === "binary") {
									return (
										<TableCell key={column.id} align={column.align}>
											{`${"1".repeat(8)}.`.repeat(4).slice(0, 35)}
										</TableCell>
									);
								}
								return (
									<TableCell key={column.id} align={column.align}>
										{row.ip}
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
