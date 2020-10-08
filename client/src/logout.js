import React, { Component } from "react";
import "./App.css";
import axios from "axios";

// link this page to another page
import { Link } from "react-router-dom";

class logout extends Component {
	constructor() {
		super();
		this.state = {};
	}

	logout = async () => {
		await fetch("/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((jsonData) => {
				// console.log(jsonData);
				if (jsonData) {
					alert("Logout successful");
					window.location.href = "/";
				} else {
					alert("Logout failed");
					window.location.href = "/dashboard";
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	componentDidMount = async () => {
		// if (window.confirm("Confirm to logout?")) {
		this.logout();
		// } else {
		// 	window.location.href = "/";
		// }
	};

	render() {
		return <div></div>;
	}
}

export default logout;
