"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useTransactionStore } from "../hooks/store";

export default function UploadStatement() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { setTransactions } = useTransactionStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setIsLoading(true);
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          const csvData = reader.result as string;
          // Parse CSV data
          const rows = csvData.split("\n");
          const headers = rows[0].split(",");
          const transactions = rows
            .slice(1)
            .map((row) => {
              const values = row.split(",");
              return {
                date: values[0],
                amount: Number.parseFloat(values[1]),
                category: values[2],
                description: values[3],
              };
            })
            .filter((transaction) => transaction.date && transaction.amount);

          setTransactions(transactions);
          setIsLoading(false);
          toast({
            title: "Success",
            description: `Uploaded ${transactions.length} transactions`,
          });
        };
        reader.readAsText(file);
      }
    },
    [setTransactions, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls", ".xlsx"],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Upload Statement</h2>
        <p className="text-muted-foreground">
          Upload your bank statement in CSV format. The file should contain
          columns for date, amount, category, and description.
        </p>
      </div>
      <Card>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/25"
              }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              {isDragActive ? (
                <p>Drop the file here</p>
              ) : (
                <p>Drag & drop your statement here, or click to select file</p>
              )}
              <p className="text-sm text-muted-foreground">
                Supports CSV, XLS, XLSX
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      {isLoading && (
        <div className="flex justify-center">
          <p>Processing your statement...</p>
        </div>
      )}
    </div>
  );
}
