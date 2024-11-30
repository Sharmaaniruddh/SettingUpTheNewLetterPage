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

    var option ={
        url:"https://us14.api.mailchimp.com/3.0/lists/182dfa13f1",
        method:"POST",
        headers:{
            "Authorization" : "Aniruddh 45722d60491adc3b8de3b8c85688351d-us14 "
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


// 45722d60491adc3b8de3b8c85688351d-us14
//182dfa13f1.