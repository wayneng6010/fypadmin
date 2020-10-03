import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import App from "./App";
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

// import savedArtist from "./savedArtist";
// import register from "./register";
// import login from "./login";
// import logout from "./logout";

//Router use to route to EachArtist.js page (show detail of selected artist)

const Router = () => (
	<BrowserRouter>
		<Switch>
			<Route path="/" component={App} exact />
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
			<Route path="/download_excel_casual_contacts/:check_in_id/:check_in_group_id" component={download_excel_casual_contacts} />
			<Route path="/download_excel_infected_premise/:check_in_group_id" component={download_excel_infected_premise} />
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

			<Route path="/NavBar" component={NavBar} exact />
			{/* <Route path="/eachArtist/:artist_id,:artist_name" component={eachArtist} />
			<Route path="/savedArtist/" component={savedArtist} />
			<Route path="/register/" component={register} />
			<Route path="/login/" component={login} />
			<Route path="/logout/" component={logout} /> */}
			{/* if route not found */}
			{/* <Route path="*" component={login} /> */}
		</Switch>
	</BrowserRouter>
);

export default Router;
