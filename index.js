var ex=require("express");
var app=ex()
const port = process.env.PORT || 7000;
const bodyParser =require("body-parser")
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
const cors=require("cors");
app.use(cors());
const path =require('path')
const multer = require("multer");

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./profilePic");
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname));
    },
});
var upload = multer({
    storage:storage
}).single('file');

app.use('/profilePic',ex.static('profilePic'))



mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/project",
    function(){
        console.log("mongodb id connected");
    }
);

// const  ServerApiVersion = require('mongodb');


// mongoose.connect("mongodb+srv://amanyddv:<password>@cluster0.3bawqzz.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
//     .then( () => {
//         console.log('Connected to the database ')
//     })
//     .catch( (err) => {
//         console.error(`Error connecting to the database. n${err}`);
//     })


profileSchema=mongoose.Schema({name:{type:String},email:{type:String},password:{type:String},profile:{type:String}});
var profile=mongoose.model("pros",profileSchema);
profileSchema2=mongoose.Schema({email:{type:String},post:{type:String},comment:{type:String}});
var posts=mongoose.model("posts",profileSchema2);
msg=mongoose.Schema({email:{type:String},msg:{type:String}})
var msg=mongoose.model("msg",msg);

app.post("/addData", function (req,res) {

    upload(req,res,(err)=>{
        if(err){
            console.log(err);
        }
        else{
        }
        const k = new profile({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            profile:req.file.filename
        });
        res.json(k)
        k.save()
    })
    
});

app.post("/showData",function(req,res){
    error="error"
    profile.findOne({email:req.body.email , password:req.body.password},function(err,k){
        if(err){
            console.log(err)
        }
        else{
            res.json(k)
        }
    });
    
});

app.post("/feed",function(req,res){
    console.log(req.body.email)
    error="error"
    posts.find({email:req.body.email , password:req.body.password},function(err,feed){
        if(err){
            console.log(err)
        }
        else{
            res.json(feed)
        }
    });
});

app.post("/addPost",function(req,res){

    upload(req,res,(err)=>{
        if(err){
            console.log(err);
        }
        else{
        console.log(req.file)
        }
        d={
            email:req.body.email,
            comment:req.body.comment,
            post:req.file.filename
        }
        
        let k = new posts(d);
        res.json(k)
        k.save().then(console.log("justtets"));
    })
});

app.get("/peopleInfo",function(req,res){
    profile.find(function(req,data){
        res.json(data)
        console.log(data)
    });
});

app.post("/send",function(req,res){
    d={
        email:req.body.email,
        msg:req.body.msg
    }
    res.json(d)
    let k=new msg(d)
    k.save()
})
app.get("/chat",function(req,res){
    msg.find(function(req,data){
        res.json(data)
        console.log(data)
    });
})
app.post("/forget",function(req,res){
   
    var myquery = {email:req.body.email} && {password:req.body.oldpassword};
    var newvalues = { $set: {password:req.body.newpassword} };
    profile.updateOne(myquery,newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });
    })
    

app.post("/changepic",function(req,res){
    upload(req,res,(err)=>{
        if(err){
            console.log(err);
        }
        else{
        console.log(req.file)
        }
        res.json(req.file.filename)
        
    })
})
app.listen(port,function(){
    console.log("server is running");});