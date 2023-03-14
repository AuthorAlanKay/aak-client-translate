import { Divider } from "@mui/material";
import * as React from "react";
import { Header, HEADER_HEIGHT } from "../../components/re-components";
import { Layout } from "../../components/reuse-components";
import { Translate } from "./Translate";

export interface IRootProps {}

export default function Root(props: IRootProps) {
  return (
    <Layout variants={["width", "column", "align"]}>
      <Header title="翻译" />

      <Divider flexItem sx={{ mt: HEADER_HEIGHT / 8 }} />

      <Layout variants={["width", "column", "align"]} sx={{ p: 6 }}>
        <Translate />
      </Layout>
    </Layout>
  );
}
