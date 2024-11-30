const express =require("express");
const bodyParser =require("body-parser");
const request =require("request");

const app = express();

// Use body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html")
})

app.post("/",function(req,res){
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email; 


    
  // Regular expression for basic email validation
  var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Check if email matches the pattern
  if (!email.match(emailPattern) || !email.endsWith('.com')) {
    console.log("Invalid email format. Email must end with .com.");
    res.sendFile(__dirname + "/failure.html"); // Return failure page if invalid email
    return;
}



    var data = {
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);
     console.log(data);

    var option ={
        url:"https://us14.api.mailchimp.com/3.0/lists/182dfa13f1",
        method:"POST",
        headers:{
            "Authorization" : "Aniruddh fadfa6be3ef76da5efc8de2ead25c606-us14 "
        },
        body:jsonData
    };

    request(option,function(error,response,body){
        if(error){
            console.log("Error connecting to"+error);
            res.sendFile(__dirname+"/failure.html");

        }else{
            if(response.statusCode===200){
                res.sendFile(__dirname+"/success.html");
            } else{
                res.sendFile(__dirname+"/failure.html");

            }
            console.log(response.statusCode);
        }
    });

    
   
});


app.post("/failure",function(req,res){
    res.redirect("/");
})



app.listen(3000 || process.env.PORT,function() {
    console.log("Server is running on port 3000");
});  


// fadfa6be3ef76da5efc8de2ead25c606-us14
//182dfa13f1.