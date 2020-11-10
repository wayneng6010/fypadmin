const express = require("express");
const app = express();
const axios = require("axios");
const userVisitor = require("./Schema").userVisitor;
const userPremiseOwner = require("./Schema").userPremiseOwner;
const premiseQRCode = require("./Schema").premiseQRCode;
const checkInRecord = require("./Schema").checkInRecord;
const visitorDependent = require("./Schema").visitorDependent;
const savedCasualContactsGroup = require("./Schema").savedCasualContactsGroup;
const savedConfirmedCaseCheckIn = require("./Schema").savedConfirmedCaseCheckIn;
const savedCasualContactCheckIn = require("./Schema").savedCasualContactCheckIn;
const hotspot = require("./Schema").hotspot;
const staff = require("./Schema").staff;
const healthRiskAssessmentRecord = require("./Schema")
	.healthRiskAssessmentRecord;

const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var sanitize = require("mongo-sanitize");

var path = require("path");

// cookie parser
var cookieParser = require("cookie-parser");
app.use(cookieParser());

//calling API
//localhost:5000/getArtist?artist_search=artistName
app.get("/getArtist", (req, res) => {
	// default value "smith" for startup search
	const artist_search =
		req.query.artist_search == "" ? "smith" : req.query.artist_search;

	// sort option
	const order = req.query.order;

	const querystr = `https://api.deezer.com/search/artist?q=${artist_search}&order=${order}`;

	axios
		.get(querystr)
		.then((response) => {
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/getArtistTopTrack?artist_id=artistID
app.get("/getArtistTopTrack", (req, res) => {
	const artist_id = req.query.artist_id;

	const querystr = `https://api.deezer.com/artist/${artist_id}/top`;

	axios
		.get(querystr)
		.then((response) => {
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/getArtistTopTrack?artist_id=artistID
app.get("/getArtistRelatedNews", (req, res) => {
	const artist_name = req.query.artist_name;
	const sortBy = req.query.sortBy;
	const language = req.query.language;
	const apikey_news = "fbeba8d45b5c49e88f83dbb9b40cbe48";

	const querystr = `https://newsapi.org/v2/everything?q="${artist_name}"&apiKey=${apikey_news}&sortBy=${sortBy}&language=${language}`;

	axios
		.get(querystr)
		.then((response) => {
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/getSameArtist
app.get("/getSameArtist", (req, res) => {
	Artist.findOne({ ID: req.query.artist_id, UserID: req.cookies["uid"] })
		.then((response) => {
			if (response) {
				res.send(true);
			} else {
				res.send(false);
			}
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/saveArtist?artist_id=artistID
app.get("/saveArtist", (req, res) => {
	const artist_id = req.query.artist_id;

	const querystr = `https://api.deezer.com/artist/${artist_id}`;

	axios
		.get(querystr)
		.then((response) => {
			const artist = new Artist({
				ID: response.data.id,
				Name: response.data.name,
				PictureURL: response.data.picture_medium,
				AlbumNum: response.data.nb_album,
				FansNum: response.data.nb_fan,
				UserID: req.cookies["uid"], // identify saved artist belong to which user
			});

			artist
				.save()
				.then((response) => {
					res.send(response.data);
				})
				.catch((error) => {
					res.status(400).json(error);
				});
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/getAllArtist
app.get("/getAllArtist", (req, res) => {
	Artist.find({ UserID: req.cookies["uid"] })
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/updateArtistImage?imageurl=imageURL
app.get("/updateArtistImage", (req, res) => {
	const record_id = req.query.record_id;
	const image_url = req.query.image_url;
	console.log("record:", record_id);
	console.log("url:", image_url);

	Artist.findOneAndUpdate(
		{ _id: record_id },
		{ $set: { PictureURL: image_url } },
		{ new: true },
		(err, place) => {
			if (err) return res.send(false);
			return res.send(true);
		}
	);
});

//localhost:5000/deleteArtist?title=MovieTitle
app.get("/deleteArtist", (req, res) => {
	Artist.deleteOne({ _id: req.query.record_id })
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/getSameEmail
app.get("/getSameEmail", (req, res) => {
	User.findOne({ email: req.query.email })
		.then((response) => {
			console.log(response);
			if (response) {
				res.send(true);
			} else {
				res.send(false);
			}
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//localhost:5000/register
app.post("/register", async (req, res) => {
	// hash password
	const salt = await bcrypt.genSalt(10);
	const hashPsw = await bcrypt.hash(req.body.user.psw, salt);

	const user = new User({
		name: req.body.user.name,
		email: req.body.user.email,
		password: hashPsw,
	});
	try {
		const savedUser = await user.save();
		res.send({ user: user._id });
	} catch (error) {
		res.status(400).json(error);
	}
});

app.post("/testing", async (req, res) => {
	var now = new Date();
	const user = new visitorDependent({
		ic_num: "432131-02-1234",
		ic_fname: "Judy Ban",
		relationship: "Grandparent",
		user_visitor: "5f3ce1e22beafc1ea0501bc9",
		date_created: new Date(now.getTime() + 480 * 60000),
	});
	try {
		const savedUser = await user.save();
		res.send({ user: user._id });
	} catch (error) {
		res.status(400).json(error);
	}
	// check if email exist
	// const user = await userVisitor.findOne({ phone_no: req.query.phone_no });
	// if (!user) {
	// 	return res.send(false);
	// }

	// const check_in_records = await checkInRecord
	// 	.findOne({ _id: req.body.phone_no })
	// 	.populate("user_visitor");
	// if (!check_in_records) {
	// 	return res.send(false);
	// }
	// res.send(check_in_records);

	// const visitor = await userVisitor.findOne({ ic_num: req.body.visitor_id });
	// if (!visitor) {
	// 	return res.send(false);
	// } else {
	// 	var visitor_id = visitor._id;
	// 	const check_in_records = await checkInRecord.find({
	// 		$and: [
	// 			{ user_visitor: visitor_id },
	// 			{ date_created: { $gte: new Date(req.body.date_from) } },
	// 		],
	// 	});
	// 	if (!check_in_records) {
	// 		return res.send(false);
	// 	} else {
	// 		const check_in_contacts_records = await checkInRecord.find({
	// 			$and: [
	// 				{ user_visitor: { $ne: visitor_id } },
	// 				{ user_premiseowner: check_in_records[0].user_premiseowner },
	// 				{
	// 					date_created: {
	// 						$gte: new Date(req.body.date_from),
	// 						$lte: new Date("2020-08-24T14:11:36.038+00:00"),
	// 					},
	// 				},
	// 			],
	// 		});
	// 		res.send(check_in_contacts_records);
	// 	}
	// }
});

app.post("/search_confirmed_case_by_id", async (req, res) => {
	var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

	if (checkForHexRegExp.test(req.body.group_id)) {
		const savedGroups = await savedCasualContactsGroup
			.findOne({ _id: req.body.group_id })
			.populate("confirmed_case_visitor")
			.populate("confirmed_case_dependent")
			.exec();
		if (!savedGroups) {
			return res.send(false);
		} else {
			return res.send(savedGroups);
		}
	} else {
		return res.send(false);
	}
});

app.post("/getSavedCasualContactsGroups", async (req, res) => {
	const savedGroups = await savedCasualContactsGroup
		.find()
		.populate("confirmed_case_visitor")
		.populate("confirmed_case_dependent")
		.populate("staff")
		.exec();

	if (!savedGroups) {
		return res.send(false);
	}

	// var counter = 0;
	// savedGroups.forEach(async function (item) {
	// 	const savedCheckInCount = await savedConfirmedCaseCheckIn.countDocuments({
	// 		saved_casual_contacts_group: item._id,
	// 	});
	// 	item.check_in_count = savedCheckInCount;
	// 	console.log(item.check_in_count);

	// 	if (counter == savedGroups.length - 1) {
	// 		res.send(savedGroups);
	// 	}
	// 	counter += 1;
	// });

	res.send(savedGroups);
});

app.post("/get_hra_responses_count", async (req, res) => {
	var counter = 0;
	// var groupRecord = req.body.groupRecord;
	const savedHRARecord = await healthRiskAssessmentRecord.find();

	var response_count = {
		yes: new Array(0, 0, 0, 0, 0),
		no: new Array(0, 0, 0, 0, 0),
	};
	savedHRARecord.forEach(async function (item) {
		if (item.responses[0]) {
			response_count.yes[0] += 1;
		} else {
			response_count.no[0] += 1;
		}

		if (item.responses[1]) {
			response_count.yes[1] += 1;
		} else {
			response_count.no[1] += 1;
		}

		if (item.responses[2]) {
			response_count.yes[2] += 1;
		} else {
			response_count.no[2] += 1;
		}

		if (item.responses[3]) {
			response_count.yes[3] += 1;
		} else {
			response_count.no[3] += 1;
		}

		if (item.responses[4]) {
			response_count.yes[4] += 1;
		} else {
			response_count.no[4] += 1;
		}

		if (counter == savedHRARecord.length - 1) {
			res.send(response_count);
		}
		counter += 1;
	});
});

app.post("/get_hra_results_count", async (req, res) => {
	var counter = 0;
	// var groupRecord = req.body.groupRecord;
	const savedHRARecord = await healthRiskAssessmentRecord.find();

	var result_count = new Array(0, 0);
	savedHRARecord.forEach(async function (item) {
		if (item.result) {
			result_count[0] += 1;
		} else {
			result_count[1] += 1;
		}

		if (counter == savedHRARecord.length - 1) {
			res.send(result_count);
		}
		counter += 1;
	});
});

app.post("/get_hra_gender_count", async (req, res) => {
	var counter = 0;
	// var groupRecord = req.body.groupRecord;
	const savedHRARecord = await healthRiskAssessmentRecord
		.find()
		.populate("user_visitor", "ic_num")
		.populate("visitor_dependent", "ic_num")
		.exec();

	var gender_count = new Array(0, 0);
	var ic_num, ic_lastChar;
	savedHRARecord.forEach(async function (item) {
		if (item.visitor_dependent !== undefined) {
			ic_num = item.visitor_dependent.ic_num;
		} else {
			ic_num = item.user_visitor.ic_num;
		}
		ic_lastChar = ic_num.slice(ic_num.length - 1);

		if (ic_lastChar % 2 == 0) {
			gender_count[1] += 1;
		} else {
			gender_count[0] += 1;
		}

		if (counter == savedHRARecord.length - 1) {
			res.send(gender_count);
		}
		counter += 1;
	});
});

app.post("/get_hra_age_count", async (req, res) => {
	var counter = 0;
	// var groupRecord = req.body.groupRecord;
	const savedHRARecord = await healthRiskAssessmentRecord
		.find()
		.populate("user_visitor", "ic_num")
		.populate("visitor_dependent", "ic_num")
		.exec();

	var age_count = new Array(0, 0, 0, 0);
	var ic_num, ic_firstTwoChar, birth_year, age;
	var d = new Date();
	var this_year = d.getFullYear();

	savedHRARecord.forEach(async function (item) {
		if (item.visitor_dependent !== undefined) {
			ic_num = item.visitor_dependent.ic_num;
		} else {
			ic_num = item.user_visitor.ic_num;
		}
		ic_firstTwoChar = ic_num.substring(0, 2);
		if (ic_firstTwoChar < parseInt(this_year.toString().substring(2, 4))) {
			birth_year = 2000 + parseInt(ic_firstTwoChar);
		} else {
			birth_year = 1900 + parseInt(ic_firstTwoChar);
		}

		age = this_year - birth_year;

		if (age <= 14) {
			age_count[0] += 1;
		} else if (age <= 24) {
			age_count[1] += 1;
		} else if (age <= 64) {
			age_count[2] += 1;
		} else if (age > 64) {
			age_count[3] += 1;
		}
		if (counter == savedHRARecord.length - 1) {
			res.send(age_count);
		}
		counter += 1;
	});
});

app.post("/getDashboardData", async (req, res) => {
	var dashboard_data = new Array();
	const ttl_confrimed_case = await savedCasualContactsGroup.countDocuments();
	const ttl_casual_contact = await savedCasualContactCheckIn.countDocuments();
	const ttl_hotspot = await hotspot.countDocuments();
	const ttl_hra_respondent = await healthRiskAssessmentRecord.countDocuments();
	const ttl_staff = await staff.countDocuments();

	dashboard_data[0] = ttl_casual_contact;
	dashboard_data[1] = ttl_hotspot;
	dashboard_data[2] = ttl_hra_respondent;
	dashboard_data[3] = ttl_staff;
	dashboard_data[4] = ttl_confrimed_case;

	res.send(dashboard_data);
});

app.post("/getCheckInCount", async (req, res) => {
	var counter = 0;
	var groupRecord = req.body.groupRecord;
	groupRecord.forEach(async function (item) {
		const savedCheckInCount = await savedConfirmedCaseCheckIn.countDocuments({
			saved_casual_contacts_group: item._id,
		});
		item.check_in_count = savedCheckInCount;
		// console.log(item.check_in_count);
		const savedCasualContactCount = await savedCasualContactCheckIn.countDocuments(
			{
				saved_casual_contacts_group: item._id,
			}
		);
		item.casual_contact_count = savedCasualContactCount;

		if (counter == groupRecord.length - 1) {
			res.send(groupRecord);
		}
		counter += 1;
	});
});

app.post("/getCasualContactCount", async (req, res) => {
	var counter = 0;
	var checkInRecord = req.body.checkInRecord;
	checkInRecord.forEach(async function (item) {
		// console.log(item);
		const savedCasualContactCount = await savedCasualContactCheckIn.countDocuments(
			{
				$and: [
					{
						saved_casual_contacts_group: item.saved_casual_contacts_group,
					},
					{ saved_confirmed_case_check_in: item.check_in_record._id },
				],
			}
		);

		// const savedCasualContactCount = await savedCasualContactCheckIn
		// 	.find({
		// 		$and: [
		// 			{
		// 				saved_casual_contacts_group: item.saved_casual_contacts_group,
		// 			},
		// 			{ saved_confirmed_case_check_in: item.check_in_record._id },
		// 		],
		// 	})
		// 	.count();

		item.casual_contact_count = savedCasualContactCount;

		if (counter == checkInRecord.length - 1) {
			res.send(checkInRecord);
		}
		counter += 1;
	});
});

app.post("/getHotspotCount", async (req, res) => {
	var counter = 0;
	var groupRecord = req.body.groupRecord;
	groupRecord.forEach(async function (item) {
		const savedHotspotCount = await hotspot.countDocuments({
			saved_casual_contacts_group: item._id,
		});
		item.hotspot_count = savedHotspotCount;

		if (counter == groupRecord.length - 1) {
			res.send(groupRecord);
		}
		counter += 1;
	});
});

app.post("/getSavedHotspot_premise", async (req, res) => {
	const savedHotspot = await hotspot
		.find({
			$and: [
				{
					saved_casual_contacts_group: req.body.group_record_id,
				},
				{ type: "premise" },
			],
		})
		.populate("check_in_record")
		.populate("user_premiseowner")
		.exec();

	if (!savedHotspot) {
		return res.send(false);
	}
	res.send(savedHotspot);
});

app.post("/getSavedHotspot_home", async (req, res) => {
	const savedHotspot = await hotspot
		.find({
			$and: [
				{
					saved_casual_contacts_group: req.body.group_record_id,
				},
				{ type: "residential" },
			],
		})
		.populate("user_visitor")
		.exec();

	if (!savedHotspot) {
		return res.send(false);
	}
	res.send(savedHotspot);
});

app.post("/getSavedHotspot_manual_added", async (req, res) => {
	const savedHotspot = await hotspot
		.find({
			type: "manual_added",
		})
		.exec();

	if (!savedHotspot) {
		return res.send(false);
	}
	res.send(savedHotspot);
});

app.get("/searchLocation", (req, res) => {
	const search_query = req.query.search_query;
	const api_key = "AIzaSyDV2M6vNxqRZbKeWuJJ4kMyt9K1hOgSvlo";
	const querystr = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${search_query}&components=country:my&types=establishment&key=${api_key}`;
	axios
		.get(querystr)
		.then((response) => {
			// console.log(response.data);
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

app.get("/getSearchLocation", (req, res) => {
	const place_id = req.query.place_id;
	const api_key = "AIzaSyDV2M6vNxqRZbKeWuJJ4kMyt9K1hOgSvlo";
	// const querystr = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${home_address}&key=${api_key}`;
	const querystr = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=geometry&key=${api_key}`;

	axios
		.get(querystr)
		.then((response) => {
			// console.log(response.data);
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

// app.post("/reactivate_staff_acc", async (req, res) => {
// 	var now = new Date();
// 	staff.findOneAndUpdate(
// 		{ _id: req.body.sid },
// 		{
// 			$set: { date_created: new Date(now.getTime() + 480 * 60000) },
// 		},
// 		{ new: true },
// 		(err, place) => {
// 			if (err) return res.send("failed");
// 			return res.send("success");
// 		}
// 	);
// });

app.post("/search_casual_contact_group", async (req, res) => {
	var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
	var savedGroups;

	if (checkForHexRegExp.test(req.body.search_query)) {
		savedGroups = await savedCasualContactsGroup
			.find({ _id: req.body.search_query })
			.populate("confirmed_case_visitor")
			.populate("confirmed_case_dependent")
			.populate("staff")
			.exec();
	}
	// else {
	// 	try {
	// 		savedGroups = await savedCasualContactsGroup
	// 			.find()
	// 			.populate({
	// 				path: "confirmed_case_visitor",
	// 				match: {
	// 					ic_fname: { $regex: new RegExp(req.body.search_query, "i") },
	// 				},
	// 			})
	// 			.populate("confirmed_case_dependent")
	// 			.populate("staff")
	// 			.exec();
	// 	} catch (err) {
	// 		savedGroups = await savedCasualContactsGroup
	// 			.find()
	// 			.populate("confirmed_case_visitor")
	// 			.populate({
	// 				path: "confirmed_case_dependent",
	// 				match: {
	// 					ic_fname: { $regex: new RegExp(req.body.search_query, "i") },
	// 				},
	// 			})
	// 			.populate("staff")
	// 			.exec();
	// 	}
	// }

	if (!savedGroups) {
		return res.send(false);
	}

	res.send(savedGroups);
});

app.post("/search_confirmed_case_check_in", async (req, res) => {
	var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
	var savedCheckIn;

	if (checkForHexRegExp.test(req.body.search_query)) {
		savedCheckIn = await savedConfirmedCaseCheckIn
			.find({
				$and: [
					{ saved_casual_contacts_group: req.body.group_record_id },
					{ _id: req.body.search_query },
				],
			})
			// .populate("check_in_record")
			.populate({
				path: "check_in_record",
				populate: {
					path: "premise_qr_code",
					select: "entry_point",
				},
			})
			.populate("user_premiseowner")
			.exec();
	} else {
		savedCheckIn = await savedConfirmedCaseCheckIn
			.find({
				saved_casual_contacts_group: req.body.group_record_id,
			})
			// .populate("check_in_record")
			.populate({
				path: "check_in_record",
				populate: {
					path: "premise_qr_code",
					select: "entry_point",
				},
			})
			.populate({
				path: "user_premiseowner",
				match: {
					$or: [
						{
							premise_name: { $regex: new RegExp(req.body.search_query, "i") },
						},
						{
							premise_state: { $regex: new RegExp(req.body.search_query, "i") },
						},
					],
				},
			})
			.exec();
	}

	var filteredRecord = savedCheckIn.filter(function (item) {
		return item.user_premiseowner !== null;
	});

	// console.log(filteredRecord);
	if (!filteredRecord) {
		return res.send(false);
	}
	res.send(filteredRecord);
});

app.post("/search_casual_contact_check_in", async (req, res) => {
	// console.log(req.body.check_in_id);
	var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
	var savedCheckIn;

	if (checkForHexRegExp.test(req.body.search_query)) {
		savedCheckIn = await savedCasualContactCheckIn
			// .find({ saved_confirmed_case_check_in: req.body.check_in_id })
			.find({
				$and: [
					{
						saved_confirmed_case_check_in: req.body.check_in_id,
					},
					{ saved_casual_contacts_group: req.body.check_in_group_id },
					{ _id: req.body.search_query },
				],
			})
			.populate({
				path: "check_in_record",
				populate: {
					path: "premise_qr_code",
					select: "entry_point",
				},
			})
			.populate("user_visitor")
			.populate("visitor_dependent")
			.exec();
	}

	if (!savedCheckIn) {
		return res.send(false);
	}
	res.send(savedCheckIn);
});

app.post("/search_manual_added_hotspot", async (req, res) => {
	const savedHotspot = await hotspot
		.find({
			$and: [
				{
					type: "manual_added",
				},
				{
					$or: [
						{ place_name: { $regex: new RegExp(req.body.search_query, "i") } },
						{
							place_address: { $regex: new RegExp(req.body.search_query, "i") },
						},
						{ place_state: { $regex: new RegExp(req.body.search_query, "i") } },
						{ description: { $regex: new RegExp(req.body.search_query, "i") } },
						{ remark: { $regex: new RegExp(req.body.search_query, "i") } },
					],
				},
			],
		})
		.exec();

	if (!savedHotspot) {
		return res.send(false);
	}
	res.send(savedHotspot);
});

app.post("/search_saved_hotspot_premise", async (req, res) => {
	const savedHotspot = await hotspot
		.find({
			$and: [
				{
					saved_casual_contacts_group: req.body.group_record_id,
				},
				{ type: "premise" },
			],
		})
		.populate("check_in_record")
		// .populate("user_premiseowner")
		.populate({
			path: "user_premiseowner",
			match: {
				$or: [
					{ premise_name: { $regex: new RegExp(req.body.search_query, "i") } },
					{ premise_state: { $regex: new RegExp(req.body.search_query, "i") } },
				],
			},
		})
		.exec();

	var filteredRecord = savedHotspot.filter(function (item) {
		return item.user_premiseowner !== null;
	});

	if (!filteredRecord) {
		return res.send(false);
	}
	res.send(filteredRecord);
});

app.post("/search_staff_list", async (req, res) => {
	var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
	var savedStaff;

	if (checkForHexRegExp.test(req.body.search_query)) {
		savedStaff = await staff.find({
			$or: [
				{ _id: req.body.search_query },
				{ fname: { $regex: new RegExp(req.body.search_query, "i") } }, // case insensitive
				{ email: { $regex: req.body.search_query } },
			],
		});
	} else {
		savedStaff = await staff.find({
			$or: [
				{ fname: { $regex: new RegExp(req.body.search_query, "i") } },
				{ email: { $regex: req.body.search_query } },
			],
		});
	}

	if (!savedStaff) {
		return res.send(false);
	}

	res.send(savedStaff);
});

app.post("/delete_staff", (req, res) => {
	staff
		.deleteOne({ _id: req.body.sid })
		.then((response) => {
			res.send("success");
		})
		.catch((error) => {
			res.send("failed");
		});
});

app.post("/change_staff_role", async (req, res) => {
	const staff_id = req.cookies["sid"];
	// const savedStaff = await staff.findOne({ _id: req.body.sid });

	// var new_role;
	// if (savedStaff.role == 1) {
	// 	new_role = 0;
	// } else {
	// 	new_role = 1;
	// }

	staff.findOneAndUpdate(
		{ _id: staff_id },
		{
			$set: { role: 0 },
		},
		{ new: true },
		(err, place) => {
			if (err) return res.send("failed");
			// return res.send("success");
		}
	);

	staff.findOneAndUpdate(
		{ _id: req.body.sid },
		{
			$set: { role: 1 },
		},
		{ new: true },
		(err, place) => {
			if (err) return res.send("failed");
			return res.send("success");
		}
	);
});

app.post("/get_own_profile_details", async (req, res) => {
	const staff_id = req.cookies["sid"];
	const savedStaff = await staff.findOne({ _id: staff_id });

	if (!savedStaff) {
		return res.send(false);
	}

	res.send(savedStaff);
});

app.post("/update_own_phone_number", async (req, res) => {
	const staff_id = req.cookies["sid"];

	// check if phone number exist
	const staff_info = await staff.findOne({
		$and: [
			{ _id: { $ne: req.cookies["sid"] } },
			{ phone_no: req.body.updated_phone_no },
		],
	});
	if (staff_info) {
		return res.send("failed");
	}

	staff.findOneAndUpdate(
		{ _id: staff_id },
		{
			$set: { phone_no: req.body.updated_phone_no },
		},
		{ new: true },
		(err, place) => {
			if (err) return res.send("failed");
			return res.send("success");
		}
	);
});

app.post("/get_all_staff", async (req, res) => {
	const savedStaff = await staff.find();

	if (!savedStaff) {
		return res.send(false);
	}

	res.send(savedStaff);
});

app.post("/send_batch_email_casual_contact", async (req, res) => {
	const savedCasualContact = await savedCasualContactCheckIn
		.find({
			saved_casual_contacts_group: req.body.group_id,
		})
		.populate("user_visitor", "email")
		.exec();

	var email_list_arr = new Array();
	savedCasualContact.forEach(async function (item) {
		// console.log(item.user_visitor.email);
		email_list_arr.push(item.user_visitor.email);
	});
	var email_list = email_list_arr.join();

	var transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "wayne.ng6010@gmail.com",
			pass: "ozuueiwutugbeakc",
		},
	});

	// const email =
	// 	"p19011719@student.newinti.edu.my, wayne.ng6010@gmail.com, p19011719@student.newinti.edu.my";

	var mailOptions = {
		from: "wayne.ng6010@gmail.com",
		// to: email,
		subject: req.body.email_subject,
		html: req.body.email_content
			.split("\n")
			.join("<br>")
			.split(" ")
			.join("&nbsp;"),
		envelope: {
			from: "wayne.ng6010@gmail.com",
			to: email_list,
		},
	};

	transporter.sendMail(mailOptions, async function (error, info) {
		if (error) {
			// console.log(error);
			res.send("send_email_failed");
		} else {
			res.send("success");
			// console.log("Email sent: " + info.response);
		}
	});
});

app.post("/send_batch_email_premise_owner", async (req, res) => {
	const savedAffectedPremiseOwner = await savedConfirmedCaseCheckIn
		.find({
			saved_casual_contacts_group: req.body.group_id,
		})
		.populate({
			path: "check_in_record",
			populate: {
				path: "user_premiseowner",
				select: "email",
			},
		})
		.exec();

	var email_list_arr = new Array();
	savedAffectedPremiseOwner.forEach(async function (item) {
		// console.log(item.user_visitor.email);
		email_list_arr.push(item.check_in_record.user_premiseowner.email);
	});
	var email_list = email_list_arr.join();

	var transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "wayne.ng6010@gmail.com",
			pass: "ozuueiwutugbeakc",
		},
	});

	// const email =
	// 	"p19011719@student.newinti.edu.my, wayne.ng6010@gmail.com, p19011719@student.newinti.edu.my";

	var mailOptions = {
		from: "wayne.ng6010@gmail.com",
		// to: email,
		subject: req.body.email_subject,
		html: req.body.email_content
			.split("\n")
			.join("<br>")
			.split(" ")
			.join("&nbsp;"),
		envelope: {
			from: "wayne.ng6010@gmail.com",
			to: email_list,
		},
	};

	transporter.sendMail(mailOptions, async function (error, info) {
		if (error) {
			// console.log(error);
			res.send("send_email_failed");
		} else {
			res.send("success");
			// console.log("Email sent: " + info.response);
		}
	});
});

app.post("/add_new_staff", async (req, res) => {
	const fname = req.body.fname;
	const email = req.body.email_address;
	const role = req.body.role;
	const random_psw = req.body.random_psw;
	var now = new Date();

	const salt = await bcrypt.genSalt(10);
	const hashed_psw = await bcrypt.hash(random_psw, salt);
	const savedStaff = new staff({
		fname: fname,
		email: email,
		role: 0,
		password: hashed_psw,
		first_login: true,
		date_created: new Date(now.getTime() + 480 * 60000),
	});
	try {
		const newStaff = await savedStaff.save();
		// res.send("success");
	} catch (error) {
		// console.log(error);
		res.send("email_existed");
		process.exit();
	}

	// if (role == 1) {
	// assigned_role = "ADMIN";
	// } else if (role == 0) {
	var assigned_role = "STAFF";
	// }

	var transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "wayne.ng6010@gmail.com",
			pass: "ozuueiwutugbeakc",
		},
	});

	var mailOptions = {
		from: "wayne.ng6010@gmail.com",
		to: email,
		subject: "COVID-19 Contact Tracing System | Staff Login Credentials",
		html:
			"Good day " +
			fname +
			",<br /><br />You are assigned with <b>" +
			assigned_role +
			" role</b> in COVID-19 Contact Tracing System<br /><br />" +
			"<b><i>Login Credentials</i><br />Email: " +
			email +
			"<br />Temporary Password: " +
			random_psw +
			"</b><br /><br />You are required to <b>change your password</b> during your first login in order to activate your account." +
			"<br />Please activate your account <b>within 3 days time</b> as the temporary password will only last for 3 days." +
			"<br /><br />Regards, <br />COVID-19 Contact Tracing System Team",
	};

	transporter.sendMail(mailOptions, async function (error, info) {
		if (error) {
			// console.log(error);
			res.send("send_email_failed");
		} else {
			res.send("success");
			// console.log("Email sent: " + info.response);
		}
	});
});

app.post("/add_new_hotspot", async (req, res) => {
	const place_id = req.body.place_id;
	const place_lat = req.body.place_lat;
	const place_lng = req.body.place_lng;
	const place_name = req.body.place_name;
	const place_state = req.body.place_state;
	const place_address = req.body.place_address;
	const description = req.body.description;
	const remark = req.body.remark;
	var now = new Date();

	const savedHotspot = new hotspot({
		type: "manual_added",
		place_name: place_name,
		place_address: place_address,
		place_state: place_state,
		description: description,
		remark: remark,
		place_id: place_id,
		place_lat: place_lat,
		place_lng: place_lng,
		date_created: new Date(now.getTime() + 480 * 60000),
	});
	try {
		const newHotspot = await savedHotspot.save();
		res.send("success");
	} catch (error) {
		res.status(400).json(error);
	}
});

app.post("/saveNewHotspotLocation", (req, res) => {
	const record_id = req.body.record_id;
	const place_id = req.body.place_id;
	const place_lat = req.body.place_lat;
	const place_lng = req.body.place_lng;
	// console.log(record_id);
	// console.log(place_id);
	// console.log(place_lat);
	// console.log(place_lng);

	hotspot.findOneAndUpdate(
		{ _id: record_id },
		{
			$set: { place_id: place_id, place_lat: place_lat, place_lng: place_lng },
		},
		{ new: true },
		(err, place) => {
			if (err) return res.send("failed");
			return res.send("success");
		}
	);
});

app.post("/saveHotspotDetails_manual_added", (req, res) => {
	const record_id = req.body.record_id;
	const place_id = req.body.place_id;
	const place_lat = req.body.place_lat;
	const place_lng = req.body.place_lng;
	const place_name = req.body.place_name;
	const place_state = req.body.place_state;
	const place_address = req.body.place_address;
	const description = req.body.description;
	const remark = req.body.remark;

	hotspot.findOneAndUpdate(
		{ _id: record_id },
		{
			$set: {
				place_id: place_id,
				place_lat: place_lat,
				place_lng: place_lng,
				place_name: place_name,
				place_state: place_state,
				place_address: place_address,
				description: description,
				remark: remark,
			},
		},
		{ new: true },
		(err, place) => {
			if (err) return res.send("failed");
			return res.send("success");
		}
	);
});

app.post("/getSelectedSavedCasualContactsGroups", async (req, res) => {
	const savedGroups = await savedCasualContactsGroup
		.findOne({
			_id: req.body.group_record_id,
		})
		.populate("confirmed_case_visitor")
		.populate("confirmed_case_dependent")
		.exec();

	if (!savedGroups) {
		return res.send(false);
	}
	res.send(savedGroups);
});

app.post("/getEachPremiseName", async (req, res) => {
	const premise_info = await userPremiseOwner.findOne({
		_id: req.body.user_premiseowner_id,
	});

	if (!premise_info) {
		return res.send(false);
	}
	res.send(premise_info);
});

app.post("/getConfirmedCaseCheckIns", async (req, res) => {
	// console.log(req.body.group_record_id);
	const savedCheckIns = await savedConfirmedCaseCheckIn
		.find({ saved_casual_contacts_group: req.body.group_record_id })
		// .populate("check_in_record")
		.populate({
			path: "check_in_record",
			populate: {
				path: "premise_qr_code",
				select: "entry_point",
			},
		})
		.populate("user_premiseowner")
		.exec();

	if (!savedCheckIns) {
		return res.send(false);
	}
	res.send(savedCheckIns);
});

app.post("/getSelectedConfirmedCaseCheckIns", async (req, res) => {
	// console.log(req.body.group_record_id);
	const savedCheckIns = await savedConfirmedCaseCheckIn
		.findOne({
			$and: [
				{
					saved_casual_contacts_group: req.body.check_in_group_id,
				},
				{ check_in_record: req.body.check_in_id },
			],
		})
		// .populate("check_in_record")
		.populate({
			path: "check_in_record",
			populate: {
				path: "premise_qr_code",
				select: "entry_point",
			},
		})
		.populate("user_premiseowner")
		.exec();

	if (!savedCheckIns) {
		return res.send(false);
	}
	res.send(savedCheckIns);
});

app.post("/getCasualContactCheckIns", async (req, res) => {
	// console.log(req.body.check_in_id);
	const savedCheckIns = await savedCasualContactCheckIn
		// .find({ saved_confirmed_case_check_in: req.body.check_in_id })
		.find({
			$and: [
				{
					saved_confirmed_case_check_in: req.body.check_in_id,
				},
				{ saved_casual_contacts_group: req.body.check_in_group_id },
			],
		})
		.populate({
			path: "check_in_record",
			populate: {
				path: "premise_qr_code",
				select: "entry_point",
			},
		})
		.populate("user_visitor")
		.populate("visitor_dependent")
		.exec();

	if (!savedCheckIns) {
		return res.send(false);
	}
	res.send(savedCheckIns);
});

app.post("/getSimpCasualContactCheckIns", async (req, res) => {
	// console.log(req.body.check_in_id);
	const savedCheckIns = await savedCasualContactCheckIn
		// .find({ saved_confirmed_case_check_in: req.body.check_in_id })
		.find({
			saved_casual_contacts_group: req.body.group_record_id,
		})
		.populate("check_in_record")
		.populate("user_visitor")
		.populate("visitor_dependent")
		.exec();

	if (!savedCheckIns) {
		return res.send(false);
	}
	res.send(savedCheckIns);
});

app.post("/delete_one_hotspot_record", (req, res) => {
	hotspot
		.deleteOne({ _id: req.body.record_id })
		.then((response) => {
			res.send("success");
		})
		.catch((error) => {
			res.send("failed");
		});
});

app.post("/delete_all_hotspot_record", (req, res) => {
	hotspot
		.deleteMany({ saved_casual_contacts_group: req.body.record_id })
		.then((response) => {
			res.send("success");
		})
		.catch((error) => {
			res.send("failed");
		});
});

app.post("/delete_saved_casual_contact_records", (req, res) => {
	savedCasualContactsGroup
		.deleteMany({ _id: req.body.record_id })
		.then((response) => {
			// res.send("success");
		})
		.catch((error) => {
			res.send("failed");
		});

	savedConfirmedCaseCheckIn
		.deleteMany({ saved_casual_contacts_group: req.body.record_id })
		.then((response) => {
			// res.send("success");
		})
		.catch((error) => {
			res.send("failed");
		});

	savedCasualContactCheckIn
		.deleteMany({ saved_casual_contacts_group: req.body.record_id })
		.then((response) => {
			// res.send("success");
		})
		.catch((error) => {
			res.send("failed");
		});

	hotspot
		.deleteMany({ saved_casual_contacts_group: req.body.record_id })
		.then((response) => {
			res.send("success");
		})
		.catch((error) => {
			res.send("failed");
		});
});

app.post("/savedCasualContactsGroup", async (req, res) => {
	// console.log(req.body.confirmed_case_id);
	// console.log(req.body.confirmed_case_user_type);
	// console.log(req.body.check_in_day_range);
	// console.log(req.body.check_in_time_range_before);
	// console.log(req.body.check_in_time_range_after);
	// console.log(req.body.checked_in_premise);
	// console.log(req.body.casual_contacts_visitors);
	const staff_id = req.cookies["sid"];
	// console.log(staff_id);
	var now = new Date();
	var savedGroup, confirmed_case_info;
	if (req.body.confirmed_case_user_type == "Visitor") {
		savedGroup = new savedCasualContactsGroup({
			confirmed_case_visitor: req.body.confirmed_case_id,
			staff: staff_id,
			day_range_check_in: req.body.check_in_day_range,
			time_range_check_in_before: req.body.check_in_time_range_before,
			time_range_check_in_after: req.body.check_in_time_range_after,
			// completed: false,
			date_created: new Date(now.getTime() + 480 * 60000),
		});
		confirmed_case_info = await userVisitor.findOne({
			ic_num: req.body.confirmed_case_ic_num,
		});
	} else if (req.body.confirmed_case_user_type == "Dependent") {
		savedGroup = new savedCasualContactsGroup({
			confirmed_case_dependent: req.body.confirmed_case_id,
			staff: staff_id,
			day_range_check_in: req.body.check_in_day_range,
			time_range_check_in_before: req.body.check_in_time_range_before,
			time_range_check_in_after: req.body.check_in_time_range_after,
			// completed: false,
			date_created: new Date(now.getTime() + 480 * 60000),
		});
		const dependent = await visitorDependent.findOne({
			ic_num: req.body.confirmed_case_ic_num,
		});
		confirmed_case_info = await userVisitor.findOne({
			_id: dependent.user_visitor,
		});
	}

	try {
		var saved_group = await savedGroup.save();
		req.body.checked_in_premise.forEach(async function (item) {
			// console.log(item._id);
			savedCheckIn = new savedConfirmedCaseCheckIn({
				saved_casual_contacts_group: saved_group._id,
				check_in_record: item._id,
				user_premiseowner: item.user_premiseowner._id,
				// completed: false,
				date_created: new Date(now.getTime() + 480 * 60000),
			});
			await savedCheckIn.save();
		});

		req.body.casual_contacts_visitors.forEach(async function (item) {
			// console.log(item);
			if (item.visitor_dependent !== undefined) {
				saved_casual_contact_check_in = new savedCasualContactCheckIn({
					saved_casual_contacts_group: saved_group._id,
					saved_confirmed_case_check_in: item.check_in_record_id,
					check_in_record: item._id,
					user_visitor: item.user_visitor._id,
					visitor_dependent: item.visitor_dependent._id,
					completed: false,
					date_created: new Date(now.getTime() + 480 * 60000),
				});
			} else {
				saved_casual_contact_check_in = new savedCasualContactCheckIn({
					saved_casual_contacts_group: saved_group._id,
					saved_confirmed_case_check_in: item.check_in_record_id,
					check_in_record: item._id,
					user_visitor: item.user_visitor._id,
					completed: false,
					date_created: new Date(now.getTime() + 480 * 60000),
				});
			}
			await saved_casual_contact_check_in.save();
		});

		savedHomeHotspot = new hotspot({
			saved_casual_contacts_group: saved_group._id,
			type: "residential",
			user_visitor: confirmed_case_info._id,
			place_id: confirmed_case_info.home_id,
			place_lat: confirmed_case_info.home_lat,
			place_lng: confirmed_case_info.home_lng,
			date_created: new Date(now.getTime() + 480 * 60000),
		});
		await savedHomeHotspot.save();

		req.body.checked_in_premise.forEach(async function (item) {
			// console.log(item._id);
			savedHotspot = new hotspot({
				saved_casual_contacts_group: saved_group._id,
				type: "premise",
				check_in_record: item._id,
				user_premiseowner: item.user_premiseowner._id,
				place_id: item.user_premiseowner.premise_id,
				place_lat: item.user_premiseowner.premise_lat,
				place_lng: item.user_premiseowner.premise_lng,
				date_created: new Date(now.getTime() + 480 * 60000),
			});
			await savedHotspot.save();
		});

		return res.send(true);
	} catch (error) {
		res.status(400).json(error);
	}

	// return res.send(true);
});

app.post("/search_confirmed_case_info_visitor", async (req, res) => {
	const visitor = await userVisitor.findOne({ ic_num: req.body.ic_number });
	if (!visitor) {
		// const dependent = await visitorDependent.findOne({
		// 	ic_num: req.body.ic_number,
		// });
		// if (!dependent) {
		// 	return res.send(false);
		// } else {
		// 	return res.send(dependent);
		// }
		return res.send(false);
	} else {
		return res.send(visitor);
	}
});

app.post("/search_confirmed_case_info_dependent", async (req, res) => {
	const dependent = await visitorDependent.findOne({
		ic_num: req.body.ic_number,
	});
	if (!dependent) {
		return res.send(false);
	} else {
		return res.send(dependent);
	}
});

app.post("/search_check_in_records_dependent", async (req, res) => {
	const confirmed_dependent = await visitorDependent.findOne({
		ic_num: req.body.ic_number,
	});
	if (!confirmed_dependent) {
		return res.send(false);
	} else {
		var confirmed_dependent_id = confirmed_dependent._id;
		const check_in_records = await checkInRecord
			.find({
				$and: [
					{
						// $and: [
						// { user_visitor: confirmed_dependent_id },
						// { visitor_dependent: { $exists: false } },
						visitor_dependent: confirmed_dependent_id,
						// { visitor_dependent: confirmed_visitor_id  },
						// ],
					},
					// { user_visitor: confirmed_visitor_id },
					{ date_created: { $gte: new Date(req.body.date_from) } },
				],
			})
			.populate("user_premiseowner")
			.exec();

		if (!check_in_records) {
			return res.send(false);
		}
		res.send(check_in_records);
	}
});

app.post("/search_check_in_records_visitor", async (req, res) => {
	const confirmed_visitor = await userVisitor.findOne({
		ic_num: req.body.ic_number,
	});
	if (!confirmed_visitor) {
		return res.send(false);
	} else {
		var confirmed_visitor_id = confirmed_visitor._id;
		const check_in_records = await checkInRecord
			.find({
				$and: [
					{
						$and: [
							{ user_visitor: confirmed_visitor_id },
							{ visitor_dependent: { $exists: false } },
							// { visitor_dependent: confirmed_visitor_id  },
						],
					},
					// { user_visitor: confirmed_visitor_id },
					{ date_created: { $gte: new Date(req.body.date_from) } },
				],
			})
			.populate("user_premiseowner")
			.exec();

		if (!check_in_records) {
			return res.send(false);
		}
		res.send(check_in_records);
		// if (!check_in_records) {
		// 	return res.send(false);
		// } else {
		// 	const check_in_contacts_records = await checkInRecord.find({
		// 		$and: [
		// 			{ user_visitor: { $ne: visitor_id } },
		// 			{ user_premiseowner: check_in_records[0].user_premiseowner },
		// 			{
		// 				date_created: {
		// 					$gte: new Date(req.body.date_from),
		// 					$lte: new Date("2020-08-24T14:11:36.038+00:00"),
		// 				},
		// 			},
		// 		],
		// 	});
		// 	res.send(check_in_contacts_records);
		// }
	}
});

app.post("/search_casual_contacts_visitor", async (req, res) => {
	// console.log("hey");
	var check_in_contacts_records_arr = new Array();
	const confirmed_visitor = await userVisitor.findOne({
		ic_num: req.body.ic_number,
	});
	if (!confirmed_visitor) {
		return res.send(false);
	} else {
		// return res.send(true);
		var confirmed_visitor_id = confirmed_visitor._id;
		var counter = 0;
		// console.log(JSON.stringify(req.body.check_in_timerange));
		req.body.check_in_timerange.forEach(async function (item) {
			// console.log(new Date(item.time_to));
			const check_in_contacts_records = await checkInRecord
				.find({
					$and: [
						{
							$or: [
								{ user_visitor: { $ne: confirmed_visitor_id } },
								{ visitor_dependent: { $exists: true, $ne: null } },
								// { visitor_dependent: confirmed_visitor_id  },
							],
						},
						{
							user_premiseowner: item.user_premiseowner,
						},
						{
							date_created: {
								$gte: new Date(item.time_from),
								$lte: new Date(item.time_to),
							},
						},
					],
				})
				.populate("user_visitor", { ic_num: 1, ic_fname: 1 })
				.populate("visitor_dependent", { ic_num: 1, ic_fname: 1 })
				.exec();
			// .populate("user_visitor");

			// console.log(check_in_contacts_records);
			// console.log(item.check_in_record_id);
			var check_in_record_id = item.check_in_record_id;
			check_in_contacts_records.forEach(async function (item) {
				// console.log(item.user_visitor);
				// var innerObj = {};
				// innerObj[check_in_record_id] = item;
				// item.check_in_record_id = check_in_record_id;
				// Object.assign(item, {"check_in_record_id": check_in_record_id});
				// item[_id] = { "_id": item._id};

				// item["check_in_record_id"] = check_in_record_id;
				if (item.visitor_dependent !== undefined) {
					check_in_contacts_records_arr.push({
						_id: item._id,
						check_in_record_id: check_in_record_id,
						user_visitor: item.user_visitor,
						user_premiseowner: item.user_premiseowner,
						premise_qr_code: item.premise_qr_code,
						visitor_dependent: item.visitor_dependent,
						date_created: item.date_created,
					});
				} else {
					check_in_contacts_records_arr.push({
						_id: item._id,
						check_in_record_id: check_in_record_id,
						user_visitor: item.user_visitor,
						user_premiseowner: item.user_premiseowner,
						premise_qr_code: item.premise_qr_code,
						// visitor_dependent: item.visitor_dependent,
						date_created: item.date_created,
					});
				}
			});

			if (counter == req.body.check_in_timerange.length - 1) {
				// console.log(check_in_contacts_records_arr);
				res.send(check_in_contacts_records_arr);
			}

			// console.log(check_in_contacts_records_arr_final);
			// res.send(check_in_contacts_records);
			counter += 1;
		});
		// res.send(check_in_contacts_records_arr_final);
	}
});

app.post("/search_casual_contacts_dependent", async (req, res) => {
	// console.log("hey");
	var check_in_contacts_records_arr = new Array();
	const confirmed_visitor = await visitorDependent.findOne({
		ic_num: req.body.ic_number,
	});
	if (!confirmed_visitor) {
		return res.send(false);
	} else {
		// return res.send(true);
		var confirmed_visitor_id = confirmed_visitor._id;
		var counter = 0;
		// console.log(req.body.check_in_timerange);
		req.body.check_in_timerange.forEach(async function (item) {
			// console.log(item);
			const check_in_contacts_records = await checkInRecord
				.find({
					$and: [
						{
							visitor_dependent: { $ne: confirmed_visitor_id },
							// { visitor_dependent: confirmed_visitor_id  },
						},
						{
							user_premiseowner: item.user_premiseowner,
						},
						{
							date_created: {
								$gte: new Date(item.time_from),
								$lte: new Date(item.time_to),
							},
						},
					],
				})
				.populate("user_visitor", { ic_num: 1, ic_fname: 1 })
				.populate("visitor_dependent", { ic_num: 1, ic_fname: 1 })
				.exec();
			// .populate("user_visitor");

			// console.log(check_in_contacts_records);
			// console.log(item.check_in_record_id);
			var check_in_record_id = item.check_in_record_id;
			check_in_contacts_records.forEach(async function (item) {
				// console.log(item);
				// check_in_contacts_records_arr.push(item);
				if (item.visitor_dependent !== undefined) {
					check_in_contacts_records_arr.push({
						_id: item._id,
						check_in_record_id: check_in_record_id,
						user_visitor: item.user_visitor,
						user_premiseowner: item.user_premiseowner,
						premise_qr_code: item.premise_qr_code,
						visitor_dependent: item.visitor_dependent,
						date_created: item.date_created,
					});
				} else {
					check_in_contacts_records_arr.push({
						_id: item._id,
						check_in_record_id: check_in_record_id,
						user_visitor: item.user_visitor,
						user_premiseowner: item.user_premiseowner,
						premise_qr_code: item.premise_qr_code,
						// visitor_dependent: item.visitor_dependent,
						date_created: item.date_created,
					});
				}
			});
			if (counter == req.body.check_in_timerange.length - 1) {
				// console.log(check_in_contacts_records_arr);
				res.send(check_in_contacts_records_arr);
			}

			// console.log(check_in_contacts_records_arr_final);
			// res.send(check_in_contacts_records);
			counter += 1;
		});
		// res.send(check_in_contacts_records_arr_final);
	}
});

//localhost:5000/login
app.post("/login", async (req, res) => {
	var email_sanitized = sanitize(req.body.user.email);
	var password_sanitized = sanitize(req.body.user.psw);

	// console.log("Sanitized object: ");
	// console.log(sanitize({ $ne: 1 }));

	// check if email exist
	const staff_info = await staff.findOne({ email: email_sanitized });
	if (!staff_info) {
		return res.send("failed");
	}

	if (staff_info.first_login == true) {
		var date_created = new Date(staff_info.date_created);
		var validTime = new Date();

		validTime.setDate(validTime.getDate() - 2); // get date of 2 days before
		validTime.setUTCHours(0, 0, 0, 0); // change time to midnight 00:00 of that day

		if (date_created < validTime) {
			return res.send("failed_expired");
		}
	}

	// check if password correct
	const validPsw = await bcrypt.compare(
		password_sanitized,
		staff_info.password
	);
	if (!validPsw) {
		return res.send("failed");
	}

	// create and assign a token
	const token = jwt.sign({ _id: staff_info._id }, "vE7YWqEuJQOXjlKxU7e4SOl");
	// console.log("JWT assigned: " + token);

	// save token and user id to cookie
	res.cookie("auth-token", token); // to verify if user have login
	res.cookie("sid", staff_info._id); // staff id
	res.cookie("fname", staff_info.fname); // will be display on navigation bar (logged in as UserName)
	res.cookie("last_login", staff_info.last_login); // will be display on navigation bar (last login)
	res.cookie("role", staff_info.role); // staff role

	// console.log(req.cookies["last_login"]);

	if (staff_info.first_login == true) {
		res.send("success_first_login");
	} else {
		res.send("success");
	}
});

app.post("/getLoginDetails", async (req, res) => {
	const fname = req.cookies["fname"];
	const last_login = req.cookies["last_login"];
	const role = req.cookies["role"];

	var login_details = new Array();
	login_details.push({ fname: fname, last_login: last_login, role: role });

	res.send(login_details);
});

app.post("/logout", async (req, res) => {
	const staff_id = req.cookies["sid"];
	var now = new Date();

	staff.findOneAndUpdate(
		{ _id: staff_id },
		{
			$set: { last_login: new Date(now.getTime() + 480 * 60000) },
		},
		{ new: true },
		(err, place) => {
			if (err) return res.send(false);
			return res
				.clearCookie("auth-token")
				.clearCookie("sid")
				.clearCookie("fname")
				.clearCookie("last_login")
				.send(true);
		}
	);
});

app.post("/verifyToken", async (req, res) => {
	const token = req.cookies["auth-token"];
	const sid = req.cookies["sid"];
	// console.log(req.cookies["uid"]);

	// if dont have the token
	if (!token) {
		return res.send("failed");
	}
	try {
		// verify token
		const verified = jwt.verify(token, "vE7YWqEuJQOXjlKxU7e4SOl");
		// store user ID and time of token issued to indicate that the user is authenticated
		req.user = verified;

		const staff_info = await staff.findOne({ _id: sid });
		if (!staff_info) {
			return res.send("failed");
		}

		// is it first login
		if (staff_info.first_login == true) {
			return res.send("failed_first_login");
		}

		return res.send("success");
	} catch (err) {
		return res.send("failed");
	}
});

app.post("/change_psw", async (req, res) => {
	const staff_id = req.cookies["sid"];

	const staff_info = await staff.findOne({ _id: staff_id });
	if (!staff_info) {
		return res.send(false);
	}

	const validPsw = await bcrypt.compare(
		req.body.user.current_psw,
		staff_info.password
	);
	if (!validPsw) {
		return res.send(false);
	}

	const samePsw = await bcrypt.compare(
		req.body.user.new_psw,
		staff_info.password
	);
	if (samePsw) {
		return res.send(false);
	}

	const salt = await bcrypt.genSalt(10);
	const hashed_psw = await bcrypt.hash(req.body.user.new_psw, salt);

	staff.findOneAndUpdate(
		{ _id: staff_id },
		{
			$set: { password: hashed_psw },
		},
		{ new: true },
		(err, place) => {
			if (err) return res.send(false);
			return res
				.clearCookie("auth-token")
				.clearCookie("sid")
				.clearCookie("fname")
				.clearCookie("last_login")
				.send(true);
		}
	);
});

app.post("/change_psw_first_login", async (req, res) => {
	const staff_id = req.cookies["sid"];

	const staff_info = await staff.findOne({ _id: staff_id });
	if (!staff_info) {
		return res.send(false);
	}

	const validPsw = await bcrypt.compare(
		req.body.user.old_psw,
		staff_info.password
	);
	if (!validPsw) {
		return res.send(false);
	}

	const samePsw = await bcrypt.compare(
		req.body.user.new_psw,
		staff_info.password
	);
	if (samePsw) {
		return res.send(false);
	}

	const salt = await bcrypt.genSalt(10);
	const hashed_psw = await bcrypt.hash(req.body.user.new_psw, salt);

	staff.findOneAndUpdate(
		{ _id: staff_id },
		{
			$set: { password: hashed_psw, first_login: false },
		},
		{ new: true },
		(err, place) => {
			if (err) return res.send(false);
			return res
				.clearCookie("auth-token")
				.clearCookie("sid")
				.clearCookie("fname")
				.clearCookie("last_login")
				.send(true);
		}
	);
});

app.get("/getUserName", (req, res) => {
	const username = req.cookies["uname"];
	res.send(username);
});

// heroku
if (process.env.NODE_ENV === "production") {
	// Exprees will serve up production assets
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
