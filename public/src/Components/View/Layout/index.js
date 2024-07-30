import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Home from "../Home";
import Setting from "../Setting";
import Sidebar from "../Layout/Sidebar";
import Service from "../Service/Service";
import Staff from "../staff/Staff";
import Customer from "./../Customer/Customer";
// import Login from "../Login";
import Calender from "../Scheduler/calender";
import Inventory from "../Inventory/Inventory";
import Products from "../Inventory/Products";
import Invoice from "../Invoice/Invoice";
import ChildSidebar from "./ChildSidebar";
import Membership from "../../Membership/Membership";
import SmsInvoice from "../SmsInvoice/SmsInvoice";
import TasklistProfile from "../../TasklistProfile/index";
import SignUp from "../../Signup/index";
import BarberaTasklist from "../BarberaTasklist";
import Promote from "../promote";
import Login from "../../login";
import ForgotPassword from "../../login/forgotPassword";
import NewLoginOTP from "../../login/NewLoginOTP";
import NewResetPassowrd from "../../login/NewResetPassword";
import LoginwithOTP from "../../login/LoginwithOTP";
import Promotemodal from "../../Common/Modal/promoteModal/campaign";
import PromoteScreen from "../../Common/Modal/promoteModal/PromoteScreen";
import MobileNewStatement from "../../mobileNewStatement";
// import Header from "./Header";
// import * as authUtil from "../../../utils/auth.util";
// import Sidebar from "./Sidebar/Sidebar";

const DefaultLayout = ({ children, match }) => (
  <>
    <div className="flex">
      <ChildSidebar />
      {children}
    </div>
  </>
);
const DefaultChildLayout = ({ children, match }) => (
  <>
    <div className="flex">
      <ChildSidebar />
      {children}
    </div>
  </>
);

function Layout() {
  return (
    <BrowserRouter>
      <Switch>
        <RouteWrapper
          exact={true}
          path="/"
          component={Home}
          layout={DefaultLayout}
        />
        <RouteWrapper
          exact={true}
          path="/setting"
          component={Setting}
          layout={DefaultLayout}
        />
        <RouteWrapper
          exact={true}
          path="/service"
          component={Service}
          layout={DefaultLayout}
        />
        <RouteWrapper
          exact={true}
          path="/staff"
          component={Staff}
          layout={DefaultLayout}
        />
        <RouteWrapper
          exact={true}
          path="/customer"
          component={Customer}
          layout={DefaultLayout}
        />
        <RouteWrapper
          exact={true}
          path="/calender"
          component={Calender}
          layout={DefaultLayout}
        />
        <RouteWrapper
          exact={true}
          path="/inventory"
          component={Inventory}
          layout={DefaultChildLayout}
        />
        <RouteWrapper
          exact={true}
          path="/products"
          component={Products}
          layout={DefaultLayout}
        />
        <RouteWrapper
          exact={true}
          path="/invoice"
          component={Invoice}
          layout={DefaultChildLayout}
        />
        <RouteWrapper
          exact={true}
          path="/membership"
          component={Membership}
          layout={DefaultChildLayout}
        />
        <RouteWrapper
          exact={true}
          path="/barberatasklist"
          component={BarberaTasklist}
          layout={DefaultChildLayout}
        />
        <RouteWrapper
          exact={true}
          path="/promote"
          component={Promote}
          layout={DefaultChildLayout}
        />
        <Route exact path="/statement/:id" component={MobileNewStatement} />
        <Redirect exact from="/login" to="/" />
        <Redirect exact from="/signup" to="/" />

        <Route exact path="/invoice/:id" component={SmsInvoice} />
        {/* <Route exact path="/login" component={Login} /> */}
      </Switch>
    </BrowserRouter>
  );
}

function RouteWrapper({ component: Component, layout: Layout, auth, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => (
        <Layout {...props}>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}
export default Layout;
