export function dedent(parts: any, ...values: any[]): any;
export function dedenter(strings: any, values?: any[], postprocess?: (result: any) => any): any;
export function dedentStrings(strings: any, indentLengths: any): any[];
export function onlyWhitespace(string: any, afterIndentPos: any): boolean;
export function getIndentLengths(strings: any): any[];
export function interpolate(strings: any, values: any): string;
export function getIndent(string: any): any;
export function indentLines(text: any, indentation: any, options?: {}): any;
export const regex: Readonly<{
    newlineWithIndent: RegExp;
    closingIndentation: RegExp;
    newline: RegExp;
    firstLineIndent: RegExp;
    startsWithNewline: RegExp;
}>;
