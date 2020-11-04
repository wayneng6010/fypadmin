import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import App from "./App";
import change_password_first_login from "./change_password_first_login";
import login from "./login";
import dashboard from "./dashboard";
import search_casual_contacts from "./search_casual_contacts";
import NavBar from "./NavBar";
import view_casual_contacts from "./view_casual_contacts";
import view_confirmed_case_check_ins from "./view_confirmed_case_check_ins";
import view_casual_contact_check_ins from "./view_casual_contact_check_ins";
import view_simp_casual_contact_check_ins from "./view_simp_casual_contact_check_ins";
import download_excel_casual_contacts from "./download_excel_casual_contacts";
import download_excel_infected_premise from "./download_excel_infected_premise";
import add_hotspot from "./add_hotspot";
import view_hotspots from "./view_hotspots";
import view_hotspots_each from "./view_hotspots_each";
import view_hotspots_manual_add from "./view_hotspots_manual_add";
import send_batch_email from "./send_batch_email";
import add_staff from "./add_staff";
import manage_staff from "./manage_staff";
import manage_profile from "./manage_profile";
import logout from "./logout";
import health_risk_assessment_analytics from "./health_risk_assessment_analytics";

const Router = () => (
	<BrowserRouter>
		<Switch>
			{/* login */}
			<Route path="/" component={login} exact />

			{/* change psw first login */}
			<Route path="/change_password_first_login" component={change_password_first_login} exact />
			
			{/* dashboard */}
			<Route path="/dashboard" component={dashboard} exact />

			{/* casual contact */}
			<Route
				path="/search_casual_contacts"
				component={search_casual_contacts}
				exact
			/>
			<Route
				path="/view_casual_contacts"
				component={view_casual_contacts}
				exact
			/>
			<Route
				path="/view_confirmed_case_check_ins/:group_record_id"
				component={view_confirmed_case_check_ins}
			/>
			<Route
				path="/view_casual_contact_check_ins/:check_in_id/:check_in_group_id"
				component={view_casual_contact_check_ins}
			/>
			<Route
				path="/view_simp_casual_contact_check_ins/:group_record_id"
				component={view_simp_casual_contact_check_ins}
			/>
			<Route
				path="/download_excel_casual_contacts/:check_in_id/:check_in_group_id"
				component={download_excel_casual_contacts}
			/>
			<Route
				path="/download_excel_infected_premise/:check_in_group_id"
				component={download_excel_infected_premise}
			/>

			{/* hotspot */}
			<Route path="/add_hotspot" component={add_hotspot} />
			<Route path="/view_hotspots" component={view_hotspots} />
			<Route
				path="/view_hotspots_each/:group_record_id"
				component={view_hotspots_each}
			/>
			<Route
				path="/view_hotspots_manual_add"
				component={view_hotspots_manual_add}
			/>

			{/* batch email */}
			<Route path="/send_batch_email" component={send_batch_email} exact />

			{/* health risk assessment analytics */}
			<Route path="/health_risk_assessment_analytics" component={health_risk_assessment_analytics} exact />
			
			{/* staff */}
			<Route path="/add_staff" component={add_staff} exact />
			<Route path="/manage_staff" component={manage_staff} exact />
			<Route path="/manage_profile" component={manage_profile} exact />
			
			{/* navbar */}
			<Route path="/NavBar" component={NavBar} exact />
			<Route path="/logout" component={logout} exact />
			
			{/* if route not found */}
			<Route path="*" component={login} />
		</Switch>
	</BrowserRouter>
);

export default Router;
