import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { IP } from "@src/lib/ip/ip";
import { ChangeEvent, FormEvent, useState } from "react";
import { downloadClassifiedList } from "@src/utils/ip";

interface ISaveFile {
	isOpen: boolean;
	list: Record<string, IP>;
	onClose: () => void;
}

type FileType = "text/plane" | "text/csv" | "application/json";

function SaveFile({ isOpen, list, onClose }: ISaveFile) {
	const [fileType, setFileType] = useState<FileType>("text/plane");
	const [fileName, setFileName] = useState("");
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	function handlerTypeChange(e: SelectChangeEvent) {
		setFileType(e.target.value as FileType);
	}

	function handlerNameChange(e: ChangeEvent<HTMLInputElement>) {
		if (isError && e.target.value.length > 0) {
			setIsError(false);
		}
		setFileName(e.target.value);
	}

	function handlerSubmit(e: FormEvent) {
		e.preventDefault();
		if (fileName.length === 0) {
			setIsError(true);
			return;
		}
		setIsLoading(true);
		downloadClassifiedList({ list, name: fileName, type: fileType });
		setIsLoading(false);
		setIsError(false);
		onClose();
	}

	return (
		<Dialog open={isOpen} onClose={onClose}>
			<DialogTitle
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: 2,
					}}
				>
					<SaveAsIcon color="primary" />
					Save as
				</Box>
				<IconButton onClick={onClose}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<Box component="form" onSubmit={handlerSubmit}>
				<DialogContent dividers>
					<FormControl sx={{ mr: 3 }} variant="outlined">
						<TextField
							label="Name"
							onChange={handlerNameChange}
							error={isError}
							value={fileName}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<InsertDriveFileIcon />
									</InputAdornment>
								),
							}}
							autoComplete="off"
						/>
					</FormControl>
					<FormControl>
						<InputLabel id="file-type-label">Type</InputLabel>
						<Select
							id="file-type"
							labelId="file-type-label"
							label="Type"
							onChange={handlerTypeChange}
							value={fileType}
						>
							<MenuItem value={"text/plane"}>.txt</MenuItem>
							<MenuItem value={"text/csv"}>.csv</MenuItem>
							<MenuItem value={"application/json"}>.json</MenuItem>
						</Select>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button
						type="submit"
						variant="contained"
						sx={{ position: "relative", display: "block", ml: "auto" }}
						disabled={isLoading}
					>
						{isLoading && (
							<Box
								sx={{
									position: "absolute",
									top: 0,
									left: 0,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									width: "100%",
									height: "100%",
								}}
							>
								<CircularProgress size={20} />
							</Box>
						)}
						Save
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
}

export default SaveFile;
