import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { findIpFromFiles, IP } from "@src/utils/ip";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import FolderIcon from "@src/components/FolderIcon";
import { toast } from "react-toastify";

interface IUploadFile {
	isOpen: boolean;
	onFileLoad: (ipList: IP[]) => void;
	onClose: () => void;
}

function UploadFile({ isOpen, onFileLoad, onClose }: IUploadFile) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isDragOver, setIsDragOver] = useState(false);

	async function parseFiles(files: FileList | null) {
		if (!files) return;
		setIsLoading(true);
		const fileList = await findIpFromFiles(files);
		for (const { status, file, list, message } of fileList) {
			onFileLoad(list);
			toast(
				<div>
					<Typography mb={1}>
						<strong>{status ? "Success" : "Error"}</strong> - {file}
					</Typography>
					{message}
				</div>,
				{
					type: status ? "success" : "error",
				}
			);
		}
		setIsLoading(false);
		onClose();
	}

	function handlerFileChange(e: ChangeEvent<HTMLInputElement>) {
		parseFiles(e.target.files);
	}

	function handlerClick() {
		inputRef.current?.click();
	}

	function handlerDrop(e: DragEvent) {
		parseFiles(e.dataTransfer.files);
	}

	function handlerDragOver() {
		setIsDragOver(true);
	}

	function handlerDragLeave() {
		setIsDragOver(false);
	}

	return (
		<Dialog
			PaperProps={{ sx: { p: 4, borderRadius: 3 } }}
			open={isOpen}
			onClose={() => onClose()}
			maxWidth="sm"
			fullWidth
		>
			<Box
				sx={{
					backgroundColor: isDragOver ? "#f4f8fb" : "transparent",
					border: 2,
					borderColor: "#c5d1e2",
					borderStyle: "dashed",
					borderRadius: 3,
					transition: "background-color 0.3s ease",
				}}
				onDrop={handlerDrop}
				onDragOver={handlerDragOver}
				onDragLeave={handlerDragLeave}
			>
				<DialogTitle
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<FolderIcon color="primary" sx={{ width: 80, height: 70 }} />
					Drag and Drop your files here
				</DialogTitle>
				<DialogContent
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 1,
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
						}}
					>
						<Box
							sx={{
								width: 72,
								height: 2,
								backgroundColor: "#93A9C3",
								borderRadius: 1,
							}}
						/>
						<DialogContentText sx={{ color: "#93A9C3", fontWeight: 700 }}>
							OR
						</DialogContentText>
						<Box
							sx={{
								width: 72,
								height: 2,
								backgroundColor: "#93A9C3",
								borderRadius: 1,
							}}
						/>
					</Box>
					<Button
						variant="contained"
						sx={{ position: "relative" }}
						onClick={handlerClick}
						disabled={isLoading}
					>
						{isLoading && (
							<Box
								sx={{
									position: "absolute",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<CircularProgress size={20} />
							</Box>
						)}
						Browse
					</Button>
					<input
						ref={inputRef}
						type="file"
						onChange={handlerFileChange}
						accept=".txt"
						multiple
						hidden
					/>
				</DialogContent>
			</Box>
		</Dialog>
	);
}

export default UploadFile;
