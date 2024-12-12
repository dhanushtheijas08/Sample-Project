/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import * as XLSX from "xlsx";

export const teacherExcelFileParser = (file: File, setParsedData: any) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const arrayBuffer = e.target?.result;
    if (arrayBuffer) {
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      jsonData.forEach((row: any, index) => {
        if (!row[0] || !row[1] || !row[2] || !row[3]) {
          // If any of the required fields are missing, show an error
          toast.error("Missing required data in row " + (index));
          return;
        }
      });

      setParsedData(
        jsonData.map((row: any) => ({
          name: row[0] || "",
          teacherId: row[1] ? row[1].toString() : "", // Safely check row[1]
          email: row[2] || "",
          phone: row[3] ? row[3].toString() : "", // Safely check row[3]
        }))
      );
    }
  };
  reader.readAsArrayBuffer(file);
};

export const studentsExcelFileParser = (file: File, setParsedData: any) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const arrayBuffer = e.target?.result;
    if (arrayBuffer) {
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      jsonData.forEach((row: any, index) => {
        if (!row[0] || !row[1] || !row[2] || !row[3] || !row[4]) {
          // If any of the required fields are missing, show an error
          toast.error("Missing required data in row " + (index + 1));
        }
      });

      setParsedData(
        jsonData.map((row: any) => ({
          name: row[0] || "",
          studentId: row[1] ? row[1].toString() : "", // Safely check row[1]
          email: row[2] || "",
          phone: row[3] ? row[3].toString() : "", // Safely check row[3]
          gradeAndSection: {
            id: "", // Default empty ID for grade and section
            name: row[4] || "",
          },
        }))
      );
    }
  };
  reader.readAsArrayBuffer(file);
};
