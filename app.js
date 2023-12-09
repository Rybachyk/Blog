let express = require("express");
let app = express();
let PORT = process.env.PORT || 3000;
let path = require("path");
let mongoose=require('mongoose');
let Post = require("./models/postModel.js");
let bodyParser = require("body-parser"); 
const { error } = require("console");
let methodOverride=require("method-override");

let db ='mongodb+srv://Oleksandr:sr10141014@cluster0.plclczg.mongodb.net/Node-blog'

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set('view engine', 'ejs');
let createPath = (page) => path.join(__dirname, "views", `${page}.ejs`);

app.get("/", (req, res) => {
  res.render(createPath("index"), { title: "Головна сторінка" });
});
app.get("/add-post", (req, res) => {
  res.render(createPath("add-post"), { title: "Додати пост" });
});

app.post("/add-post", (req, res) => {
    //res.send(req.body);
    let { title, author } = req.body;
    let post = new Post({ title, author });
  
    post.save()
      .then(() => res.redirect("/posts"))
      .catch((error) => console.log("Saving Error!", error));
  });
  
app.get("/posts", (req, res) => {
  Post.find()
    .then((posts) => res.render(createPath("posts"), { posts, title: "Posts" }))
    .catch((error) => console.log("Finding error! "));
});

app.get("/edit-post/:id",(req,res)=>{
  let id=req.params.id;
  Post.findById(id)
    .then((post)=>
       res.render("edit-post",{title: post.title,id:post._id,post})
    )
    .catch((error)=>{
      console.log(error);
      res.render("error");
    });
});

app.put("/edit-post/:id",(req,res)=>{
  let id=req.params.id;
  const{title,author}=req.body;
  Post.findByIdAndUpdate(id,{title,author})
    .then(()=>res.redirect('/posts'))
    .catch((error)=>{
      console.log(error);
      res.render(createPath("error"));
    });
});

app.delete("/posts/:id", (req, res) => {
  let id = req.params.id;
  Post.findByIdAndDelete(id)
    .then(() => res.redirect("/posts"))
    .catch((error) => {
      console.log(error);
      res.render(createPath("error"));
    });
});

async function start() {
  try {
    await mongoose.connect(db);
    console.log(`Connection to MongoDB is successful!`);
    app.listen(PORT, () => {
      console.log(`Server is listening on PORT ${PORT}...`);
    });
  } catch (error) {
    console.log("\n Connection error !!! \n\n", error);
  }
}

start();


