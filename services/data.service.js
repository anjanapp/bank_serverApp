  //logic
  
  //import jsonwebtoken
  const { sign } = require('jsonwebtoken')
const jwt = require('jsonwebtoken')

//import db.js
const db = require('./db')
  //database
  // db = {
  //   1000:{"acno":1000,"username":"neer","password":1000,"balance":50000,transaction:[]},
  //   1001:{"acno":1001,"username":"ram","password":1001,"balance":3000,transaction:[]},
  //   1002:{"acno":1002,"username":"sushmitha","password":1002,"balance":600000,transaction:[]}

  // }


  //dataservice ang register function copy paste here //register definition
  const register = (username,acno,password)=>{
//asynchronous function  //delay in response
    return db.User.findOne({    //only need to find one person so findone,here return stmt to get sommething ingot
      acno      // checking if acno is there
    }).then(user=>{  // request resolving--return response //return a user---entire details of user get from line 21 if there is acno response will get 2 types of response for find one 1.acno user details,2.null if no acno
      console.log(user);
      if(user){   //checking if there is a user 
        return{  // if yes
          status:false,
          message:"Already registered...please Log In",
          statusCode:401
        }

      }
      else{ //insert in db     //if no
          const newUser=new db.User({   //creating an object of model---newUser    //so automatically in the constructor object initialisation will takeplace,so the acno variable here will be stred at acno keyword in db.js an so on
            acno,
            username,
            password,
            balance:0,
            transaction:[]    //objects defined
    

          })                                                                                                              
          newUser.save()    //to store in mongodb---newUser will be automatically save to mongodb or else it will only created in servers mongoose
          return{
            status:true,
            message:"registered successfully",
            statusCode:200
    
          }
         
        }

    })

}

  const login=(acno,pswd)=>{

    return db.User.findOne({
      acno,
      password:pswd
    }).then(user => {
      if(user){
        console.log(user);

        currentUser=user.username
        currentAcno=acno
        //token generation---creating a signature(unique number)
        token = jwt.sign({
          //store account number inside token
          currentAcno:acno   //inside token currentacno will have acno of loginned person
          },'supersecretkey12345')  //secretcode we give,so using this json will automatically create a number
        
        return{
          status:true,
          message:"Log In successfully",
          statusCode:200,
          currentUser,   //welcome username in front end
          currentAcno,
          token
  
        }
          
      }
      else{
        return{
          status:false,
          message:"invalid account number or password!!!",
          statusCode:401
        }
        }
    })
}

 //asynchronous
 const deposit = (req,acno,password,amt)=>{
  var amount=parseInt(amt)

  return db.User.findOne({
    acno,password
  }).then(user=>{
    if(user){
      if(acno!=req.currentAcno){   //checking that the same user loginned is depositing ,if not permission denied
        return{
          status:false,
          message:"permission denied",
          statusCode:401
        }
      }
      user.balance+=amount
      user.transaction.push({
        type:"CREDIT",
        amount:amount
      })
      user.save()
      
      console.log(db);
      return{
        status:true,
        message:amount+"credited successfully..new balance is"+user.balance,
        statusCode:200

      }


    }
    else{
      return{
        status:false,
        message:"invalid account number or password!!!",
        statusCode:401
      }


    }
  })

    }  


   const withdraw = (req,acno,password,amt)=>{
      var amount=parseInt(amt)
      return db.User.findOne({
        acno,password
        }).then(user=>{
          if(user){
            if(acno!=req.currentAcno){
              return{
                status:false,
                message:"permission denied",
                statusCode:401
              }
            }
      
            if(user.balance>amount){
              user.balance-=amount
              user.transaction.push({
                type:"DEBIT",
                amount:amount
              })
              user.save()
              console.log(db);
              
              return{
                status:true,
                message:amount+"withdraw successfully..new balance is"+user.balance,
                statusCode:200
        
              }
          
            }
            else{
              return{
                status:false,
                message:"insufficient balance",
                statusCode:422
              }
                }
  

            }
            else{
              return{
                status:false,
                message:"invalid account number or password!!!",
                statusCode:401
              }
        
        
            }
        



          
        })
      }
      
     const getTransaction = (acno)=>{
       return db.User.findOne({
         acno
       }).then(user=>{
         if(user){
          return{
            status:true,
            statusCode:200,
            transaction:user.transaction
    
          }
  

         }
         else{
          return{
            status:false,
            message:"user does not exist",
            statusCode:401
          }
  
  
        }
  
       })
        
    
    
      }

      //delete
      const deleteAcc = (acno)=>{
        return db.User.findOneAndDelete({
          acno
        }).then(user=>{
          if(!user){
            return{
              status:false,
              message:"operation failed!!",
              statusCode:401
            }
  

          }
          
            return{
              status:true,
              statusCode:200,
              message:"successfully deleted"
      
            }
  

          

        })
      }
    
      
  


  //export
  module.exports={
      register,
      login,
      deposit,
      withdraw,
      getTransaction,
      deleteAcc
  }


// git ignore
  // /node_modules
