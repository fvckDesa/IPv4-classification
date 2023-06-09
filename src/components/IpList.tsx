import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";

import { TransitionGroup } from "react-transition-group";
import Queue from "@mui/icons-material/Queue";

import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import { useIpField, SubmitIP } from "@src/hooks/useIpField";
import { IP } from "@src/utils/ip";
import { MouseEvent } from "react";

export interface WrapperIP {
	id: string;
	ip: IP;
}

interface IIpList {
	selectedIp: string | null;
	list: WrapperIP[];
	onIpAdd: SubmitIP;
	onSelect: (id: string) => void;
	onDelete: (id: string) => void;
}

function IpList({ selectedIp, list, onIpAdd, onSelect, onDelete }: IIpList) {
	const { error, handlerSubmit, ...input } = useIpField();

	function handlerDelete(id: string) {
		return function (e: MouseEvent) {
			e.stopPropagation();
			onDelete(id);
		};
	}

	return (
		<Box
			sx={{
				flex: 1,
				display: "flex",
				flexDirection: "column",
				width: "100%",
			}}
		>
			<Box
				component="form"
				sx={{ display: "flex", width: "100%", px: 2, py: 1 }}
				onSubmit={handlerSubmit(onIpAdd)}
			>
				<TextField
					size="small"
					error={error}
					sx={{
						width: "80%",
						ml: 1,
						mr: 2,
					}}
					placeholder="Insert an ip address"
					autoComplete="off"
					{...input}
				/>
				<Button type="submit" variant="contained" endIcon={<Queue />}>
					Add
				</Button>
			</Box>
			<List sx={{ flex: "1", overflow: "auto" }}>
				<TransitionGroup>
					{list.map(({ id, ip }) => (
						<Collapse key={id}>
							<ListItemButton
								selected={selectedIp === id}
								onClick={() => onSelect(id)}
							>
								<ListItemText primary={ip} />
								<Divider />
								<IconButton color="error" onClick={handlerDelete(id)}>
									<RemoveCircleIcon color="error" />
								</IconButton>
							</ListItemButton>
						</Collapse>
					))}
				</TransitionGroup>
			</List>
		</Box>
	);
}

export default IpList;
