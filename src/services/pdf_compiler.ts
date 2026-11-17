// Compiles info entered into the official tax AcroForms for easy download, export, and printing.
//
// Everything happens client-side: the blank state PDF is fetched from /public, filled in the
// browser with pdf-lib, and handed to the user as a download. No tax data leaves the machine.
import {
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFName,
  PDFOptionList,
  PDFRadioGroup,
  PDFTextField,
  StandardFonts,
  type PDFField,
} from 'pdf-lib';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * How to turn an app value into the text printed on the form.
 *  - 'text'    (default) the value as entered
 *  - 'digits'  strips everything except 0-9. Use for SSNs, dates (mmddyyyy), ZIPs, routing
 *              numbers: the IT-201 fields are length-limited to the bare digits (an SSN
 *              field holds 9 characters, so "123-45-6789" does not fit).
 *  - 'dollars' whole dollars only ("52,340.75" -> "52341"); the form pre-prints ".00".
 */
export type FieldFormat = 'text' | 'digits' | 'dollars';

export interface FieldSpec {
  /** Exact AcroForm field name in the PDF (e.g. 'TP_first_name', 'Line1'). */
  field: string;
  format?: FieldFormat;
  /**
   * For radio-style fields: maps your app's values to the PDF's option names, e.g.
   * { single: '1 Single', mfj: '2 Married Filing Joint Return (...)' }.
   * Optional: yes/no groups accept true/false/'yes'/'no' without it, and options can also be
   * matched by their exact text or a unique prefix.
   */
  options?: Record<string, string>;
}

/** A plain string is shorthand for { field: string }, so existing schemas keep working. */
export type SchemaEntry = string | FieldSpec;

/** formData key (dot-paths like 'primary.firstName' are supported) -> PDF field. */
export type PdfSchema = Record<string, SchemaEntry>;

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
  schema: PdfSchema;
  /** Burn the values into the page so the PDF can no longer be edited. Default: false. */
  flatten?: boolean;
}

/** What happened during a fill. Contains field names only, never taxpayer values. */
export interface FillReport {
  /** AcroForm fields that were written. */
  filled: string[];
  /** Schema keys that had no value in formData (left blank on purpose). */
  skipped: string[];
  /** Schema entries pointing at an AcroForm field that does not exist in this PDF. */
  missingFields: string[];
  /** Fields that exist but rejected the value. */
  errors: { dataKey: string; field: string; message: string }[];
}

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                             */
/* -------------------------------------------------------------------------- */

const TRUE_WORDS = new Set(['true', 'yes', 'y', '1', 'on', 'x', 'checked']);
const FALSE_WORDS = new Set(['false', 'no', 'n', '0', 'off']);

function toBool(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (TRUE_WORDS.has(v)) return true;
    if (FALSE_WORDS.has(v)) return false;
  }
  return undefined;
}

function isBlank(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '') ||
    (typeof value === 'number' && Number.isNaN(value))
  );
}

/** formData['a.b'] first, then formData.a.b, so flat and nested form state both work. */
function getValue(data: Record<string, any>, key: string): unknown {
  if (data && Object.prototype.hasOwnProperty.call(data, key)) return data[key];
  return key.split('.').reduce<any>((acc, part) => (acc == null ? undefined : acc[part]), data);
}

function formatValue(raw: unknown, format: FieldFormat = 'text'): string {
  const s = String(raw).trim();
  if (format === 'digits') return s.replace(/\D/g, '');
  if (format === 'dollars') {
    const n = Number(s.replace(/[$,\s]/g, ''));
    if (!Number.isFinite(n)) throw new Error('value is not a number');
    return String(Math.round(n) || 0); // `|| 0` turns -0 into 0
  }
  return s;
}

/**
 * The fields are drawn with Helvetica (WinAnsi). An unsupported character (e.g. "ễ") would make
 * pdf-lib throw while saving and lose the WHOLE document, so degrade it to a plain letter
 * ("e") or "?" instead.
 */
function makeEncodable(text: string, supported: Set<number>): string {
  return Array.from(text.normalize('NFC'))
    .map((ch) => {
      if (supported.has(ch.codePointAt(0)!)) return ch;
      const base = ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const ok = base !== '' && Array.from(base).every((c) => supported.has(c.codePointAt(0)!));
      return ok ? base : '?';
    })
    .join('');
}

/** Lower-cases and drops everything except a-z/0-9, so punctuation and stray control characters
 *  inside PDF option names (the IT-201's "spouse's" contains a hidden U+0090) never matter. */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Exact match after normalising, else a UNIQUE prefix match, else undefined. */
function matchOption(target: string, options: string[]): string | undefined {
  const t = norm(target);
  if (!t) return undefined;
  const exact = options.find((o) => norm(o) === t);
  if (exact) return exact;
  const prefixed = options.filter((o) => norm(o).startsWith(t));
  return prefixed.length === 1 ? prefixed[0] : undefined;
}

/**
 * Picks which of `options` the app value refers to. Order: the schema's `options` map, then
 * yes/no booleans, then the value itself matched against the option names.
 * Error messages deliberately never include the value itself.
 */
function resolveOption(raw: unknown, options: string[], spec: FieldSpec): string {
  const key = String(raw).trim();

  const mapped = spec.options?.[key];
  if (mapped !== undefined) {
    const hit = matchOption(mapped, options);
    if (hit) return hit;
    throw new Error(`"options" maps this value to "${mapped}", which matches none of: ${options.join(' | ')}`);
  }

  const yes = options.find((o) => norm(o) === 'yes');
  const no = options.find((o) => norm(o) === 'no');
  if (yes && no) {
    const b = toBool(raw);
    if (b !== undefined) return b ? yes : no;
  }

  const hit = matchOption(key, options);
  if (hit) return hit;

  throw new Error(`value does not match any option: ${options.join(' | ')}`);
}

/* -------------------------------------------------------------------------- */
/*  Per-field-type writers                                                    */
/* -------------------------------------------------------------------------- */

function setTextField(field: PDFTextField, raw: unknown, spec: FieldSpec, supported: Set<number>) {
  const text = makeEncodable(formatValue(raw, spec.format), supported);
  const max = field.getMaxLength();
  if (max !== undefined && text.length > max) {
    // Never truncate: a clipped SSN or dollar amount on a tax form is worse than a blank one.
    throw new Error(
      `value is ${text.length} characters but the field holds ${max}` +
        (spec.format ? '' : " (for SSNs, dates, ZIPs, etc. use format: 'digits'; for money, 'dollars')"),
    );
  }
  field.setText(text);
}

/**
 * The IT-201 builds its radio-style questions (filing status, every Yes/No, standard vs itemized,
 * refund type, account type) as ONE checkbox field with several widgets, each with its own
 * on-state. pdf-lib therefore reports them as PDFCheckBox, never PDFRadioGroup, and:
 *   - check() always selects the FIRST widget's state, and
 *   - acroField.setValue() throws for any state but the first.
 * So for multi-widget checkboxes we write /V and every widget's /AS ourselves.
 */
function setCheckBox(field: PDFCheckBox, raw: unknown, spec: FieldSpec) {
  const widgets = field.acroField.getWidgets();
  const states = widgets.map((w) => w.getOnValue()).filter((n): n is PDFName => !!n);

  if (states.length <= 1) {
    // An ordinary standalone checkbox (e.g. "Line 9_box", "H_additional_dependents").
    const checked = toBool(raw);
    if (checked === undefined) throw new Error('value cannot be read as true/false');
    if (checked) field.check();
    else field.uncheck();
    return;
  }

  const labels = states.map((s) => s.decodeText());
  const chosenLabel = resolveOption(raw, labels, spec);
  const chosenIndex = labels.indexOf(chosenLabel);
  const chosen = states[chosenIndex];
  if (!chosen) throw new Error(`value did not resolve to an available checkbox state: ${chosenLabel}`);

  field.acroField.dict.set(PDFName.of('V'), chosen);
  for (const widget of widgets) {
    const onValue = widget.getOnValue();
    widget.setAppearanceState(onValue && onValue === chosen ? chosen : PDFName.of('Off'));
  }
}

function applyValue(field: PDFField, raw: unknown, spec: FieldSpec, supported: Set<number>) {
  if (field instanceof PDFTextField) return setTextField(field, raw, spec, supported);
  if (field instanceof PDFCheckBox) return setCheckBox(field, raw, spec);
  if (field instanceof PDFRadioGroup) return field.select(resolveOption(raw, field.getOptions(), spec));
  if (field instanceof PDFDropdown || field instanceof PDFOptionList) {
    return field.select(resolveOption(raw, field.getOptions(), spec));
  }
  throw new Error(`unsupported field type ${field.constructor.name}`);
}

/* -------------------------------------------------------------------------- */
/*  Core: fill a PDF in memory (pure, no DOM, easy to unit test)              */
/* -------------------------------------------------------------------------- */

export async function fillPdfBytes(
  templateBytes: ArrayBuffer | Uint8Array,
  formData: Record<string, any>,
  schema: PdfSchema,
  { flatten = false }: { flatten?: boolean } = {},
): Promise<{ bytes: Uint8Array; report: FillReport }> {
  if (!schema || typeof schema !== 'object') {
    throw new Error('schema is missing. Check the import path/export name of the state schema.');
  }

  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  // Some government PDFs carry an XFA layer. Adobe Reader renders XFA instead of the AcroForm
  // fields, so values written here would look blank there. IT-201 has none; other states may.
  form.acroForm.dict.delete(PDFName.of('XFA'));

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const supported = new Set(font.getCharacterSet());

  const report: FillReport = { filled: [], skipped: [], missingFields: [], errors: [] };

  for (const [dataKey, entry] of Object.entries(schema)) {
    const spec: FieldSpec = typeof entry === 'string' ? { field: entry } : entry;

    // Checked even when the value is blank, so a wrong field name in the schema is always reported.
    const field = form.getFieldMaybe(spec.field);
    if (!field) {
      report.missingFields.push(spec.field);
      continue;
    }

    const raw = getValue(formData, dataKey);
    if (isBlank(raw)) {
      report.skipped.push(dataKey);
      continue;
    }

    try {
      applyValue(field, raw, spec, supported);
      report.filled.push(spec.field);
    } catch (err) {
      report.errors.push({
        dataKey,
        field: spec.field,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Draw the text/checkmarks once, with the same font used for the character check above.
  form.updateFieldAppearances(font);
  if (flatten) form.flatten({ updateFieldAppearances: false });

  const bytes = await pdfDoc.save({ updateFieldAppearances: false });
  return { bytes, report };
}

/* -------------------------------------------------------------------------- */
/*  Browser glue: fetch template, fill it, trigger the download               */
/* -------------------------------------------------------------------------- */

function templateUrl(stateFolder: string, pdfFilename: string): string {
  // BASE_URL keeps this working when the app is hosted under a sub-path (e.g. GitHub Pages).
  return `${import.meta.env.BASE_URL}state_forms/2026/${stateFolder}/${pdfFilename}`;
}

async function fetchTemplate(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load PDF template from ${url} (Status: ${response.status})`);
  }
  const buffer = await response.arrayBuffer();

  // Vite's dev server answers a missing /public file with index.html and status 200, so
  // response.ok alone is not proof that we received a PDF.
  const magic = new TextDecoder().decode(new Uint8Array(buffer, 0, Math.min(5, buffer.byteLength)));
  if (magic !== '%PDF-') {
    throw new Error(
      `${url} did not return a PDF (content-type: ${response.headers.get('content-type')}). ` +
        'Check the file exists under public/ and that stateFolder/pdfFilename are spelled exactly.',
    );
  }
  return buffer;
}

function triggerDownload(bytes: Uint8Array, filename: string) {
  // Copy into a fresh Uint8Array: pdf-lib returns Uint8Array<ArrayBufferLike>, which newer
  // TypeScript versions refuse as a BlobPart (this replaces the old `as any`).
  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
  const downloadUrl = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  // Revoking immediately can cancel the download in Safari/Firefox, so give it time to start.
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 10_000);
}

function logReport(tag: string, report: FillReport) {
  console.info(
    `${tag} filled ${report.filled.length}, left blank ${report.skipped.length}, ` +
      `missing in PDF ${report.missingFields.length}, rejected ${report.errors.length}`,
  );
  if (report.missingFields.length) {
    console.warn(`${tag} schema points at fields that do not exist in this PDF:`, report.missingFields);
  }
  if (report.errors.length) {
    console.warn(`${tag} fields that rejected their value:`, report.errors);
  }
}

/**
 * Reads local fillable PDF templates, populates AcroForm fields
 * using the provided state schema, and triggers a local file download.
 *
 * Resolves with a FillReport (so the UI can warn about partially-filled forms) and REJECTS if
 * nothing could be filled, instead of silently handing over a blank PDF.
 */
export async function compileAndDownloadPdf({
  stateCode,
  stateFolder,
  pdfFilename,
  formData,
  schema,
  flatten = false,
}: CompilePdfOptions): Promise<FillReport> {
  const tag = `[pdfCompiler:${stateCode}]`;
  try {
    const url = templateUrl(stateFolder, pdfFilename);
    const template = await fetchTemplate(url);

    const { bytes, report } = await fillPdfBytes(template, formData, schema, { flatten });
    logReport(tag, report);

    if (report.filled.length === 0) {
      throw new Error(
        `Nothing was filled in ${pdfFilename}: ${Object.keys(schema).length} schema entries, ` +
          `${report.skipped.length} had no value in formData, ${report.missingFields.length} named a ` +
          `field that is not in the PDF, ${report.errors.length} were rejected. ` +
          'Make sure the schema keys match the keys of formData and the values are AcroForm field names.',
      );
    }

    triggerDownload(bytes, `${stateFolder}_${pdfFilename}`);
    return report;
  } catch (error) {
    console.error(`${tag} Error compiling state tax PDF:`, error);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/*  Dev helper: list a template's real field names                            */
/* -------------------------------------------------------------------------- */

/**
 * Console helper for building a state's schema. In dev tools / a temporary effect:
 *   await inspectPdfFields('new_york', 'it201.pdf')
 * Prints every AcroForm field with its type, max length and (for groups) option names.
 */
export async function inspectPdfFields(stateFolder: string, pdfFilename: string) {
  const buffer = await fetchTemplate(templateUrl(stateFolder, pdfFilename));
  const form = (await PDFDocument.load(buffer)).getForm();

  const rows = form.getFields().map((f) => {
    let options: string | undefined;
    if (f instanceof PDFCheckBox) {
      const states = f.acroField.getWidgets().map((w) => w.getOnValue()?.decodeText() ?? '');
      if (states.length > 1) options = states.join(' | ');
    } else if (f instanceof PDFRadioGroup || f instanceof PDFDropdown || f instanceof PDFOptionList) {
      options = f.getOptions().join(' | ');
    }
    return {
      name: f.getName(),
      type: f.constructor.name,
      maxLength: f instanceof PDFTextField ? f.getMaxLength() : undefined,
      options,
    };
  });

  console.table(rows);
  return rows;
}