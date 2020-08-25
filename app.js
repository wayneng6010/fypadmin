const express = require("express");
const app = express();
const axios = require("axios");
const userVisitor = require("./Schema").userVisitor;
const userPremiseOwner = require("./Schema").userPremiseOwner;
const premiseQRCode = require("./Schema").premiseQRCode;
const checkInRecord = require("./Schema").checkInRecord;
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
var path = require("path");

// cookie parser
// var cookieParser = require("cookie-parser");
// app.use(cookieParser());

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

	const visitor = await userVisitor.findOne({ ic_num: req.body.visitor_id });
	if (!visitor) {
		return res.send(false);
	} else {
		var visitor_id = visitor._id;
		const check_in_records = await checkInRecord.find({
			$and: [
				{ user_visitor: visitor_id },
				{ date_created: { $gte: new Date(req.body.date_from) } },
			],
		});
		if (!check_in_records) {
			return res.send(false);
		} else {
			const check_in_contacts_records = await checkInRecord.find({
				$and: [
					{ user_visitor: { $ne: visitor_id } },
					{ user_premiseowner: check_in_records[0].user_premiseowner },
					{
						date_created: {
							$gte: new Date(req.body.date_from),
							$lte: new Date("2020-08-24T14:11:36.038+00:00"),
						},
					},
				],
			});
			res.send(check_in_contacts_records);
		}
	}
});

app.post("/search_casual_contacts", async (req, res) => {
	const confirmed_visitor = await userVisitor.findOne({
		ic_num: req.body.ic_number,
	});
	if (!confirmed_visitor) {
		return res.send(false);
	} else {
		var confirmed_visitor_id = confirmed_visitor._id;
		const check_in_records = await checkInRecord.find({
			$and: [
				{ user_visitor: confirmed_visitor_id },
				{ date_created: { $gte: new Date(req.body.date_from) } },
			],
		});
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

app.post("/search_casual_contacts_1", async (req, res) => {
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
		req.body.check_in_timerange.forEach(async function (item) {
			// console.log(item);
			const check_in_contacts_records = await checkInRecord.find({
				$and: [
					{ user_visitor: { $ne: confirmed_visitor_id } },
					{
						user_premiseowner: req.body.check_in_timerange[0].user_premiseowner,
					},
					{
						date_created: {
							$gte: new Date(req.body.check_in_timerange[0].time_from),
							$lte: new Date(req.body.check_in_timerange[0].time_to),
						},
					},
				],
			});

			// console.log(check_in_contacts_records);
			check_in_contacts_records.forEach(async function (item) {
				// console.log(item);
				check_in_contacts_records_arr.push(item);
			});
			if (counter == req.body.check_in_timerange.length - 1) {
				console.log(check_in_contacts_records_arr);
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
	// check if email exist
	const user = await User.findOne({ email: req.body.user.email });
	if (!user) {
		return res.send(false);
	}

	// check if password correct
	const validPsw = await bcrypt.compare(req.body.user.psw, user.password);
	if (!validPsw) {
		return res.send(false);
	}

	// create and assign a token
	const token = jwt.sign({ _id: user._id }, "vE7YWqEuJQOXjlKxU7e4SOl");

	// save token and user id to cookie
	res.cookie("auth-token", token); // to verify if user have login
	res.cookie("uid", user._id); // while be used while saving artist
	res.cookie("uname", user.name); // will be display on navigation bar (logged in as UserName)
	res.send(true);
});

app.post("/logout", async (req, res) => {
	// clear auth-token cookie and user id cookie
	res
		.clearCookie("auth-token")
		.clearCookie("uid")
		.clearCookie("uname")
		.send(true);
});

app.get("/verifyToken", (req, res) => {
	const token = req.cookies["auth-token"];
	console.log(req.cookies["uid"]);

	// if dont have the token
	if (!token) {
		console.log("Access Denied");
		return res.send("Access Denied");
	}
	try {
		// verify token
		const verified = jwt.verify(token, "vE7YWqEuJQOXjlKxU7e4SOl");
		// store user ID and time of token issued to indicate that the user is authenticated
		req.user = verified;
		return res.send("Access Granted");
	} catch (err) {
		console.log("Invalid token");
		return res.send("Invalid token");
	}
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
