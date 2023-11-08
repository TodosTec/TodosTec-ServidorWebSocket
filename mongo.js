const { MongoClient } = require('mongodb');
const mongoose = require("mongoose")

const url = 'mongodb+srv://user:1234@todostec.7zd8eup.mongodb.net/dbTodosTec?authSource=admin&retryWrites=true&w=majority';
const dbName = 'dbTodosTec';
let array = []

const Messages = new mongoose.Schema({
    username: { type: String, default: 'loro' }, 
  });

  async function getAllMessages(){
    await mongoose.connect(url)
    const model = mongoose.model("messages", Messages)
    return model.find({}).select({"username":1, "_id":0, "room":1, "msg":1});
} 


getAllMessages().
    then((promisse) => {
        // console.log(promisse)
        array = Object.values(promisse) 
        
    })
    