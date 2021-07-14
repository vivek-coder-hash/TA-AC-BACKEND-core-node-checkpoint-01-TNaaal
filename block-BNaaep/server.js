var http = require("http")
var server = http.createServer(handleRequest)
var url = require("url")
var fs = require("fs")
var path = require("path")
var qs = require("querystring")
const { RSA_NO_PADDING } = require("constants")


function handleRequest(req,res) {
    var parsedUrl=url.parse(req.url , true)
    var pathname = parsedUrl.pathname
    var store= ""
 req.on("data" , (chunk)=> {
     store=store+chunk
 })
    

  req.on("end" , ()=> {
    if (req.method === "GET" && req.url === "/") {
        res.setHeader("Content-Type" , "text/html")
        fs.readFile("./index.html" , (err,content)=> {
            //fs.createReadStream("./index.html").pipe(res)
            res.end(content)
        })
    }

    if (req.method === "GET" && req.url === "/about") {
        res.setHeader("Content-Type" , "text/html")
        fs.readFile("./about.html" , (err,content)=> {
            //fs.createReadStream("./index.html").pipe(res)
            res.end(content)
        })
    }

     if (['jpg', 'png'].includes(req.url.split('.').pop())) {
        
         console.log(req.url)
        fs.createReadStream(path.join(__dirname, req.url)).pipe(res);
      }


      if (["css"].includes(req.url.split('.').pop())) {
        
        
        fs.createReadStream(path.join(__dirname, req.url)).pipe(res);
      }


      if (req.method === "GET" && req.url === "/contact")  {
        
        res.setHeader("Content-Type" , "text/html")
        fs.createReadStream("./form.html").pipe(res)
      }

      if (req.url === "/form" && req.method === "POST")  {
        let parseData = qs.parse(store);
      // console.log(parseData)
        let username = parseData.username;
       // console.log(username)
        let stringData = JSON.stringify(parseData);
       //console.log(stringData)
        fs.open(__dirname+"/contacts/"+username+".json" , "wx" , (err,fd) => {
           if(err) return console.log(err)
 
          // console.log(fd)
          fs.writeFile(fd ,stringData, (err)=> {
              if (err) return console.log(err)
              fs.close(fd , ()=> {
               return   res.end(`${username} created successfully`)
              })
          })
 
        })  //wx is flag ,make sure that file is not already present there. fd is file descriptor , pointer to file which is already created . fd is integer.
 
      } //create file 


    
      if (req.method === "GET" && parsedUrl.pathname === "/users") {
        //console.log(parsedUrl)
        var username = parsedUrl.query.username
        fs.readFile(__dirname+"/contacts/"+username+".json" , (err,content)=> {
            if (err) return console.log(err)
            res.setHeader("Content-Type" , "text/html") 
            res.end(content)
            
        })

     }




      




  })

    




}


server.listen(5000 , ()=> {
    console.log("server listening to port 5000")
})