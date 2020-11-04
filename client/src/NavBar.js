import React, { Component } from "react";
import "./App.css";
import axios from "axios";

// link this page to another page
import { Link } from "react-router-dom";

class NavBar extends Component {
	constructor() {
		super();
		this.state = {
			login_name: null,
			last_login: null,
			role: 0,
		};
		this.startup();
	}

	// signals that the all components have rendered properly
	componentDidMount() {
		var dropdown = document.getElementsByClassName("dropdown-btn");
		var i;

		for (i = 0; i < dropdown.length; i++) {
			dropdown[i].addEventListener("click", function () {
				this.classList.toggle("active");
				var dropdownContent = this.nextElementSibling;
				if (dropdownContent.style.display === "block") {
					dropdownContent.style.display = "none";
				} else {
					dropdownContent.style.display = "block";
				}
			});
		}
	}

	startup = async () => {
		await fetch("/getLoginDetails", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData[0].last_login == "undefined") {
					jsonData[0].last_login = "None";
				}

				jsonData[0].last_login = jsonData[0].last_login
					.replace("T", " ")
					.substring(0, jsonData[0].last_login.indexOf(".") - 3);

				this.setState({
					login_name: jsonData[0].fname,
					last_login: jsonData[0].last_login,
					role: jsonData[0].role,
				});
			})
			.catch((error) => {
				// alert("Error: " + error);
			});
	};

	render() {
		const { role, verify_role } = this.state;

		return (
			<div class="">
				<div class="sidenav">
					<p class="sidenav_title">COVID-19 CTS</p>
					<div class="admin_outer">
						<p>Admin Panel</p>
					</div>

					{/* dashboard */}
					<div class="mx-0">
						<Link
							to={{
								pathname: `/dashboard`,
							}}
						>
							<a class="p-0 m-0">Dashboard</a>
						</Link>
					</div>
					{/* casual contact */}
					<button class="dropdown-btn py-2">
						Casual Contacts
						<i class="fa fa-caret-down mr-2 mt-1"></i>
					</button>
					<div class="dropdown-container">
						<Link
							to={{
								pathname: `/search_casual_contacts`,
							}}
						>
							<a class="">Add Casual Contacts</a>
						</Link>
						<Link
							to={{
								pathname: `/view_casual_contacts`,
							}}
						>
							<a class="">Manage Casual Contacts</a>
						</Link>
					</div>

					{/* hotspot */}
					<button class="dropdown-btn py-2">
						Hotspots
						<i class="fa fa-caret-down mr-2 mt-1"></i>
					</button>
					<div class="dropdown-container">
						<Link
							to={{
								pathname: `/add_hotspot`,
							}}
						>
							<a class="">Add New Hotspot</a>
						</Link>
						<Link
							to={{
								pathname: `/view_hotspots`,
							}}
						>
							<a class="">Manage Existing Hotspots</a>
						</Link>
						<Link
							to={{
								pathname: `/view_hotspots_manual_add`,
							}}
						>
							<a class="">Manage Added Hotspots</a>
						</Link>
					</div>

					{/* batch email */}
					<div class="mx-0">
						<Link
							to={{
								pathname: `/send_batch_email`,
							}}
						>
							<a class="p-0 m-0">Send Batch Email</a>
						</Link>
					</div>

					{/* health risk assessment analytics */}
					<div class="mx-0">
						<Link
							to={{
								pathname: `/health_risk_assessment_analytics`,
							}}
						>
							<a class="p-0 m-0">Health Risk Assessment Analytics</a>
						</Link>
					</div>

					{/* manage staff */}
					<div class={role == 0 ? "d-none" : ""}>
						<button class="dropdown-btn py-2">
							Staff
							<i class="fa fa-caret-down mr-2 mt-1"></i>
						</button>
						<div class="dropdown-container">
							<Link
								to={{
									pathname: `/add_staff`,
								}}
							>
								<a class="">Add New Staff</a>
							</Link>
							<Link
								to={{
									pathname: `/manage_staff`,
								}}
							>
								<a class="">Manage Staff</a>
							</Link>
						</div>
					</div>

					{/* my profile */}
					<div class="mx-0">
						<Link
							to={{
								pathname: `/manage_profile`,
							}}
						>
							<a class="p-0 m-0">Profile</a>
						</Link>
					</div>

					{/* logout */}
					<div class="mx-0 logout_outer">
						<Link
							to={{
								pathname: `/logout`,
							}}
						>
							<a class="p-0 m-0">Logout</a>
						</Link>
					</div>

					{/* <a href="#contact">Search</a> */}
				</div>
			</div>
		);
	}
}

export default NavBar;
