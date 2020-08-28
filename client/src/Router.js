import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import App from "./App";
import search_casual_contacts from "./search_casual_contacts";
import NavBar from "./NavBar";
import view_casual_contacts from "./view_casual_contacts";
import view_confirmed_case_check_ins from "./view_confirmed_case_check_ins";
import view_casual_contact_check_ins from "./view_casual_contact_check_ins";
// import savedArtist from "./savedArtist";
// import register from "./register";
// import login from "./login";
// import logout from "./logout";

//Router use to route to EachArtist.js page (show detail of selected artist)

const Router = () => (
	<BrowserRouter>
		<Switch>
			<Route path="/" component={App} exact />
			<Route path="/search_casual_contacts" component={search_casual_contacts} exact />
			<Route path="/view_casual_contacts" component={view_casual_contacts} exact />
			<Route path="/view_confirmed_case_check_ins/:group_record_id" component={view_confirmed_case_check_ins} />
			<Route path="/view_casual_contact_check_ins/:check_in_id:check_in_group_id" component={view_casual_contact_check_ins} />
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
