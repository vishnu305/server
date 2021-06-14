const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const port = 4000;
const ObjectId = require('mongoose').Types.ObjectId;
mongoose.connect("mongodb+srv://admin-vishnu:Test123@cluster0.z5urb.mongodb.net/vishnutodolist", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  username: String,
  userid:String,
  password: String
})
const User = mongoose.model("User",userSchema);
const todosSchema = new mongoose.Schema({
  userId: String,
  todos: [{todo: String,date: String,time: String,checked: Boolean}],
})
const Todos = mongoose.model("Todos",todosSchema);

app.use(cors());

app.use(express.json());

app.post("/register", async (req,res)=>{
  const {username,userid,password}=req.body;
  const user = await User.findOne({userid}).exec();
  if (user){
    res.status(500);
    res.json({
      message: "user already exists",
    });
    return;
  }
  await User.create({username,userid,password});
  res.json({message:"success"});

  // User.findOne({email:userid},function(err,foundList){
  //   if(foundList){
  //     console.log("user already exists");
  //     return;
  //   }else{
  //     const user = new User({name: username,email: userid,password: password});
  //     user.save();
  //
  //   }
  // });
});
app.post("/login", async (req,res)=>{
  const { username,userid,password} = req.body;
  const user = await User.findOne({ userid }).exec();
  if(!user || user.password !== password || user.username !== username){
    res.status(403);
    res.json({message:"invalid login",});
    return;
  }
  res.json({message:"success",});

})

app.post("/todos", async (req,res) => {
  const { authorization } = req.headers;
  const [, token]= authorization.split(" ");
  const [userid,password] = token.split(":");
  const user = await User.findOne({ userid }).exec();
  const todosItems = req.body;
  if(!user || user.password !== password){
    res.status(403);
    res.json({message:"invalid access",});
    return;
  }
  console.log(user.username,todosItems);
  const todos = await Todos.findOne({userId: user._id}).exec();
  if(!todos){
    await Todos.create({
      userId:String(user._id),
      todos: todosItems,
    })
  }else{
    todos.todos = todosItems;
    await todos.save();
  }
  res.json(todosItems);
})


app.get("/todos", async (req,res)=>{
  const { authorization } = req.headers;
  const [, token]= authorization.split(" ");
  const [userid,password] = token.split(":");
  const user = await User.findOne({ userid }).exec();
  if(!user || user.password !== password){
    res.status(403);
    res.json();
    return;
  }
  const { todos } = await Todos.findOne({userId: user._id}).exec();
  res.json(todos);
})
app.get("/todoscompleted", async (req,res)=>{
  const { authorization } = req.headers;
  const [, token]=authorization.split(" ");
  const [userid,password] = token.split(":");
  const user = await User.findOne({ userid }).exec();
  if(!user || user.password !== password){
    res.status(403);
    res.json();
    return;
  }
  const { todos } = await Todos.findOne({userId: user._id}).exec();
  console.log(todos);
  for( let i=0;i<todos.length;i++){
    if(todos[i].checked !== true){
      todos.splice(i,1);
    }
  }
  res.json(todos);
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.listen(port,()=>{
    console.log(`Example app listnening at http://localhost:${port}`);
  })
});
