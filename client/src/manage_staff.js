import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import NavBar from "./NavBar";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
// link this page to another page
import { Link } from "react-router-dom";

class manage_staff extends Component {
	constructor() {
		super();
		this.state = {
			staff_list: null,
			search_query: null,
			verify_token: false,
			verify_role: false,
		};
	}

	// signals that the all components have rendered properly
	componentDidMount() {
		this.startup();
	}

	startup = async () => {
		await fetch("/verifyToken", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData === "failed") {
					this.setState({ verify_token: false });
					window.location.href = "/";
				} else if (jsonData === "success") {
					this.setState({ verify_token: true });
				} else if (jsonData === "failed_first_login") {
					this.setState({ verify_token: false });
					window.location.href = "/change_password_first_login";
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});

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
				if (jsonData[0].role == 0) {
					window.location.href = "/dashboard";
				} else {
					this.setState({ verify_role: true });
				}
			})
			.catch((error) => {
				// alert("Error: " + error);
			});

		// alert(this.state.group_record_id);
		await fetch("/get_all_staff", {
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
				jsonData.forEach(function (item) {
					if (!item.hasOwnProperty("phone_no")) {
						item.phone_no = "-";
					}
					if (item.role == 1) {
						item.role = "Admin";
					} else if (item.role == 0) {
						item.role = "Staff";
					}
					if (item.first_login == true) {
						item.first_login = "No";
					} else if (item.first_login == false) {
						item.first_login = "Yes";
					}
					item.date_created = item.date_created
						.replace("T", " ")
						.substring(0, item.date_created.indexOf(".") - 3);
				});
				this.setState({ staff_list: jsonData });
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	handleCopyID = (sid) => {
		navigator.clipboard.writeText(sid);
		alert("ID copied: " + sid);
	};

	switchRole = async (sid) => {
		var confirm_change = window.confirm(
			"Confirm to switch the role of this staff? Your role will be switched to staff after this."
		);
		if (confirm_change == true) {
			await fetch("/change_staff_role", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ sid: sid }),
			})
				.then((res) => {
					// console.log(JSON.stringify(res.headers));
					return res.text();
				})
				.then((jsonData) => {
					if (jsonData == "success") {
						alert("Role has been changed");
						// this.startup();
						window.location.href = "/logout";
					} else {
						alert("Role failed to change");
					}
				})
				.catch((error) => {
					alert("Error: " + error);
				});
		} else {
			return;
		}
	};

	deleteStaff = async (sid) => {
		var confirm_change = window.confirm("Confirm to delete this staff?");
		if (confirm_change == true) {
			await fetch("/delete_staff", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ sid: sid }),
			})
				.then((res) => {
					// console.log(JSON.stringify(res.headers));
					return res.text();
				})
				.then((jsonData) => {
					if (jsonData == "success") {
						alert("This staff has been deleted");
						this.startup();
					} else {
						alert("Failed to delete this staff");
					}
				})
				.catch((error) => {
					alert("Error: " + error);
				});
		} else {
			return;
		}
	};

	// reactivate_acc = async(sid) => {
	// 	var confirm_reactivate = window.confirm(
	// 		"Confirm to reactivate this staff account?"
	// 	);
	// 	if (confirm_reactivate == true) {
	// 		await fetch("/reactivate_staff_acc", {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify({ sid: sid }),
	// 		})
	// 			.then((res) => {
	// 				// console.log(JSON.stringify(res.headers));
	// 				return res.text();
	// 			})
	// 			.then((jsonData) => {
	// 				if (jsonData == "success") {
	// 					alert("This staff account has been reactivated");
	// 					this.startup();
	// 				} else {
	// 					alert("This staff account failed to reactivate");
	// 				}
	// 			})
	// 			.catch((error) => {
	// 				alert("Error: " + error);
	// 			});
	// 	} else {
	// 		return;
	// 	}
	// };

	// isDisabled = (sid) => {
	// 	var { staff_list } = this.state;
	// 	var disabled = false;
	// 	staff_list.forEach(function (item) {
	// 		if (item._id == sid) {
	// 			if (item.first_login == "Yes") {
	// 				disabled = true;
	// 			}
	// 		}
	// 	});
	// 	return disabled;
	// };

	isDisable_switch = (value) => {
		var { staff_list } = this.state;
		var disabled = false;
		staff_list.forEach(function (item) {
			if (item._id == value) {
				if (item.role == "Admin") {
					disabled = true;
				}
			}
		});
		return disabled;
	};

	isDisable_delete = (value) => {
		var { staff_list } = this.state;
		var disabled = false;
		staff_list.forEach(function (item) {
			if (item._id == value) {
				if (item.role == "Admin") {
					disabled = true;
				}
			}
		});
		return disabled;
	};

	submitSearch = async () => {
		var { search_query } = this.state;

		if (search_query == null) {
			this.startup();
			return;
		}

		if (search_query.trim() == "") {
			this.startup();
			return;
		}

		await fetch("/search_staff_list", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ search_query: search_query }),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				if (jsonData == false) {
					alert("No record found");
				} else {
					jsonData.forEach(function (item) {
						if (!item.hasOwnProperty("phone_no")) {
							item.phone_no = "-";
						}
						if (item.role == 1) {
							item.role = "Admin";
						} else if (item.role == 0) {
							item.role = "Staff";
						}
						if (item.first_login == true) {
							item.first_login = "No";
						} else if (item.first_login == false) {
							item.first_login = "Yes";
						}
						item.date_created = item.date_created
							.replace("T", " ")
							.substring(0, item.date_created.indexOf(".") - 3);
					});
					this.setState({ staff_list: jsonData });
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	render() {
		var { staff_list, verify_token, verify_role } = this.state;
		if (!verify_token || !verify_role) return <div />;
		return (
			<div class="">
				<NavBar />
				<div class="page_header">
					<div class="page_title">Manage Staff</div>
				</div>
				<div class="page_content">
					<h2>Manage Staff</h2>

					<div class="search_outer">
						<div class="row">
							<input
								type="text"
								class="form-control col-sm-3"
								id="search_query"
								name="search_query"
								value={this.state.search_query}
								onChange={(e) => {
									this.setState({ search_query: e.target.value });
								}}
								placeholder="Search staff name / ID / email"
							/>
							<button
								class="btn btn-success col-sm-1 ml-2"
								onClick={() => {
									this.submitSearch();
								}}
								type="submit"
							>
								Search
							</button>
						</div>
					</div>

					<br />
					{staff_list == null ? (
						<p>Loading...</p>
					) : (
						<ReactTable
							data={staff_list}
							columns={[
								{
									Header: "ID",
									accessor: "_id",
									width: 120,
									Cell: (row) => (
										<div class="table_column">
											{"..." +
												row.value.slice(row.value.length - 4).toUpperCase() +
												" "}
											<img
												src="https://www.flaticon.com/svg/static/icons/svg/60/60990.svg"
												width={17}
												title="Copy full ID"
												class="copy_id_icon"
												onClick={() => {
													this.handleCopyID(row.value);
												}}
											/>
										</div>
									),
								},
								{
									Header: "Name",
									accessor: "fname",
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "Email",
									accessor: "email",
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "Phone No.",
									accessor: "phone_no",
									width: 150,
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "Role",
									accessor: "role",
									width: 120,
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "Activated",
									accessor: "first_login",
									width: 120,
									Cell: (row) => (
										<div
											class={
												row.value == "Yes"
													? "table_column_green"
													: "table_column_red"
											}
										>
											{row.value}
										</div>
									),
								},
								{
									Header: "Date Created",
									accessor: "date_created",
									width: 160,
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								// {
								// 	Header: "Reactivate",
								// 	accessor: "_id",
								// 	width: 150,
								// 	Cell: ({ value }) => (
								// 		<div class="table_column_btn">
								// 			<button
								// 				class="manage_btn register btn btn-secondary"
								// 				disabled={this.isDisabled(value)}
								// 				onClick={() => {
								// 					this.reactivate_acc(value);
								// 				}}
								// 			>
								// 				Reactivate
								// 			</button>
								// 		</div>
								// 	),
								// },
								{
									Header: "Switch Role",
									accessor: "_id",
									width: 150,
									Cell: ({ value }) => (
										<div class="table_column_btn">
											<button
												class="manage_btn register btn btn-success"
												onClick={() => {
													this.switchRole(value);
												}}
												disabled={this.isDisable_switch(value)}
											>
												Switch Role
											</button>
										</div>
									),
								},
								{
									Header: "Delete",
									accessor: "_id",
									width: 150,
									Cell: ({ value }) => (
										<div class="table_column_btn">
											<button
												class="manage_btn register btn btn-danger"
												onClick={() => {
													this.deleteStaff(value);
												}}
												disabled={this.isDisable_delete(value)}
											>
												Delete
											</button>
										</div>
									),
								},
							]}
							defaultPageSize={10}
							className="-striped -highlight"
						/>
					)}
				</div>
			</div>
		);
	}
}

export default manage_staff;
