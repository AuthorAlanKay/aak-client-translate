import * as React from "react";
import { useRoutes } from "react-router-dom";
import {
  Layout,
  LoadingProgress,
  RequireFallback,
} from "../components/reuse-components";
import { useAppSelector } from "../redux/store";

export interface IRouterProps {}

export default function Router(props: IRouterProps) {
  const { isAuth } = useAppSelector((state) => state.global);

  return useRoutes([
    {
      path: "/",
      element: (
        <RequireFallback
          bool={isAuth !== null}
          fallback={
            <>
              <LoadingProgress />
              <Layout variants={["hidden"]}>
                <Root />
              </Layout>
            </>
          }
        >
          <Root />
        </RequireFallback>
      ),
    },
  ]);
}

const Root = React.lazy(() => import("./root"));
