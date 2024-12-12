/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileSpreadsheet } from "lucide-react";
import * as React from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { useEffect } from "react";

const ImportBulkDialog = ({
  isModalOpen,
  setIsModalOpen,
  excelFileParser,
  handleParsedData,
  isPending,
  title,
  description,
  sample_url,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  excelFileParser: any;
  handleParsedData: any;
  isPending: boolean;
  title: string;
  description: string;
  sample_url: string;
}) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [parsedData, setParsedData] = React.useState<any[]>([]);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      excelFileParser(acceptedFiles[0], setParsedData);
    }
  }, []);

  const handleSubmit = () => {
    console.log("hi");

    handleParsedData(parsedData);
  };

  useEffect(() => {
    if (!isModalOpen) {
      setFile(null);
    }
  }, [isModalOpen]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
      "application/vnd.google-apps.spreadsheet": [".gsheet"],
    },
    maxFiles: 1,
    disabled: isPending,
  });

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!isPending) {
          setIsModalOpen(open);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px] md:max-w-md lg:max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Import {title}</DialogTitle>
          <DialogDescription className="flex justify-between items-center">
            To add {title} in bulk
            <Button className="px-14 w-full max-w-[50px]" disabled={isPending || !file} onClick={handleSubmit}>
              {isPending ? "Adding..." : "Add"}
            </Button>
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div
          {...getRootProps()}
          className={`
            mt-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${isDragActive ? "border-primary bg-primary/5" : "border-muted"}
            ${file ? "bg-muted/5" : ""}
          `}
        >
          <input {...getInputProps()} disabled={isPending} />
          <div className="flex flex-col items-center gap-4">
            <FileSpreadsheet className="h-12 w-12 text-green-600" />
            {file ? (
              <div className="text-sm text-muted-foreground">Selected file: {file.name}</div>
            ) : (
              <>
                <div className="text-primary font-medium">Click here to upload</div>
                <div className="text-sm text-muted-foreground text-center">{description}</div>
              </>
            )}
          </div>
        </div>
        <a href={sample_url} className="underline text-center">
          Download Sample Data
        </a>
      </DialogContent>
    </Dialog>
  );
};

export default ImportBulkDialog;
