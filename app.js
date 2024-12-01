require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

// Use body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static("public"));

// Route for the signup page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

// Handle form submission
app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.match(emailPattern) || !email.endsWith(".com")) {
        console.log("Invalid email format. Email must end with .com.");
        res.sendFile(__dirname + "/failure.html");
        return;
    }

    // Mailchimp data payload
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                },
            },
        ],
    };

    // Mailchimp API request using axios
    axios({
        method: "POST",
        url: `${process.env.MAILCHIMP_BASE_URL}/3.0/lists/${process.env.MAILCHIMP_LIST_ID}`,
        headers: {
            Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`,
            "Content-Type": "application/json",
        },
        data: data,
    })
        .then((response) => {
            if (response.status === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
            console.log("Response Code:", response.status);
        })
        .catch((error) => {
            console.log("Error connecting: " + error.message);
            res.sendFile(__dirname + "/failure.html");
        });
});

// Handle failure page "Try Again" button
app.post("/failure", (req, res) => {
    res.redirect("/");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
