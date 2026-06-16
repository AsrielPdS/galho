import { G } from "./galho.js";

/** HTMLInputElement alias */
export type HTInput = HTMLInputElement;
/** HTMLTextAreaElement alias */
export type HTTextArea = HTMLTextAreaElement;
/** HTMLSelectElement alias */
export type HTSelect = HTMLSelectElement;
/** HTMLDialogElement alias */
export type HTDialog = HTMLDialogElement;
/** HTMLTableElement alias */
export type HTTable = HTMLTableElement;
/** HTMLTableRowElement alias */
export type HTTr = HTMLTableRowElement;
/** HTMLDivElement alias */
export type HTDiv = HTMLDivElement;
/** HTMLTableCellElement alias */
export type HTTd = HTMLTableCellElement;
/** HTMLUListElement alias */
export type HTUl = HTMLUListElement;
/** HTMLOListElement alias */
export type HTOl = HTMLOListElement;
/** HTMLFormElement alias */
export type HTForm = HTMLFormElement;
/** Union of common form input elements */
export type HTInputs = HTInput | HTTextArea | HTSelect;

/** G-wrapped HTMLTableRowElement */
export type GTr = G<HTTr>;
/** G-wrapped HTMLUListElement */
export type GUl = G<HTUl>;
/** G-wrapped HTMLOListElement */
export type GOl = G<HTOl>;
/** G-wrapped HTMLFormElement */
export type GForm = G<HTForm>;
/** G-wrapped HTMLInputElement */
export type GInput = G<HTInput>;
/** G-wrapped HTMLDivElement */
export type GDiv = G<HTDiv>;
/** HTMLButtonElement alias */
export type HTButton = HTMLButtonElement;
/** G-wrapped HTMLButtonElement */
export type GButton = G<HTButton>;