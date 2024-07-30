import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Auth from "../helpers/Auth";
import UnAuthRoutes from "./UnAuthRoutes";
import Layout from "../Components/View/Layout/index";

const MainRoutes = () => {
  const loading = () => "Loading...";

  return (
    <BrowserRouter>
      <Switch>
        <Suspense fallback={loading()}>
          <Route
            path="/"
            render={() => {
              if (!Auth.isUserAuthenticated()) return <UnAuthRoutes />;
              return <Layout />;
            }}
          />
        </Suspense>
      </Switch>
    </BrowserRouter>
  );
};

export default MainRoutes;
