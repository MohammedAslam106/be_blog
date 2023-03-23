// todo-app 
// index.js
const http = require("http");
const DataBase = require("./db.js");

const database = new DataBase("db");



// creating a server
const server = http.createServer();

// Should be able to add blog     POST /blogs
server.on("request",(req,res)=>{
  if(req.method==="POST" && req.url==="/blogs"){
    // get data from the request body
    let body=""
    req.on('data',(chunk)=>{
      body+=chunk
    })
    req.on('end',()=>{
      console.log(body)
      body=JSON.parse(body)
      if(!body.title){
        res.statusCode=400
        res.end("Title is mandatory")
        return
      }
      database.create("blog",{title:body.title,description:body.description,
        imgLink:body.imgLink,created_at:new Date(),updated_at:new Date()
      })
      res.end("success")
    }).on("error",()=>{
      res.end("error")
    })

  }

}) 

// Should be able to read all blogs   GET  /blogs

server.on("request",(req,res)=>{
  if(req.method==="GET" && req.url==="/blogs"){
    const blogs=database.read("blog")
    res.setHeader("Content-Type","application/json")
    res.end(JSON.stringify(blogs))
  }
})

// should be able to read a specific blog GET /blogs/:id

server.on("request",(req,res)=>{
  if(req.method==="GET" && /\/blogs\/\d+$/.test(req.url)){
    const id=Number(req.url.split("/")[2])
    const blog=database.read("blog",id)
    res.setHeader("Content-Type","application/json")
    res.end(JSON.stringify(blog))
  }
})


// should be able to delete a blog
server.on("request",(req,res)=>{
  if(req.method==="DELETE" && /\/blogs\/\d+$/.test(req.url) ){
    const id=Number(req.url.split("/")[2])
    database.delete("blog",id)
    res.end("success")
  }
})


// should be able to edit a blog    PATCH  /blogs/:id
server.on("request",(req,res)=>{
  if (req.method==="PATCH" && /\/blogs\/\d+$/.test(req.url)){
    const id=Number(req.url.split("/")[2])
    
    // getting the data from the body
    body=""
    req.on("data",(chunk)=>{
      body+=chunk
    }).on("end",()=>{
      body=JSON.parse(body)
      if (body.created_at || body.updated_at){
        res.statusCode=400
        res.end("You can't change the created_at and udated_at")
        return
      }

      database.update("blog",id,{...body, updated_at:new Date()})
      res.end("success")
    }).on("error",()=>{
      res.end("error")
    })
  }
})

server.listen(3000);