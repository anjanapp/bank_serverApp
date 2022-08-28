//request solving---req will come in this page beacuse our servers entry point(index.js) is this

//server creation

//1. import express
const express = require('express')

  //import jsonwebtoken
const jwt = require('jsonwebtoken')

//import cors
const cors= require('cors')

//import dataservices--to access functions in dataservice file
const dataService = require('./services/data.service')

//2.server app creation using express
const app = express()

//cors use in  server app  --this after creating server app otherwise they will ask to create app
app.use(cors({
    origin:'http://localhost:4200'     //path of client,telling to server from which front end the resource is sharing
}))

//parse JSON data--the data coming will be normal text convert it to json format---mention after creating app
app.use(express.json())

//application specific middleware
const appMiddleware=(req,res,next)=>{
    console.log("appication specific middleware");
    next()
}
//use middleware
app.use(appMiddleware)

//bank server
//router specific middleware
const jwtMiddleware = (req,res,next)=>{

    try{//when user login       --if error executes the catch block
            //fetch token    
    token = req.headers['x-access-token']   //secure data pass in header not body
    //verify token
    const data = jwt.verify(token,'supersecretkey12345')
    console.log(data); //data consist of loginned person acno
    req.currentAcno=data.currentAcno   //the currentacno in data is assigned to the current acno of req which is the variable given in argument,and this is taken to deposit and login for checking loginned user is depositting
    console.log(token);
    next()
   }
   catch{
       //invalid token,when user not login
       res.status(401).json({
           status:false,
           statusCode:401,
           message:'please log in'
       })
   }

}


//register API //register calling
app.post('/register',(req,res)=>{
    //register solving    //asynchronous because asynchronous functn in db.js call this
     //asynchronous function cannot put  in a const var because the o/p will come later// function in dataService          //when user enters details in form it will be a req in body when coming to server
    dataService.register(req.body.username,req.body.acno,req.body.password)
          
        .then(result=>{                                   //request resolving--line 66 will return something that is result
            res.status(result.statusCode).json(result)      //if that result came this will be the response

        })
    // if(result){
    //     res.send('registered successfully')

    // }
    // else{
    //     res.send('already registered...please Log In')
    // }


})

//login API
app.post('/login',(req,res)=>{
    //login solving - asynchronous
    dataService.login(req.body.acno,req.body.pswd)
    .then(result=>{
        res.status(result.statusCode).json(result)
})
})


//deposit API          //before deposit check the middleware
app.post('/deposit',jwtMiddleware,(req,res)=>{
    //asynchronous      //currentacno is put inside req
    dataService.deposit(req,req.body.acno,req.body.password,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
})
})

//withdraw API
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    dataService.withdraw(req,req.body.acno,req.body.password,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
})
})


//transaction API
app.post('/transaction',jwtMiddleware,(req,res)=>{
    dataService.getTransaction(req.body.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
})
})

//deleteAcc API
app.delete('/deleteAcc/:acno',jwtMiddleware,(req,res)=>{
                         //delete acno inside the req url that is in req params acno..req parameter section
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
})

})








//4.user request resolving

//GET REQUEST  ,only request that can view in browser[to fetch data]
app.get('/',(req,res)=>{
    res.send("GET Request")
})

//POST REQUEST[to create data]
app.post('/',(req,res)=>{
    res.send("POST Request")
})

//PUT REQUEST[to modify entire data] 
app.put('/',(req,res)=>{
    res.send("PUT Request")
})

//PATCH REQUEST[to modify partially]
app.patch('/',(req,res)=>{
    res.send("PATCH Request")
})

//DELETE REQUEST[to modify partially]
app.delete('/',(req,res)=>{
    res.send("DELETE Request")
})



//3.set up the port number to the server app
app.listen(3000,()=>{
    console.log("server started at 3000");
})