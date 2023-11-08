const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { origin: 'https://mude.onrender.com/' } })

const users = []
const mensagens = []
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
    return model.find({});
} 
  async function salvarMessage(msg){
    await mongoose.connect(url)
    const model = mongoose.model("messages", Messages)
    // console.log(model);
    // console.log(msg);
    await model.collection.insertOne(msg)
} 


io.on('connection', socket => {
    console.log('Usuário conectado!', socket.id);
    socket.emit

    socket.on('disconnect', reason => {
        console.log('Usuário desconectado!', socket.id)
    })

    socket.on('set_info', info => {
        socket.data.info = info
        // console.log(info);
        socket.join(info.nomeChat)

        let userFound = false;
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === info.username && users[i].nomeChat === info.nomeChat) {
                users[i].id = socket.id
                userFound = true;
                break;
            }
        }
        if (!userFound) {
            users.push({
                username: info.username,
                id: socket.id,
                nomeChat: info.nomeChat
            });
        }

        console.log(users);

        // Emite uma confirmação de que as informações foram configuradas com sucesso
        socket.emit('info_set_confirmation', 'success');
    })


    socket.on('message', data => {
        //salvar msg no banco
        let teste = []
        getAllMessages().
        then((promisse) => {
            let arrayControle = []

            for (let i = 0; i < promisse.length; i++) {
                arrayControle.push(JSON.stringify(promisse[i]));
            }
            for (let j = 0; j < arrayControle.length; j++) {
                // console.log(JSON.parse(arrayControle[j]).nomeChat)
                if(JSON.parse(arrayControle[j]).nomeChat == data.nomeChat){
                    teste.push(JSON.parse(arrayControle[j]))
                }
            }
            teste.push(data)
            io.to(data.nomeChat).emit("message", teste)
            salvarMessage(data)
        })
    })
    
})
server.listen(3001, () => {
    console.log('rodando na 3001');
})