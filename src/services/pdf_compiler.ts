// Compiles info entered into the official tax AcroForms for easy download, export, and printing.
import { PDFDocument, PDFTextField, PDFCheckBox, PDFRadioGroup } from 'pdf-lib';

export interface CompilePdfOptions {
  /** The 2-letter state code (e.g., 'NY', 'CA') */
  stateCode: string;
  /** The folder name under /public/state_forms/2026/ (e.g., 'new_york', 'california') */
  stateFolder: string;
  /** The pdf filename under that folder (e.g., 'it201.pdf') */
  pdfFilename: string;
  /** The form data object entered by the user */
  formData: Record<string, any>;
  /** The declarative schema mapping formData keys -> AcroForm field names */
  schema: Record<string, string>;
}

/**
 * Reads local fillable PDF templates, populates AcroForm fields 
 * using the provided state schema, and triggers a local file download.
 */
export async function compileAndDownloadPdf({
  stateFolder,
  pdfFilename,
  formData,
  schema,
}: CompilePdfOptions): Promise<void> {
  try {
    // 1. Fetch the static PDF template from public/state_forms/2026/<stateFolder>/<pdfFilename>
    const pdfUrl = `/state_forms/2026/${stateFolder}/${pdfFilename}`;
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      throw new Error(`Failed to load PDF template from ${pdfUrl} (Status: ${response.status})`);
    }

    const pdfArrayBuffer = await response.arrayBuffer();

    // 2. Load the PDF document into pdf-lib
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
    const form = pdfDoc.getForm();

    // 3. Iterate over the schema and map form data into AcroForm fields
    Object.entries(schema).forEach(([dataKey, acroFieldName]) => {
      const rawValue = formData[dataKey];

      // Skip missing or undefined values
      if (rawValue === undefined || rawValue === null || rawValue === '') {
        return;
      }

      try {
        const field = form.getField(acroFieldName);
        const stringValue = String(rawValue);

        if (field instanceof PDFTextField) {
          field.setText(stringValue);
        } else if (field instanceof PDFCheckBox) {
          if (rawValue === true || rawValue === 'true' || rawValue === '1') {
            field.check();
          } else {
            field.uncheck();
          }
        } else if (field instanceof PDFRadioGroup) {
          field.select(stringValue);
        }
      } catch (err) {
        console.warn(`[pdfCompiler] Field "${acroFieldName}" not found in PDF template or mismatch type:`, err);
      }
    });

    // 4. Flatten form fields (optional: prevents further editing after export)
    // form.flatten();

    // 5. Save the modified PDF bytes locally
    const pdfBytes = await pdfDoc.save();

    // 6. Trigger client-side browser download without sending data to any server
    const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
    const downloadUrl = URL.createObjectURL(blob);

    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = downloadUrl;
    downloadAnchor.download = `${stateFolder}_${pdfFilename}`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();

    // Cleanup
    downloadAnchor.remove();
    URL.revokeObjectURL(downloadUrl);

  } catch (error) {
    console.error('[pdfCompiler] Error compiling state tax PDF:', error);
    throw error;
  }
}
