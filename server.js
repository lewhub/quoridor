var express = require("express");
var app = express();
var body_parser = require("body-parser");
var path = require("path");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var dotenv = require("dotenv").config( { silent: true } );
var user_rts = require( "./routes/user_rts.js" );
var mongoose = require("mongoose");
var User = require("./models/user.js");
var port = process.env.PORT || 3000;


// for local testing
// mongoose.connect( "mongodb://localhost/board_game", function(err) {
//     if (err) return console.log(err)
//     console.log("connected to mongodb locally.");
// })

mongoose.connect(process.env.MLAB_URI, function(err){
    if (err) return console.log(err)
    console.log("connected to mongo lab db.");
})


app.use(body_parser.urlencoded( { extended: false } ));
app.use(body_parser.json());
app.use("/", express.static(path.join(__dirname, "public")))

app.use("/users", user_rts);

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
})

var players = new Array();
var player_ids = new Array();
app.post("/host-found/:id", function(req, res) {
    User
        .findOne({_id: req.params.id})
        .exec( function(err, user) {
            if (err) return console.log(err)
            console.log(user._id, "host found route");
            var lobby = io.of("/" + user._id);
            lobby.on("connection", function(socket) {
                console.log("user connected to lobby.")
                lobby.emit("player joined lobby");
                
                socket.on("user id for arr", function(id) {
              
                console.log(players, "in lobby on arr func")
                    if (players.indexOf(id) === -1) {
                        
                          if (players.length !== 2) {
                            players.push(id)
                            
                        }
                        if (players.length === 2) {
                                console.log(players, "game is ready to begin.");
                                lobby.emit("start game", players);
                            } 
                        
                    }
                    
                    
                })

                socket.on("player one turn over", function(){
                    lobby.emit("player one turn over")
                })
                socket.on("player two turn over", function(){
                    lobby.emit("player two turn over")
                })

                socket.on("white pawn pos", function(pos) {
                    lobby.emit("white pawn pos", pos)
                })
                socket.on("black pawn pos", function(pos) {
                    lobby.emit("black pawn pos", pos);
                })
                socket.on("white pawn dropped", function(index){
                    lobby.emit("white pawn dropped", index )
                })
                socket.on("black pawn dropped", function(index){
                    lobby.emit("black pawn dropped", index)
                })


                socket.on("player one horizontal barrier set", function(data) {
                    lobby.emit("player one horizontal barrier set", data);
                })
                socket.on("player two horizontal barrier set", function(data) {
                    lobby.emit("player two horizontal barrier set", data);
                })
                socket.on("player one vertical barrier set", function(data) {
                    lobby.emit("player one vertical barrier set", data);
                })
                socket.on("player two vertical barrier set", function(data) {
                    lobby.emit("player two vertical barrier set", data);
                })

            })
            res.json({success: true, message: "host located", user: user})
        })
})

  
// user unique socket id to identify player one and player two.
io.on("connection", function(socket){
    // console.log("a user connected...");
    // console.log(socket.id, ">>>>client<<<<<")
    
    // counter += 1;

    // console.log("counter increased", counter)
    


    io.emit("user connected")

    // socket.on("user found", function(data) {
    //     if (players.indexOf(data) === -1) {
    //         players.push(data);
    //     }
    
    //     if (players.length === 2) {
    //         console.log(players);
    //         io.emit("both players connected", players);
           

            
    //     }
   
    // })
    // fix socket emmiting events 
    // socket.on("user found with id", function(id) {
    //     var lobby = io.of("/" + id);
    //     io.emit("id to connect to", id)
    //     lobby.on("connection", function(socket) {
    //         console.log("players currently connected to this lobby", players);
            
    //     })
       

    // })
    // console.log(counter, "c <<<<<<")
    

    // io.emit( "user connected" , { user_one: 0, user_two: 0 } );
    // if (counter === 1) {
    //     io.emit("user one connected", { user_one: "user_one", id: socket.id });
    // }
    // if (counter === 2) {
    //     io.emit("user two connected", { user_two: "user_two", id: socket.id });
    // }




   

    socket.on("disconnect", function(){
        // console.log("a user disconnected...");
        console.log(players, "<<< user disconnected. players arr")

        // io.emit("player disconnected")

    })

    
})

// io.on("connection", function(socket){
//     console.log("a user connected...");
//     socket.on("disconnect", function(){
//         console.log("a user disconnected...");
//     })
//     socket.on("chat message", function(msg){
//         console.log("message: " + msg);
//         io.emit("chat message", msg)
//     })
// })

http.listen(port, function(err) {
    if (err) return console.log(err)
    console.log("listening on port: " + port);
})