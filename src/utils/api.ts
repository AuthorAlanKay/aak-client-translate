// translate

import { TRANSLATE_SERVER } from "./reuse-utils/enum";
import { getFetch, setURLQuery } from "./reuse-utils/tool";
import { LangType } from "./type";

export const getTranslate = async (
  fromText: string,
  fromLang: LangType,
  toLang: LangType
) =>
  await getFetch(
    TRANSLATE_SERVER +
      setURLQuery("/get-translate", { fromText, fromLang, toLang })
  );

export const getDict = async (
  fromText: string,
  fromLang: LangType,
  toLang: LangType
) =>
  await getFetch(
    TRANSLATE_SERVER + setURLQuery("/get-dict", { fromText, fromLang, toLang })
  );

export const getAudio = async (text: string, lang: LangType) =>
  await getFetch(TRANSLATE_SERVER + setURLQuery("/get-audio", { text, lang }));
