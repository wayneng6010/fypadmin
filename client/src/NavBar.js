import React, { Component } from "react";
import "./App.css";
import axios from "axios";

// link this page to another page
import { Link } from "react-router-dom";

class NavBar extends Component {
	constructor() {
		super();
		this.state = {
			test: "Text",
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

	startup = async () => {};

	render() {
		return (
			<div class="">
				<div class="sidenav">
					<p>
						COVID-19 Contact
						<br />
						Tracing System
					</p>
					<div class="d-flex admin_outer">
						<p>Admin Panel</p>
					</div>

					{/* dashboard */}
					<div class="mx-0">
						<Link
							to={{
								pathname: `/`,
							}}
						>
							<a class="p-0 m-0">Dashboard</a>
						</Link>
					</div>
					{/* casual contact */}
					<button class="dropdown-btn py-2">
						Manage Casual Contacts
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
							<a class="">View Casual Contacts</a>
						</Link>
					</div>

					{/* hotspot */}
					<button class="dropdown-btn py-2">
						Manage Hotspots
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

					{/* <a href="#contact">Search</a> */}
				</div>
			</div>
		);
	}
}

export default NavBar;
