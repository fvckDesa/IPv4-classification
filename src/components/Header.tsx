import { SubmitIP } from "@src/hooks/useIpField";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import ImportFile from "./ImportFile";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { IP } from "@src/utils/ip";
import { IP as ClassifiedIP } from "@src/lib/ip/ip";
import SaveFile from "./SaveFile";

type ClassifiedList = Record<string, ClassifiedIP>;
interface IHeader {
	classifiedList: ClassifiedList;
	onIpAdd: SubmitIP;
	onClear: () => void;
}

function Header({ classifiedList, onIpAdd, onClear }: IHeader) {
	const [isImportOpen, setIsImportOpen] = useState(false);
	const [isSaveOpen, setIsSaveOpen] = useState(false);
	function handlerUpload(ipList: IP[]) {
		onIpAdd(...ipList);
	}

	function handlerClose() {
		setIsImportOpen(false);
		setIsSaveOpen(false);
	}

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "flex-end",
				gap: 1,
				px: 2,
				py: 1,
				bgcolor: "primary.main",
				color: "primary.contrastText",
			}}
		>
			<Tooltip title="Save">
				<IconButton
					type="button"
					color="inherit"
					onClick={() => setIsSaveOpen(true)}
				>
					<SaveIcon />
				</IconButton>
			</Tooltip>
			<Tooltip title="Import">
				<IconButton
					type="button"
					color="inherit"
					onClick={() => setIsImportOpen(true)}
				>
					<BrowserUpdatedIcon />
				</IconButton>
			</Tooltip>
			<Tooltip title="Delete All">
				<IconButton type="button" color="inherit" onClick={() => onClear()}>
					<DeleteIcon />
				</IconButton>
			</Tooltip>
			<ImportFile
				isOpen={isImportOpen}
				onClose={handlerClose}
				onFileLoad={handlerUpload}
			/>
			<SaveFile
				isOpen={isSaveOpen}
				list={classifiedList}
				onClose={handlerClose}
			/>
		</Box>
	);
}

export default Header;
