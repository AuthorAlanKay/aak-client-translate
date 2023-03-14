import { MongoIdType } from "./re-utils/type";

export type LangType =
  | "auto-detect"
  | "zh-Hans"
  | "zh-Hant"
  | "en"
  | "ja"
  | "ko"
  | "fr"
  | "ru"
  | "de";

export interface ITranslateVO {
  toText: string;
  detectedLang: LangType;
}

export interface IDictVO {
  text: string;
  frequency: number;
  posTag: string;
  subDict: {
    text: string;
    frequency: number;
  }[];
}

export interface ITranslateDocumentPO {
  _id: MongoIdType;
  historys?: {
    id: string;
    fromLang: LangType;
    fromText: string;
    toLang: LangType;
    toText: string;
  }[];
  saveds?: {
    id: string;
    fromLang: LangType;
    fromText: string;
    toLang: LangType;
    toText: string;
  }[];
}
