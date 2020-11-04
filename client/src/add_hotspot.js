import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import NavBar from "./NavBar";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
// link this page to another page
import { Link } from "react-router-dom";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({}) => (
	<img
		src={require("./assets/marker_icon.png")}
		style={{ height: 35, width: 35 }}
	/>
);

class add_hotspot extends Component {
	constructor() {
		super();
		this.startup();
		this.state = {
			search_prediction: null,
			search_prediction_selected: true,
			region: { lat: 5.4022499, lng: 100.3093698 },
			place_lat: 5.4022499,
			place_lng: 100.3093698,
			place_id: null,
			place_name: null,
			search_query: null,
			hotspot_place_name: null,
			hotspot_place_state: "KUALA LUMPUR",
			hotspot_place_address: null,
			hotspot_description: null,
			hotspot_remark: null,
			verify_token: false,
		};
	}

	// signals that the all components have rendered properly
	componentDidMount() {}

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
	};

	addNewHotspot = async () => {
		var {
			place_id,
			place_lat,
			place_lng,
			hotspot_place_name,
			hotspot_place_address,
			hotspot_place_state,
			hotspot_description,
			hotspot_remark,
		} = this.state;

		if (
			hotspot_place_name == null ||
			hotspot_place_name == "" ||
			hotspot_description == null ||
			hotspot_description == "" ||
			hotspot_remark == null ||
			hotspot_remark == "" ||
			hotspot_place_address == null ||
			hotspot_place_address == "" ||
			hotspot_place_state == null ||
			hotspot_place_state == ""
		) {
			alert("Please fill in every input");
			return;
		}

		if (
			place_id == null ||
			place_id == "" ||
			place_lat == null ||
			place_lat == "" ||
			place_lng == null ||
			place_lng == ""
		) {
			alert("Please select a location");
			return;
		}

		await fetch("/add_new_hotspot", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				place_id: place_id,
				place_lat: place_lat.toString(),
				place_lng: place_lng.toString(),
				place_name: hotspot_place_name,
				place_address: hotspot_place_address,
				place_state: hotspot_place_state,
				description: hotspot_description,
				remark: hotspot_remark,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((response) => {
				if (response == "success") {
					alert("Added successfully");
					window.location.reload();
				} else {
					alert(response);
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	getSearchLocation = async (place_id) => {
		const query_get_home_location = `/getSearchLocation?place_id=${place_id}`;
		console.log(query_get_home_location);
		await axios
			.get(query_get_home_location)
			.then((response) => {
				var latitude_res = response.data.result.geometry.location.lat;
				var longitude_res = response.data.result.geometry.location.lng;
				this.setState({
					region: {
						lat: latitude_res,
						lng: longitude_res,
					},
					place_lat: latitude_res,
					place_lng: longitude_res,
					place_id: place_id,
				});
			})
			.catch((error) => {
				alert(error);
			});
	};

	onPressResult = async (place_id, place_name) => {
		this.setState({
			search_prediction_selected: true,
			search_query: "",
			place_name: place_name,
		});
		await this.getSearchLocation(place_id);
	};

	searchLocation = async (value) => {
		const query_search_home_adress = `/searchLocation?search_query=${value}`;
		console.log(query_search_home_adress);
		await axios
			.get(query_search_home_adress)
			.then((response) => {
				this.setState({ search_prediction_selected: false });
				var predicted_places = [];
				var predictions = response.data.predictions;
				predictions.forEach(function (item) {
					predicted_places.push({
						place_name: item.description,
						place_id: item.place_id,
					});
				});

				this.setState({
					search_prediction: predicted_places,
				});
			})
			.catch((error) => {
				alert(error);
			});
	};

	handleChange = async (e) => {
		this.setState({ search_query: e.target.value });
		if (e.target.value.length > 10) {
			await this.searchLocation(e.target.value);
		} else {
			this.setState({
				search_prediction: [],
			});
		}
	};

	render() {
		var {
			search_prediction,
			search_prediction_selected,
			region,
			place_lat,
			place_lng,
			place_id,
			search_query,
			verify_token,
		} = this.state;

		if (!verify_token) return <div />;

		return (
			<div class="">
				<NavBar />
				<div class="page_header">
					<div class="page_title">Add New Hotspot</div>
				</div>
				<div class="page_content">
					<h2>Add New Hotspot</h2>
					<br />
					<div id="update_hotspot_details_outer">
						<div class="input_outer">
							<div class="label_outer">
								<label for="place_name">Place Name</label>
							</div>
							<input
								placeholder="Place Name"
								type="text"
								className="form-control"
								name="place_name"
								id="place_name"
								ref="place_name"
								value={this.state.hotspot_place_name}
								onChange={(e) => {
									this.setState({ hotspot_place_name: e.target.value });
								}}
								required
							/>
						</div>

						<div class="input_outer">
							<div class="label_outer">
								<label for="place_address">Address</label>
							</div>
							<input
								placeholder="Address"
								type="text"
								className="form-control"
								name="place_address"
								id="place_address"
								ref="place_address"
								value={this.state.hotspot_place_address}
								onChange={(e) => {
									this.setState({ hotspot_place_address: e.target.value });
								}}
								required
							/>
						</div>

						<div class="input_outer">
							<div class="label_outer">
								<label for="place_state">State</label>
							</div>
							<select
								class="form-control"
								name="place_state"
								id="place_state"
								ref="place_state"
								value={this.state.hotspot_place_state}
								onChange={(e) => {
									this.setState({ hotspot_place_state: e.target.value });
								}}
							>
								<option value="KUALA LUMPUR">KUALA LUMPUR</option>
								<option value="LABUAN">LABUAN</option>
								<option value="PUTRAJAYA">PUTRAJAYA</option>
								<option value="JOHOR">JOHOR</option>
								<option value="KEDAH">KEDAH</option>
								<option value="KELANTAN">KELANTAN</option>
								<option value="MELAKA">MELAKA</option>
								<option value="NEGERI SEMBILAN">NEGERI SEMBILAN</option>
								<option value="PAHANG">PAHANG</option>
								<option value="PERAK">PERAK</option>
								<option value="PERLIS">PERLIS</option>
								<option value="PULAU PINANG">PULAU PINANG</option>
								<option value="SABAH">SABAH</option>
								<option value="SARAWAK">SARAWAK</option>
								<option value="SELANGOR">SELANGOR</option>
								<option value="TERENGGANU">TERENGGANU</option>
							</select>
						</div>

						<div class="input_outer">
							<div class="label_outer">
								<label for="description">Description</label>
							</div>
							<textarea
								placeholder="Description"
								type="text"
								rows={3}
								maxlength="1000"
								className="form-control"
								name="description"
								id="description"
								ref="description"
								onChange={(e) => {
									this.setState({
										hotspot_description: e.target.value,
									});
								}}
								required
							>
								{this.state.hotspot_description}
							</textarea>
						</div>

						<div class="input_outer">
							<div class="label_outer">
								<label for="remark">Remark</label>
							</div>
							<textarea
								placeholder="Remark"
								type="text"
								rows={3}
								maxlength="1000"
								className="form-control"
								name="remark"
								id="remark"
								ref="remark"
								onChange={(e) => {
									this.setState({ hotspot_remark: e.target.value });
								}}
								required
							>
								{this.state.hotspot_remark}
							</textarea>
						</div>
						<br />
						<div class="label_outer_add">
							<label for="search_query">Search for location</label>
						</div>
						<div class="search_place_outer_add">
							<input
								placeholder="Search place"
								type="text"
								className="form-control"
								name="search_query"
								id="search_query"
								ref="search_query"
								value={this.state.search_query}
								onChange={(e) => {
									this.handleChange(e);
								}}
								required
							/>
							<div
								class={
									search_prediction_selected
										? "predict_dropdown_hidden"
										: "predict_dropdown_show_add"
								}
							>
								{search_prediction === null ? (
									<p></p>
								) : (
									search_prediction.map((item) => (
										<p
											style={{ paddingVertical: 10, cursor: "pointer" }}
											key={item.place_id}
											onClick={() =>
												this.onPressResult(item.place_id, item.place_name)
											}
										>
											{item.place_name}
										</p>
									))
								)}
							</div>
						</div>

						{place_id == null ? (
							<div class="no_location_selected"> No location is selected</div>
						) : (
							<div class="location_selected">
								Location has been selected {"\n"}
								<p class="mb-0">{this.state.place_name}</p>
							</div>
						)}

						<br />
						<div style={{ height: "500px", width: "750px" }}>
							<GoogleMapReact
								// bootstrapURLKeys={
								// 	{
								// 		key: "tempapikey",
								// 	}
								// }
								center={region}
								defaultZoom={16}
							>
								<AnyReactComponent
									lat={place_lat}
									lng={place_lng}
									// text="My Marker"
								/>
							</GoogleMapReact>
						</div>
						<br />
						<button
							class="px-5 py-2 manage_btn register btn btn-success"
							// disabled={this.isDisable(value)}
							onClick={() => this.addNewHotspot()}
						>
							Add Hotspot
						</button>
						<br />
						<br />
					</div>
				</div>
			</div>
		);
	}
}

export default add_hotspot;
