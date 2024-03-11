import { G } from "./galho.js";

export type HTInput = HTMLInputElement;
export type HTTextArea = HTMLTextAreaElement;
export type HTSelect = HTMLSelectElement;
export type HTDialog = HTMLDialogElement;
export type HTTable = HTMLTableElement;
export type HTTr = HTMLTableRowElement;
export type HTDiv = HTMLDivElement;
export type HTTd = HTMLTableCellElement;
export type HTUl = HTMLUListElement;
export type HTOl = HTMLOListElement;
export type HTInputs = HTInput | HTTextArea | HTSelect;

export type GTr = G<HTTr>;
export type GInput = G<HTInput>;
export type GDiv = G<HTDiv>;
export type HTButton = HTMLButtonElement;
export type GButton = G<HTButton>;