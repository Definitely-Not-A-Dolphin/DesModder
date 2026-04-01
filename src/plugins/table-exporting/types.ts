export const exportOptions = ["csv", "typst"] as const;

export type ExportOptions = typeof exportOptions;
