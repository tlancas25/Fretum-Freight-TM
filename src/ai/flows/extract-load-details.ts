// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Extracts shipper, rate, and address details from a rate confirmation PDF.
 *
 * - extractLoadDetails - A function that handles the extraction of load details from a PDF.
 * - ExtractLoadDetailsInput - The input type for the extractLoadDetails function.
 * - ExtractLoadDetailsOutput - The return type for the extractLoadDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractLoadDetailsInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A rate confirmation PDF, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractLoadDetailsInput = z.infer<typeof ExtractLoadDetailsInputSchema>;

const ExtractLoadDetailsOutputSchema = z.object({
  shipper: z.string().describe('The name of the shipper.'),
  rate: z.number().describe('The rate for the load.'),
  pickupAddress: z.string().describe('The pickup address for the load.'),
  deliveryAddress: z.string().describe('The delivery address for the load.'),
});
export type ExtractLoadDetailsOutput = z.infer<typeof ExtractLoadDetailsOutputSchema>;

export async function extractLoadDetails(input: ExtractLoadDetailsInput): Promise<ExtractLoadDetailsOutput> {
  return extractLoadDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractLoadDetailsPrompt',
  input: {schema: ExtractLoadDetailsInputSchema},
  output: {schema: ExtractLoadDetailsOutputSchema},
  prompt: `You are an expert logistics assistant. Your job is to extract information from rate confirmation documents.

You will be provided with the content of a PDF document. Your task is to extract the following information:
- Shipper name
- Rate
- Pickup Address
- Delivery Address

Here is the PDF document:
{{media url=pdfDataUri}}

Return the extracted information in JSON format. Be as accurate as possible.
`,
});

const extractLoadDetailsFlow = ai.defineFlow(
  {
    name: 'extractLoadDetailsFlow',
    inputSchema: ExtractLoadDetailsInputSchema,
    outputSchema: ExtractLoadDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
