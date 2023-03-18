import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import { TransitionGroup } from "react-transition-group";
import Queue from "@mui/icons-material/Queue";
import { useIpField, SubmitIP } from "@src/hooks/useIpField";
import { IP } from "@src/utils/ip";

export interface WrapperIP {
	id: string;
	ip: IP;
}

interface IIpList {
	selectedIp: string | null;
	list: WrapperIP[];
	onIpAdd: SubmitIP;
	onSelect: (id: string) => void;
}

function IpList({ selectedIp, list, onIpAdd, onSelect }: IIpList) {
	const { error, handlerSubmit, ...input } = useIpField();

	return (
		<Box sx={{ height: "100vh", overflow: "auto" }}>
			<List
				sx={{
					maxHeight: "100%",
				}}
			>
				<TransitionGroup>
					{list.map(({ id, ip }) => (
						<Collapse key={id}>
							<ListItemButton
								selected={selectedIp === id}
								onClick={() => onSelect(id)}
							>
								<ListItemText primary={ip} />
								<Divider />
							</ListItemButton>
						</Collapse>
					))}
				</TransitionGroup>
				<ListItem>
					<Box
						component="form"
						sx={{ display: "flex", width: "100%" }}
						onSubmit={handlerSubmit(onIpAdd)}
					>
						<TextField
							size="small"
							error={error}
							sx={{
								width: "80%",
								mr: "15px",
							}}
							placeholder="Insert an ip address"
							autoComplete="off"
							{...input}
						/>
						<Button type="submit" variant="contained" endIcon={<Queue />}>
							Add
						</Button>
					</Box>
				</ListItem>
			</List>
		</Box>
	);
}

export default IpList;
