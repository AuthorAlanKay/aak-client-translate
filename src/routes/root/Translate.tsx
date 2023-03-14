import { Icon } from "@iconify/react";
import { TabContext, TabList } from "@mui/lab";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Rating,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import {
  INotiRef,
  Layout,
  NotiSnackbar,
} from "../../components/reuse-components";
import { getAudio, getDict, getTranslate } from "../../utils/api";
import { LANG, POS_TAG } from "../../utils/enum";
import { IResultVO } from "../../utils/reuse-utils/type";
import { IDictVO, ITranslateVO, LangType } from "../../utils/type";

export interface ITranslateProps {}

export function Translate(props: ITranslateProps) {
  const notiRef = React.useRef<INotiRef>(null);

  const fromLangs = React.useMemo(() => Object.keys(LANG), []);

  const toLangs = React.useMemo(() => {
    let arr = Object.keys(LANG).filter((i) => i !== fromLangs[0]);
    arr.splice(0, 0, arr.splice(1, 1)[0]);
    return arr;
  }, [fromLangs]);

  const [detectedLang, setDetectedLang] =
    React.useState<LangType>("auto-detect");

  const [fromLang, setFromLang] = React.useState<LangType>("auto-detect");

  const [fromText, setFromText] = React.useState("");

  const [toLang, setToLang] = React.useState<LangType>("en");

  const [toText, setToText] = React.useState("");

  const [dict, setDict] = React.useState<IDictVO[]>([]);

  const [audio, setAudio] = React.useState("");

  const isHaveFromText = React.useMemo(() => fromText !== "", [fromText]);

  const isHaveToText = React.useMemo(() => toText !== "", [toText]);

  const isHaveDict = React.useMemo(() => dict.length !== 0, [dict]);

  const fromLabel = React.useCallback(
    (key: string) => {
      let ad =
        LANG[detectedLang] +
        (detectedLang !== "auto-detect" ? "（已检测）" : "");

      return key === "auto-detect" ? ad : LANG[key];
    },
    [detectedLang]
  );

  const dictLabel = React.useMemo(() => {
    let posTags: { [key: string]: IDictVO[] } = {};
    dict.forEach(
      (i) => (posTags[i.posTag] = (posTags[i.posTag] ?? []).concat(i))
    );

    let el: React.ReactElement[] = [];

    for (let key in posTags) {
      el.push(
        <Layout variants={["column"]} sx={{ mt: 2 }}>
          <Typography gutterBottom color={"primary.dark"}>
            {POS_TAG[key]}
          </Typography>

          <>
            {posTags[key].map((i) => (
              <Layout variants={["align"]}>
                <Typography
                  gutterBottom
                  width={96}
                  whiteSpace={"nowrap"}
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                >
                  {i.text}
                </Typography>

                <Typography
                  gutterBottom
                  flex={1}
                  fontSize={"15px"}
                  color={"text.secondary"}
                  whiteSpace={"nowrap"}
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                >
                  {i.subDict.map(
                    (ii, index) =>
                      ii.text + (index !== i.subDict.length - 1 ? "，" : "")
                  )}
                </Typography>

                <Rating
                  name={i.text}
                  defaultValue={i.frequency * 10}
                  max={3}
                  icon={
                    <Box
                      sx={{
                        height: 8,
                        width: 16,
                        mx: 0.2,
                        borderRadius: 0.4,
                        bgcolor: "primary.dark",
                      }}
                    />
                  }
                  emptyIcon={
                    <Box
                      sx={{
                        height: 8,
                        width: 16,
                        mx: 0.2,
                        borderRadius: 0.4,
                        bgcolor: "divider",
                      }}
                    />
                  }
                />
              </Layout>
            ))}
          </>
        </Layout>
      );
    }

    return <>{el}</>;
  }, [dict]);

  const handleChangeFromLang = React.useCallback((_: any, value: LangType) => {
    setFromLang(value);
  }, []);

  const handleChangeFromText = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFromText(event.target.value);
    },
    []
  );

  const handleChangeToLang = React.useCallback((_: any, value: LangType) => {
    setToLang(value);
  }, []);

  const handleSwap = React.useCallback(() => {
    setFromLang(toLang);
    setToLang(fromLang);
    setFromText(toText);
  }, [toLang, fromLang, toText]);

  const handleClearFromText = React.useCallback(() => setFromText(""), []);

  const handleCopy = React.useCallback(() => {
    let aux = document.createElement("input");
    aux.setAttribute("value", toText);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    notiRef.current.noti("复制成功");
  }, [toText]);

  const handlePlayAudio = React.useCallback(
    async (text: string, lang: LangType) => {
      let resultVO: IResultVO<string> = await getAudio(text, lang);

      setAudio(resultVO.data);

      // console.log("🚀 audio:", resultVO.data);

      setTimeout(
        () => (document.getElementById("audio") as HTMLAudioElement).play(),
        256
      );
    },
    []
  );

  React.useEffect(() => {
    let translate = async () => {
      let resultVO: IResultVO<ITranslateVO> = await getTranslate(
        fromText,
        fromLang,
        toLang
      );
      let data = resultVO.data;
      console.log("🚀 translate data:", data);

      setToText(data.toText);
      if (data.detectedLang !== "auto-detect")
        setDetectedLang(data.detectedLang);
    };

    let id = setTimeout(translate, 256);
    return () => clearTimeout(id);
  }, [fromText, fromLang, toLang]);

  React.useEffect(() => {
    let dict = async () => {
      let newFromLang = fromLang === "auto-detect" ? detectedLang : fromLang;

      let resultVO: IResultVO<IDictVO[]> = await getDict(
        fromText,
        newFromLang,
        toLang
      );

      setDict(resultVO.data);
    };

    let id = setTimeout(dict, 256);
    return () => clearTimeout(id);
  }, [fromLang, fromText, toLang, detectedLang]);

  return (
    <>
      <Paper elevation={2} sx={{ width: "100%", borderRadius: 2 }}>
        {/* Lang Tab */}
        <Layout
          variants={["width", "align"]}
          sx={{ height: 48, borderBottom: 1, borderColor: "divider" }}
        >
          {/* FromLang Tab */}
          <Layout
            variants={["height", "align"]}
            sx={{ flex: 1, overflow: "hidden" }}
          >
            <TabContext value={fromLang}>
              <TabList
                onChange={handleChangeFromLang}
                variant="scrollable"
                scrollButtons="auto"
              >
                {fromLangs.map((key, index) => (
                  <Tab key={index} label={fromLabel(key)} value={key} />
                ))}
              </TabList>
            </TabContext>
          </Layout>

          {/* Swap Button */}
          <IconButton
            disabled={fromLang === fromLangs[0]}
            onClick={handleSwap}
            sx={{ width: 40, height: 40 }}
          >
            <Icon icon="ic:round-swap-horiz" width={24} height={24} />
          </IconButton>

          {/* ToLang Tab */}
          <Layout
            variants={["height", "align"]}
            sx={{ flex: 1, overflow: "hidden" }}
          >
            <TabContext value={toLang}>
              <TabList
                onChange={handleChangeToLang}
                variant="scrollable"
                scrollButtons="auto"
              >
                {toLangs.map((key, index) => (
                  <Tab key={index} label={LANG[key]} value={key} />
                ))}
              </TabList>
            </TabContext>
          </Layout>
        </Layout>

        {/* Text */}
        <Layout variants={["width"]}>
          {/* FromText */}
          <Layout
            variants={["column"]}
            sx={{ flex: 1, minHeight: 196, p: "20px 24px 20px 24px" }}
          >
            <Layout variants={["width"]} sx={{ flex: 1 }}>
              <TextField
                value={fromText}
                onChange={handleChangeFromText}
                placeholder="输入文本"
                multiline
                variant="standard"
                sx={{ width: "100%" }}
                inputProps={{ sx: { fontSize: "18px" } }}
                InputProps={{
                  disableUnderline: true,
                  id: "translate-from-textfield",
                }}
                onClick={() =>
                  document.getElementById("translate-from-textfield").focus()
                }
              />

              {/* Clear Button */}
              {isHaveFromText ? (
                <IconButton
                  onClick={handleClearFromText}
                  sx={{ width: 40, height: 40, ml: 0.5 }}
                >
                  <Icon icon="ic:round-close" width={24} height={24} />
                </IconButton>
              ) : null}
            </Layout>

            <Layout variants={["width", "align"]} sx={{ height: 24, mt: 1 }}>
              {/* Audio Button */}
              {isHaveFromText ? (
                <IconButton
                  onClick={() =>
                    handlePlayAudio(
                      fromText,
                      fromLang === "auto-detect" ? detectedLang : fromLang
                    )
                  }
                  sx={{ width: 40, height: 40 }}
                >
                  <Icon
                    icon="ant-design:sound-outlined"
                    width={24}
                    height={24}
                  />
                </IconButton>
              ) : null}

              <Box flex={1} />

              <Typography variant="body2" color={"text.secondary"}>
                {fromText.length.toLocaleString() +
                  "/" +
                  (5000).toLocaleString()}
              </Typography>
            </Layout>
          </Layout>

          <Divider orientation="vertical" flexItem />

          {/* ToText */}
          <Layout
            variants={["column"]}
            sx={{ flex: 1, minHeight: 196, p: "20px 24px 20px 24px" }}
          >
            <Layout variants={["width"]} sx={{ flex: 1 }}>
              <TextField
                value={toText}
                multiline
                variant="standard"
                sx={{ width: "100%" }}
                inputProps={{ sx: { fontSize: "18px" } }}
                InputProps={{ disableUnderline: true }}
              />
            </Layout>

            <Layout variants={["width", "align"]} sx={{ height: 24, mt: 1 }}>
              {/* Audio Button */}
              {isHaveToText ? (
                <IconButton
                  onClick={() => handlePlayAudio(toText, toLang)}
                  sx={{ width: 40, height: 40 }}
                >
                  <Icon
                    icon="ant-design:sound-outlined"
                    width={24}
                    height={24}
                  />
                </IconButton>
              ) : null}

              <Box flex={1} />

              {/* Copy Button */}
              {isHaveToText ? (
                <IconButton onClick={handleCopy} sx={{ width: 40, height: 40 }}>
                  <Icon
                    icon="material-symbols:content-copy-outline-rounded"
                    width={24}
                    height={24}
                  />
                </IconButton>
              ) : null}
            </Layout>
          </Layout>
        </Layout>
      </Paper>

      <Layout variants={["width", "align"]}>
        <Box flex={1} />

        {isHaveDict ? (
          <Paper
            elevation={2}
            sx={{ mt: 1, flex: 1, maxWidth: "50%", borderRadius: 2 }}
          >
            <Layout variants={["full", "column"]} sx={{ p: 2 }}>
              <Layout>
                <Typography mr={0.5}>{fromText}</Typography>
                <Typography color={"text.secondary"}> 的翻译</Typography>
              </Layout>

              {dictLabel}
            </Layout>
          </Paper>
        ) : null}
      </Layout>

      <audio id="audio" src={audio} hidden />

      <NotiSnackbar notiRef={notiRef} />
    </>
  );
}
