import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import NavBar from "./NavBar";

// link this page to another page
import { Link } from "react-router-dom";

class App extends Component {
	constructor() {
		super();
		// this.startup();
	}

	// signals that the all components have rendered properly
	componentDidMount() {}

	startup = async () => {
		await fetch("/testing", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				visitor_id: "991004-07-5721",
				date_from: "2020-08-24T13:54:36.038+00:00",
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				alert(JSON.stringify(jsonData));
				// if (jsonData) {
				// 	alert("Login successful");
				// 	// this.props.navigation.navigate("visitor_home");
				// } else {
				// 	alert("Phone number or password is incorrect");
				// }
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	render() {
		return (
			<div class="">
				<NavBar />
				<div class="page_header">
					<div class="page_title">Dashboard</div>
				</div>
				<div class="page_content">
					<h1>Dashboard</h1>
				</div>
			</div>
		);
	}
}

export default App;
