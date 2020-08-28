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
					<p>COVID-19 Contact Tracing System</p>
					<p>Admin Panel</p>
					<Link
						to={{
							pathname: `/`,
						}}
					>
						<a class="btn btn-primary btn-lg">Dashboard</a>
					</Link>
					<Link
						to={{
							pathname: `/search_casual_contacts`,
						}}
					>
						<a class="btn btn-primary btn-lg">Trace Casual Contacts</a>
					</Link>
					<button class="dropdown-btn">
						Dropdown
						<i class="fa fa-caret-down"></i>
					</button>
					<div class="dropdown-container">
						<Link
							to={{
								pathname: `/search_casual_contacts`,
							}}
						>
							<a class="btn btn-primary btn-lg">Trace Casual Contacts</a>
						</Link>
						<Link
							to={{
								pathname: `/`,
							}}
						>
							<a class="btn btn-primary btn-lg">Dashboard</a>
						</Link>
					</div>
					<a href="#contact">Search</a>
				</div>
			</div>
		);
	}
}

export default NavBar;
