"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { ExtractLoadDetailsOutput } from "@/ai/flows/extract-load-details";
import { extractLoadDetails } from "@/ai/flows/extract-load-details";

export default function ExtractPage() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractLoadDetailsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setExtractedData(null);
  };

  const handleFileRemove = () => {
    setFile(null);
    setExtractedData(null);
  };

  const handleExtract = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a PDF file to extract details from.",
      });
      return;
    }

    setIsLoading(true);
    setExtractedData(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const pdfDataUri = reader.result as string;
        const result = await extractLoadDetails({ pdfDataUri });
        setExtractedData(result);
      } catch (error) {
        console.error("Extraction failed:", error);
        toast({
          variant: "destructive",
          title: "Extraction Failed",
          description: "Could not extract details from the PDF. Please try another file.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = (error) => {
        console.error("File reading error:", error);
        toast({
            variant: "destructive",
            title: "File Error",
            description: "Could not read the selected file.",
        });
        setIsLoading(false);
    };
  };
  
  const handleSaveDraft = () => {
    toast({
        title: "Load Saved",
        description: "The draft load has been successfully saved.",
    })
    setFile(null);
    setExtractedData(null);
  }

  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="font-headline text-3xl font-bold">Document AI Assistant</h1>
            <p className="text-muted-foreground">
              Upload a rate confirmation PDF to automatically extract load details and create a draft.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>1. Upload Rate Confirmation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUploader
                selectedFile={file}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
              />
              <Button onClick={handleExtract} disabled={!file || isLoading}>
                {isLoading ? "Extracting..." : "Extract Details"}
              </Button>
            </CardContent>
          </Card>
          
          {(isLoading || extractedData) && (
            <Card>
              <CardHeader>
                <CardTitle>2. Review and Confirm</CardTitle>
                <CardDescription>
                    Review the extracted details and save the draft load.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  extractedData && (
                    <form className="space-y-4">
                        <div>
                            <Label htmlFor="shipper">Shipper</Label>
                            <Input id="shipper" defaultValue={extractedData.shipper} />
                        </div>
                        <div>
                            <Label htmlFor="rate">Rate</Label>
                            <Input id="rate" type="number" defaultValue={extractedData.rate} />
                        </div>
                        <div>
                            <Label htmlFor="pickup">Pickup Address</Label>
                            <Input id="pickup" defaultValue={extractedData.pickupAddress} />
                        </div>
                        <div>
                            <Label htmlFor="delivery">Delivery Address</Label>
                            <Input id="delivery" defaultValue={extractedData.deliveryAddress} />
                        </div>
                        <Button onClick={handleSaveDraft}>Save Draft Load</Button>
                    </form>
                  )
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </AppLayout>
  );
}
