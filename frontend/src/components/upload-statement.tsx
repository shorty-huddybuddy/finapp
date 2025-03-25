"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useTransactionStore } from "../hooks/store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function UploadStatement({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { setTransactions } = useTransactionStore();
  const [formatError, setFormatError] = useState<string | null>(null);

  const validateCSVFormat = (headers: string[]): boolean => {
    // Check if required columns exist
    const requiredColumns = ['date', 'amount', 'category', 'description'];
    const headerLower = headers.map(h => h.toLowerCase().trim());
    
    return requiredColumns.every(col => 
      headerLower.some(header => header.includes(col))
    );
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        // Reset states
        setIsLoading(true);
        setFormatError(null);
        setUploadProgress(10);
        
        const reader = new FileReader();

        reader.onabort = () => {
          console.log("file reading was aborted");
          setIsLoading(false);
          setUploadProgress(0);
          toast({
            title: "Upload Aborted",
            description: "File reading was aborted",
            variant: "destructive",
          });
        };
        
        reader.onerror = () => {
          console.log("file reading has failed");
          setIsLoading(false);
          setUploadProgress(0);
          toast({
            title: "Upload Failed",
            description: "There was an error reading your file",
            variant: "destructive",
          });
        };
        
        reader.onload = () => {
          try {
            setUploadProgress(50);
            const csvData = reader.result as string;
            
            // Parse CSV data
            const rows = csvData.split("\n");
            if (rows.length < 2) {
              setIsLoading(false);
              setUploadProgress(0);
              setFormatError("The CSV file appears to be empty");
              toast({
                title: "Format Error",
                description: "The uploaded file appears to be empty",
                variant: "destructive",
              });
              return;
            }
            
            const headers = rows[0].split(",");
            if (!validateCSVFormat(headers)) {
              setIsLoading(false);
              setUploadProgress(0);
              setFormatError("The CSV file doesn't contain the required columns (date, amount, category, description)");
              toast({
                title: "Format Error",
                description: "The uploaded file doesn't match the required format",
                variant: "destructive",
              });
              return;
            }
            
            // Continue processing if validation passes
            setUploadProgress(80);
            
            // Parse transactions
            const transactions = rows
              .slice(1)
              .map((row) => {
                if (!row.trim()) return null; // Skip empty rows
                const values = row.split(",");
                if (values.length < 4) return null;
                
                const amount = Number.parseFloat(values[1]);
                if (isNaN(amount)) return null;
                
                return {
                  date: values[0],
                  amount: amount,
                  category: values[2],
                  description: values[3],
                };
              })
              .filter((transaction): transaction is NonNullable<typeof transaction> => 
                transaction !== null && !!transaction.date && !isNaN(transaction.amount)
              );
            
            if (transactions.length === 0) {
              setIsLoading(false);
              setUploadProgress(0);
              setFormatError("No valid transactions found in the file");
              toast({
                title: "Processing Error",
                description: "No valid transactions found in the file",
                variant: "destructive",
              });
              return;
            }
            
            // Set transactions and complete the upload
            setTransactions(transactions);
            setUploadProgress(100);
            
            setTimeout(() => {
              setIsLoading(false);
              toast({
                title: "Success",
                description: `Uploaded ${transactions.length} transactions`,
                variant: "default",
              });
              if (onSuccess) {
                onSuccess();
              }
            }, 500);
            
          } catch (error) {
            console.error("Error processing file:", error);
            setIsLoading(false);
            setUploadProgress(0);
            const errorMessage = error instanceof Error ? error.message : "Unknown error processing file";
            setFormatError(errorMessage);
            toast({
              title: "Processing Error",
              description: errorMessage,
              variant: "destructive",
            });
          }
        };
        
        reader.readAsText(file);
      }
    },
    [setTransactions, toast, onSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls", ".xlsx"],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Upload Statement</h2>
        <p className="text-muted-foreground">
          Upload your bank statement to automatically import your transactions.
        </p>
      </div>
      
      {formatError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Format Error</AlertTitle>
          <AlertDescription>{formatError}</AlertDescription>
        </Alert>
      )}
      
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50
              ${isLoading ? "pointer-events-none opacity-60" : ""}
              ${
                isDragActive
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/25"
              }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              {isLoading ? (
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              ) : (
                <Upload className="h-10 w-10 text-primary" />
              )}
              
              {isDragActive ? (
                <p className="text-lg font-medium">Drop the file here</p>
              ) : (
                <>
                  <p className="text-lg font-medium">Drag & drop your statement here</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    disabled={isLoading}
                  >
                    Or select file
                  </Button>
                </>
              )}
              
              <p className="text-sm text-muted-foreground mt-2">
                Supports CSV, XLS, XLSX formats
              </p>
            </div>
          </div>
          
          {isLoading && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing your statement...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          <div className="mt-6 border-t pt-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              Make sure your CSV file includes date, amount, category, and description columns
            </p>
          </div>
        </CardContent>
      </Card>
      
      
      
      
    </div>
  );
}