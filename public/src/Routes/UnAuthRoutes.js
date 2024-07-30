import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Auth from "../helpers/Auth";

import Layout from "../Components/View/Layout/index";
import SmsInvoice from "../Components/View/SmsInvoice/SmsInvoice";
import Invoice from "../Components/View/Invoice/Invoice";
import SignUp from "../Components/Signup";
import Login from "../Components/login";
import ForgotPassword from "../Components/login/forgotPassword";
import NewResetPassowrd from "../Components/login/NewResetPassword";
import NewLoginOTP from "../Components/login/NewLoginOTP";
import LoginwithOTP from "../Components/login/LoginwithOTP";
import MobileNewStatement from "../Components/mobileNewStatement";

// Complete SASS & SCSS Tutorial for Beginners in Hindi in 2020

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      Auth.getUserDetail() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

const UnAuthRoutes = () => {
  // const loading = () => "Loading...";

  return (
    <Switch>
      {/* <Redirect exact from="/" to="/login" /> */}

      <Route exact path="/login" component={Login} />
      <Route exact path="/statement/:id" component={MobileNewStatement}  />
      <Route exact path="/invoice/:id" component={SmsInvoice} />
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/forgot" component={ForgotPassword} />
      <Route exact path="/reset" component={NewResetPassowrd} />
      <Route exact path="/new-otp" component={NewLoginOTP} />
  
      <Route exact path="/login-with-otp" component={LoginwithOTP} />
      <ProtectedRoute path="/" component={Layout} />
   
      
      {/* <Redirect from="*" to="/signup" /> */}
    </Switch>
  );
};

export default UnAuthRoutes;
