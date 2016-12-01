( function(){
    // todo --> write one player function
    angular.module("board_game")
        .controller( "GameController", GameController )

        GameController.$inject = ["user_fac", "$window", "$stateParams", "$state"];

        function GameController(user_fac, $window, $stateParams, $state) {
            
            var vm = this;
            vm.title = "game view."
            console.log($stateParams.host_id, "<<<< state params")

            vm.host_id = $stateParams.host_id;
            // create socket connection for changing turns and playing with someone on a different computer with socket.io.
            // complete sockets. todo: fix double pawn when dropped.

            // var main_socket = io();

            // main_socket.on("user connected", function(){

            // })

            var socket = io("/" + vm.host_id);
            console.log(socket, "<<<<< socket for current lobby.")
            
            socket.on("player joined lobby", function(){
                console.log("a player just joined this lobby.");
                socket.emit("user id for arr", $window.localStorage["current-user-id"])
            })

            // socket.on("start game", function(players) {

            // })

            //  $(window).on("beforeunload", function() {
            //     socket.close();
            // })
           


            socket.on("user connected", function(){
                console.log("a user just connected.")
                var local_id = $window.localStorage["current-user-id"];
                user_fac
                    .show(local_id)
                    .then(user_callback, err_callback);
            })

            socket.on("start game", function(players) {
                console.log("both players connected")
                // console.log(players)
                if (vm.host_id === players[0]) {
                    vm.player_one = players[0];
                    vm.player_two = players[1];
                }
                else if (vm.host_id === players[1]) {
                    vm.player_one = players[1];
                    vm.player_two = players[0];
                }

     
                
                // if (vm.player_one === $window.localStorage["current-user-id"]) {
                //     socket.emit("user found with id", $window.localStorage["current-user-id"]);
                // }
                
                console.log(vm.player_one, vm.player_two)
                if (vm.player_one === $window.localStorage["current-user-id"]) {
                    highlight_sq("#white-pawn");
                    $("#black-pawn").draggable("disable");
                } else if (vm.player_two === $window.localStorage["current-user-id"]) {
                    $("#white-pawn").draggable("disable");
                     if (vm.player_two === $window.localStorage["current-user-id"]) {
                    document.getElementById("place-wall").disabled = true;
                    document.getElementById("place-v-wall").disabled = true;
                }
                }
            })

            socket.on("zero out players", function(){
                vm.player_one = "";
                vm.player_two = "";
                socket.disconnect();
             
            })

            // socket.on("id to connect to", function(id) {
            //     console.log("both players are connecting to this namespance", id)
            //     // socket = io("/" + id);
            //     //      console.log("socket >>>>", socket)
            // })

            

            socket.on("player disconnected", function(){
                // vm.player_one = "";
                // vm.player_two = "";
            })

            function user_callback(res) {
                // console.log(res.data.user);
                // var user_info = res.data.user;
                // socket.emit("user found", user_info.email);
          
            }

            function err_callback(res) {
                console.log("error.");
                console.log(res);
            }

            var game_board = $("#game-board");
            var square_arr = new Array();
            var cancel_btn = $("#cancel-wall-btn");
            var current_player = "1";
            var white_pawn_b_count = 10;
            var black_pawn_b_count = 10;
            var count_div = $("#b-count-span");
            var turn_div = $("#player-turn-span");
            var reset_btn = $("#reset-btn");
            var win_reset_btn = $("#win-reset-btn");
            var close_win_screen = $("#close-win-screen");
            var win_screen_div = $("#winner-screen");
            var winner_text = $("#win-text-player");
            var close_in = $("#close-intro-screen");
            var open_in = $("#intro-in-btn");
            create_divs();
            create_pawns();
            
            
            

            open_in.on("click", function(){
                $("#instruction-screen").slideDown(3000);
            })


            close_in.on("click", function(){
                $("#instruction-screen").slideUp(700);
            })


            close_win_screen.on("click", function(){
                win_screen_div.slideUp(700);
            })

            // win_screen_div.slideDown(3000);

            // console.log(valid_squares("#black-pawn"))



            // pawn placement indexes for square_arr
            // 4 is middle top
            // 76 is middle bottom

            reset_btn.on("click", function(){
                var reset = confirm("Are you sure you want to start over?");
                if (reset) {
                    window.location.reload();
                    // $state.go("join-lobby");
                    socket.disconnect();
                    // socket.emit("zero out players")
                    
                }
                

            
            })

            win_reset_btn.on("click", function(){
                window.location.reload();
                socket.disconnect();
                // socket.emit("zero out players")
               
            })

            function check_for_winner(){
                console.log("checking for winner...");
                var w_p_sq = document.querySelector("#white-pawn").parentElement;
                var b_p_sq = document.querySelector("#black-pawn").parentElement;
                var i_b = square_arr.indexOf(b_p_sq);
                var i_w = square_arr.indexOf(w_p_sq);
                console.log(i_b, i_w)
                if (i_b === 72 || i_b === 73 || i_b === 74 || i_b === 75 || i_b === 76 || i_b === 77 || i_b === 78 || i_b === 79 || i_b === 80) {
                    // alert("black pawn made it to the other side of the board. Player Two Wins!!!");
                    winner_text.text("Player Two (Black Pawn) Wins!!");
                    win_screen_div.slideDown(3000);
                    $("#white-pawn").draggable("disable");
                    $("#black-pawn").draggable("disable");
                    return true;
                }
                if (i_w === 0 || i_w === 1 || i_w === 2 || i_w === 3 || i_w === 4 || i_w === 5 || i_w === 6 || i_w === 7 || i_w === 8) {
                    // alert("white pawn made it to the other side of the board. Player One Wins!!!");
                    winner_text.text("Player One (White Pawn) Wins!!");
                    win_screen_div.slideDown(3000);
                    $("#black-pawn").draggable("disable");
                    $("#white-pawn").draggable("disable");
                    return true;
                }
                return false;
            }


            $(".square").on("click", function(){
                cancel_btn.css({
                    "display": "none"
                })

                var sq = $(this)
                var sq_in = square_arr.indexOf(this);
                var sq_sib_in = square_arr.indexOf(this.nextSibling);
                var sq_sib = $(sq[0].nextSibling);
                var index_top_sq = square_arr.indexOf(this) - 9;
                var sq_top = $(square_arr[index_top_sq]); 
                
                console.log(square_arr.indexOf(this));
                var b_color = "rgb(57, 183, 205)"
                if (sq.css("border-top-color") === b_color) {
                    // console.log($(this).css("border-top-color"))
                    sq.css({ "border-top-color": "#0099CC" })
                    sq_sib.css({ "border-top-color": "#0099CC" })
                    $(".square").off("mouseenter");
                    $(".square").off("mouseleave");
                    // console.log("current player:", current_player);
                    // if (current_player === "1") {
                    //     white_pawn_b_count -= 1;
                    // } else if (current_player === "2") {
                    //     black_pawn_b_count -= 1;
                    // }
                    console.log(vm.player_one, "<<<< player one");
                    if (vm.player_one === $window.localStorage["current-user-id"]) {
                        socket.emit("player one horizontal barrier set", { sq: sq_in, sq_sib: sq_sib_in, b_count: white_pawn_b_count });
                    }
                    if (vm.player_two === $window.localStorage["current-user-id"]) {
                        socket.emit("player two horizontal barrier set", { sq: sq_in, sq_sib: sq_sib_in, b_count: black_pawn_b_count });
                    }
                    
                    
                    change_turns();
                }
                if (sq.css("border-right-color") === b_color) {
                    sq.css({
                        "border-right": "8px groove #0099CC"
                    })
                    sq_top.css({
                        "border-right": "8px groove #0099CC"
                    })
                    $(".square").off("mouseenter");
                    $(".square").off("mouseleave");
                    // if (current_player === "1") {
                    //     white_pawn_b_count -= 1;
                    // } else if (current_player === "2") {
                    //     black_pawn_b_count -= 1;
                    // }
                    if (vm.player_one === $window.localStorage["current-user-id"]) {
                        socket.emit("player one vertical barrier set", { sq: sq_in, sq_top: index_top_sq, b_count: white_pawn_b_count });
                    }
                    if (vm.player_two === $window.localStorage["current-user-id"]) {
                        socket.emit("player two vertical barrier set", { sq: sq_in, sq_top: index_top_sq, b_count: black_pawn_b_count });
                    }


                    change_turns();
                }
            })

            // sockets for barriers

            socket.on("player one vertical barrier set", function(data) {
                if (vm.player_two === $window.localStorage["current-user-id"]) {
                    $(square_arr[data.sq]).css( { "border-right": "8px groove #0099CC" });
                    $(square_arr[data.sq_top]).css( { "border-right": "8px groove #0099CC" });
                }
                white_pawn_b_count = data.b_count - 1;
                turn_div.text("Black Pawn");
                count_div.text(black_pawn_b_count.toString());
                if (vm.player_two === $window.localStorage["current-user-id"]) {    
                     document.getElementById("place-wall").disabled = false;
                       document.getElementById("place-v-wall").disabled = false;
                       $("#black-pawn").draggable("enable");
                      highlight_sq("#black-pawn");
                      check_for_winner()
                }
                if (vm.player_one === $window.localStorage["current-user-id"]) {
                      document.getElementById("place-wall").disabled = true;
                       document.getElementById("place-v-wall").disabled = true;
                      $("#white-pawn").draggable("disable");
                }
            })
            socket.on("player two vertical barrier set", function(data) {
                if (vm.player_one === $window.localStorage["current-user-id"]) {
                    $(square_arr[data.sq]).css( { "border-right": "8px groove #0099CC" });
                    $(square_arr[data.sq_top]).css( { "border-right": "8px groove #0099CC" });
                }
                black_pawn_b_count = data.b_count - 1;
                turn_div.text("White Pawn");
                count_div.text(white_pawn_b_count.toString());
                if (vm.player_one === $window.localStorage["current-user-id"]) {    
                     document.getElementById("place-wall").disabled = false;
                       document.getElementById("place-v-wall").disabled = false;
                       $("#white-pawn").draggable("enable");
                      highlight_sq("#white-pawn");
                      check_for_winner()
                }
                if (vm.player_two === $window.localStorage["current-user-id"]) {
                    document.getElementById("place-wall").disabled = true;
                    document.getElementById("place-v-wall").disabled = true;
                    $("#black-pawn").draggable("disable");
                }
            })

            socket.on("player one horizontal barrier set", function(data) {
                if (vm.player_two === $window.localStorage["current-user-id"]) {
                    $(square_arr[data.sq]).css({ "border-top-color": "#0099CC" })
                    $(square_arr[data.sq_sib]).css({ "border-top-color": "#0099CC" })
                }
                white_pawn_b_count = data.b_count - 1;
                turn_div.text("Black Pawn");
                count_div.text(black_pawn_b_count.toString());
                if (vm.player_two === $window.localStorage["current-user-id"]) {    
                     document.getElementById("place-wall").disabled = false;
                       document.getElementById("place-v-wall").disabled = false;
                       $("#black-pawn").draggable("enable");
                      highlight_sq("#black-pawn");
                      check_for_winner()
                }
                if (vm.player_one === $window.localStorage["current-user-id"]) {
                      document.getElementById("place-wall").disabled = true;
                      document.getElementById("place-v-wall").disabled = true;
                      $("#white-pawn").draggable("disable");
                }
            })
            socket.on("player two horizontal barrier set", function(data) {
                
                if (vm.player_one === $window.localStorage["current-user-id"]) {
                    $(square_arr[data.sq]).css({ "border-top-color": "#0099CC" })
                    $(square_arr[data.sq_sib]).css({ "border-top-color": "#0099CC" })
                }
                black_pawn_b_count = data.b_count - 1;
                turn_div.text("White Pawn");
                count_div.text(white_pawn_b_count.toString());
                if (vm.player_one === $window.localStorage["current-user-id"]) {   
                     document.getElementById("place-wall").disabled = false;
                     document.getElementById("place-v-wall").disabled = false; 
                     $("#white-pawn").draggable("enable");
                      highlight_sq("#white-pawn");
                      check_for_winner()
                }
                if (vm.player_two === $window.localStorage["current-user-id"]) {
                    document.getElementById("place-wall").disabled = true;
                    document.getElementById("place-v-wall").disabled = true;
                    $("#black-pawn").draggable("disable");
                }
            })

            //

            // function change_turns(player){
            //     if (player === "1") {
            //         console.log("getting valid positions for white pawn...");
            //         highlight_sq("#white-pawn");
            //     } else if (player === "2") {
            //         console.log("getting valid positions for black pawn...");
            //         highlight_sq("#black-pawn");
                    
            //     }
            // }
            
            
            // if (vm.player_one === $window.localStorage["current-user-id"]) {
            //     $("#white-pawn").draggable("enable");
            //     $("#black-pawn").draggable("disable");
            // }
            // if (vm.player_two === $window.localStorage["current-user-id"]) {
            //     $("#black-pawn").draggable("enable");
            //     $("#white-pawn").draggable("disable");
            // }

            function change_turns() {
                if (!check_for_winner()) {
                    if (current_player === "1") {
                    console.log("black pawn\'s turn...");
                    // turn_div.text("Black Pawn");
                    // count_div.text(black_pawn_b_count.toString());
                    // $("#white-pawn").draggable("disable");
                    // $("#black-pawn").draggable("enable");
                    current_player = "2";
                    // if (vm.player_two === $window.localStorage["current-user-id"]) {
                    //     highlight_sq("#black-pawn");
                    // }
                } else if (current_player === "2") {
                    console.log("white pawn\'s turn....");
                    // turn_div.text("White Pawn");
                    // count_div.text(white_pawn_b_count.toString());
                    // $("#white-pawn").draggable("enable");
                    // $("#black-pawn").draggable("disable");
                    current_player = "1";
                    //  if (vm.player_one === $window.localStorage["current-user-id"]) {
                    //       highlight_sq("#white-pawn");
                    // }
                  
                }
                }
            
            }







            init_drag("#white-pawn");
            init_drag("#black-pawn");

           
            // sockets


            $("#white-pawn").draggable({
                drag: function(evt, ui) {
                    socket.emit("white pawn pos", ui.position);
                }
            })

            $("#black-pawn").draggable({
                drag: function(evt, ui) {
                    socket.emit("black pawn pos", ui.position);
                }
            })

            socket.on("white pawn pos", function(pos) {
                // console.log("got white pawn position");
                $("#white-pawn").css("top", pos.top)
                $("#white-pawn").css("left", pos.left)
            })

            socket.on("black pawn pos", function(pos) {
                // console.log("got black pawn position");
                $("#black-pawn").css("top", pos.top);
                $("#black-pawn").css("left", pos.left);
            })

            socket.on("white pawn dropped", function(index){
                console.log("white pawn was dropped and emitted")
                // var w_p = "<img id='white-pawn' src='./assets/white_pawn.png'>";
                $(square_arr[index]).append($("#white-pawn"));
                // $("#white-pawn").css({
                //     "top": "initial !important",
                //     "left": "initial !important"
                // })
                document.getElementById("white-pawn").style.top = "inherit";
                document.getElementById("white-pawn").style.left = "inherit";
                socket.emit("player one turn over")
                // change_turns();
                
                
            })

            socket.on("player one turn over", function(){
                turn_div.text("Black Pawn");
                count_div.text(black_pawn_b_count.toString());
                if (vm.player_two === $window.localStorage["current-user-id"]) {
                      document.getElementById("place-wall").disabled = false;
                       document.getElementById("place-v-wall").disabled = false;
                       $("#black-pawn").draggable("enable");
                      highlight_sq("#black-pawn");
                      check_for_winner();
                }
                if (vm.player_one === $window.localStorage["current-user-id"]) {
                      document.getElementById("place-wall").disabled = true;
                      document.getElementById("place-v-wall").disabled = true;
                      $("#white-pawn").draggable("disable");
                }
               
               
            })
            socket.on("black pawn dropped", function(index){
                //  var b_p = "<img id='black-pawn' src='./assets/black_pawn.png'>";
                $(square_arr[index]).append($("#black-pawn"));
                console.log($("#black-pawn").css("top"))
                // $("#black-pawn").css({
                //     "top": "initial !important",
                //     "left": "initial !important"
                // })
                document.getElementById("black-pawn").style.top = "inherit";
                document.getElementById("black-pawn").style.left = "inherit";
                console.log($("#black-pawn").css("top"))
                socket.emit("player two turn over");

                // change_turns()
                //  highlight_sq("#black-pawn")
            })
            
            socket.on("player two turn over", function(){
                turn_div.text("White Pawn");
                count_div.text(white_pawn_b_count.toString());
                if (vm.player_one === $window.localStorage["current-user-id"]) {
                     document.getElementById("place-wall").disabled = false;
                     document.getElementById("place-v-wall").disabled = false;
                     $("#white-pawn").draggable("enable");
                      highlight_sq("#white-pawn");
                      check_for_winner()
                }
                if (vm.player_two === $window.localStorage["current-user-id"]) {
                    document.getElementById("place-wall").disabled = true;
                    document.getElementById("place-v-wall").disabled = true;
                    $("#black-pawn").draggable("disable");
                }
            })



            function emit_drop(index_of_sq, pawn) {
                console.log("pawn dropped!")
                // // evt ui
                if (pawn === "#white-pawn") {
                    socket.emit("white pawn dropped",  index_of_sq)
                } else if (pawn === "#black-pawn") {
                    socket.emit("black pawn dropped", index_of_sq)
                }
                
            }



            //

            var wall_btn = $("#place-wall");

            cancel_btn.on("click", function(){
                console.log("cancel btn clicked!");
                $(".square").off("mouseenter");
                $(".square").off("mouseleave");
                cancel_btn.css({
                    "display": "none"
                })
            })

            wall_btn.on("click", function(){
                if (current_player === "1") {
                    if (white_pawn_b_count > 0) {
                        cancel_btn.css({
                            "display": "inline-block"
                        })
                // finish making cancel btn
                // cancel_btn.fadeIn
                $(".square").off("mouseenter");
                $(".square").off("mouseleave");

                $(".square").on("mouseenter", function(evt){
                    var sq = $(evt.target);
                    var sq_sib = $(sq[0].nextSibling);
                    var index_of_sq = square_arr.indexOf(evt.target);
                    // console.log(index_of_sq, "<<");
                    if (index_of_sq !== 0 && index_of_sq !== 1 && index_of_sq !== 2 && index_of_sq !== 3 && index_of_sq !== 4 && index_of_sq !== 5 && index_of_sq !== 6 && index_of_sq !== 7) {
                        if (sq.css("border-top-color") === "rgb(0, 0, 0)" && sq_sib.css("border-top-color") === "rgb(0, 0, 0)") {
                            if (sq_sib[0].nodeName !== "BR") {
                                sq.css( { "border-top": "8px groove #39B7CD" } )
                                sq_sib.css( { "border-top": "8px groove #39B7CD" } );
                            }
                        }
                    }
                })
                $(".square").on("mouseleave", function(evt){
                    var sq = $(evt.target);
                    var sq_sib = $(sq[0].nextSibling);
                    if (sq.css("border-top-color") === "rgb(57, 183, 205)") {
                        if (sq_sib[0].nodeName !== "BR") {
                            sq.css( { "border-top": "8px groove black" } )
                            sq_sib.css( { "border-top": "8px groove black" } )
                        }
                    }

                })
                    } else {
                        alert("You have no barriers left.");
                    }
                } else if (current_player === "2") {
                    if (black_pawn_b_count > 0) {
                        cancel_btn.css({
                    "display": "inline-block"
                })
                // finish making cancel btn
                // cancel_btn.fadeIn
                $(".square").off("mouseenter");
                $(".square").off("mouseleave");

                $(".square").on("mouseenter", function(evt){
                    var sq = $(evt.target);
                    var sq_sib = $(sq[0].nextSibling);
                    var index_of_sq = square_arr.indexOf(evt.target);
                    // console.log(index_of_sq, "<<");
                    if (index_of_sq !== 0 && index_of_sq !== 1 && index_of_sq !== 2 && index_of_sq !== 3 && index_of_sq !== 4 && index_of_sq !== 5 && index_of_sq !== 6 && index_of_sq !== 7) {
                        if (sq.css("border-top-color") === "rgb(0, 0, 0)" && sq_sib.css("border-top-color") === "rgb(0, 0, 0)") {
                            if (sq_sib[0].nodeName !== "BR") {
                                sq.css( { "border-top": "8px groove #39B7CD" } )
                                sq_sib.css( { "border-top": "8px groove #39B7CD" } );
                            }
                        }
                    }
                })
                $(".square").on("mouseleave", function(evt){
                    var sq = $(evt.target);
                    var sq_sib = $(sq[0].nextSibling);
                    if (sq.css("border-top-color") === "rgb(57, 183, 205)") {
                        if (sq_sib[0].nodeName !== "BR") {
                            sq.css( { "border-top": "8px groove black" } )
                            sq_sib.css( { "border-top": "8px groove black" } )
                        }
                    }

                })
                    } else {
                        alert("You have no barriers left.");
                    }
                }
            
            })


            // finish making vertial barriers and then test for placing vertical with horizonatal walls at the same time.
            var v_wall_btn = $("#place-v-wall");

            v_wall_btn.on("click", function(evt){
                if (current_player === "1") {
                    if (white_pawn_b_count > 0) {
                        cancel_btn.css({
                    "display": "inline-block"
                })

                $(".square").off("mouseenter");
                $(".square").off("mouseleave");

                $(".square").on("mouseenter", function(evt){
                    var sq = $(evt.target);
                    var index_of_top = square_arr.indexOf(evt.target) - 9;
                    var top_box = $(square_arr[index_of_top]);
                    if (index_of_top >= 0 && index_of_top !== 8 && index_of_top !== 17 && index_of_top !== 26 && index_of_top !== 35 && index_of_top !== 44 && index_of_top !== 53 && index_of_top !== 62 && index_of_top !== 71) {
                        
                    if (sq.css("border-right-color") === "rgb(0, 0, 0)" && top_box.css("border-right-color") === "rgb(0, 0, 0)") {
                            sq.css({
                                "border-right": "8px groove #39B7CD"
                            })
                            // console.log(index_of_top)
                            top_box.css({
                                "border-right": "8px groove #39B7CD"
                            })
                    }
                    
                    }
                
                    

                    // var sq_sib = $(sq[0].nextSibling);
                    
                    // if (sq.css("border-right-color") === "rgb(0, 0, 0)" && sq_sib.css("border-right-color") === "rgb(0, 0, 0)") {
                    //    if (sq_sib[0].nodeName !== "BR") {
                    //     sq.css( { "border-top": "8px groove #39B7CD" } )
                    //     sq_sib.css( { "border-top": "8px groove #39B7CD" } );
                    //    }
                    // }
                })
                $(".square").on("mouseleave", function(evt){
                    var sq = $(evt.target);
                    var index_of_top = square_arr.indexOf(evt.target) - 9;
                    var top_box = $(square_arr[index_of_top]);
                    if (sq.css("border-right-color") === "rgb(57, 183, 205)" && top_box.css("border-right-color") === "rgb(57, 183, 205)") {
                        sq.css({
                            "border-right": "8px solid black"
                        })
                        top_box.css({
                            "border-right": "8px solid black"
                        })
                    }
                
                    // var sq_sib = $(sq[0].nextSibling);
                    // if (sq.css("border-top-color") === "rgb(57, 183, 205)") {
                    //      if (sq_sib[0].nodeName !== "BR") {
                    //         sq.css( { "border-top": "8px groove black" } )
                    //         sq_sib.css( { "border-top": "8px groove black" } )
                    //      }
                    // }

                })
                    } else {
                        alert("You have no barriers left.");
                    }
                } else if (current_player === "2") {
                    if (black_pawn_b_count > 0) {
                        cancel_btn.css({
                    "display": "inline-block"
                })

                $(".square").off("mouseenter");
                $(".square").off("mouseleave");

                $(".square").on("mouseenter", function(evt){
                    var sq = $(evt.target);
                    var index_of_top = square_arr.indexOf(evt.target) - 9;
                    var top_box = $(square_arr[index_of_top]);
                    if (index_of_top >= 0 && index_of_top !== 8 && index_of_top !== 17 && index_of_top !== 26 && index_of_top !== 35 && index_of_top !== 44 && index_of_top !== 53 && index_of_top !== 62 && index_of_top !== 71) {
                        
                    if (sq.css("border-right-color") === "rgb(0, 0, 0)" && top_box.css("border-right-color") === "rgb(0, 0, 0)") {
                            sq.css({
                                "border-right": "8px groove #39B7CD"
                            })
                            // console.log(index_of_top)
                            top_box.css({
                                "border-right": "8px groove #39B7CD"
                            })
                    }
                    
                    }
                
                    

                    // var sq_sib = $(sq[0].nextSibling);
                    
                    // if (sq.css("border-right-color") === "rgb(0, 0, 0)" && sq_sib.css("border-right-color") === "rgb(0, 0, 0)") {
                    //    if (sq_sib[0].nodeName !== "BR") {
                    //     sq.css( { "border-top": "8px groove #39B7CD" } )
                    //     sq_sib.css( { "border-top": "8px groove #39B7CD" } );
                    //    }
                    // }
                })
                $(".square").on("mouseleave", function(evt){
                    var sq = $(evt.target);
                    var index_of_top = square_arr.indexOf(evt.target) - 9;
                    var top_box = $(square_arr[index_of_top]);
                    if (sq.css("border-right-color") === "rgb(57, 183, 205)" && top_box.css("border-right-color") === "rgb(57, 183, 205)") {
                        sq.css({
                            "border-right": "8px solid black"
                        })
                        top_box.css({
                            "border-right": "8px solid black"
                        })
                    }
                
                    // var sq_sib = $(sq[0].nextSibling);
                    // if (sq.css("border-top-color") === "rgb(57, 183, 205)") {
                    //      if (sq_sib[0].nodeName !== "BR") {
                    //         sq.css( { "border-top": "8px groove black" } )
                    //         sq_sib.css( { "border-top": "8px groove black" } )
                    //      }
                    // }

                })
                    } else {
                        alert("You have no barriers left.");
                    }
                }
                
            })


            function init_drag(pawn) {
                var p = $(pawn);
                p.draggable({
                    addClasses: true,
                    cursor: "pointer",
                    cursorAt: {
                        top: 45,
                        left: 45
                    },
                    revert: "invalid"
                })
            }

            // function animate_sq(des, box){
            //     if (des === "go") {
            //         box.animate( {
            //             "background-color": "#EDC393 !important"
            //         }, 500, function(){
            //             box.animate( {
            //                 "background-color": "#5F9F9F"
            //             }, 500, function() {
            //                 animate_sq("go", box)
            //             } )
                    
            //         } )
            //     } else if (des === "stop") {
            //         console.log("stopped animation...");
            //         box.stop();
            //         box.css({"background-color": "#EDC393"})
            //     }
                
            // }

            // test to make sure valid positions are updating correctly for both pawns


            function highlight_sq(pawn) {

                var parent = document.querySelector(pawn).parentElement;
                var pos = square_arr.indexOf(parent);
                var pos_obj = valid_squares(pawn);
                var h = "highlight";
                var ui_color = "ui-box-color";
                console.log("current pos", pos)
                console.log("valid positions to move", pos_obj)
                var top = $(square_arr[pos_obj.top.pos]);
                // todo - range check on hop over squares
                var new_top = $(square_arr[pos_obj.top.pos + 9]);
                var new_top_white = $(square_arr[pos_obj.top.pos - 9]);
                var bottom = $(square_arr[pos_obj.bottom.pos]);
                var new_bottom = $(square_arr[pos_obj.bottom.pos + 9]);
                var new_bottom_black = $(square_arr[pos_obj.bottom.pos - 9]);
                var right = $(square_arr[pos_obj.r.pos]);
                var new_right_black = $(square_arr[pos_obj.r.pos + 1]);
                var left = $(square_arr[pos_obj.l.pos]);
                var new_left_black = $(square_arr[pos_obj.l.pos - 1]);
                if (pos_obj.top.valid) {
                    if (pawn === "#white-pawn") {
                        top.droppable({
                            addClasses: true,
                            accept: "#white-pawn",
                            classes: {
                                "ui-droppable-hover": h,
                                "ui-droppable-active": ui_color
                            },
                            tolerance: "fit",
                            activate: function( evt, ui ) {
                                var index = square_arr.indexOf(evt.target);
                                var sq = square_arr[index];
                                // $(sq).droppable("option", "accept", "*")
                            
                            },
                            drop: function(evt, ui) {
                                var index = square_arr.indexOf(evt.target)
                                var sq = square_arr[index];
                                
                                sq.append(ui.draggable[0]);
                                // console.log(sq)
                                emit_drop(index, pawn)
                                disable_sq(bottom, left, right, pos, sq);
                                // highlight_sq("#white-pawn")
                                change_turns();
                            }
                        })
                    } else if (pawn === "#black-pawn") {
                        top.droppable({
                            addClasses: true,
                            accept: "#black-pawn",
                            classes: {
                                "ui-droppable-hover": h,
                                "ui-droppable-active": ui_color
                            },
                            tolerance: "fit",
                            drop: function(evt, ui) {
                                var index = square_arr.indexOf(evt.target)
                                var sq = square_arr[index];
                                sq.append(ui.draggable[0])
                                console.log(sq)
                                emit_drop(index, pawn)
                                disable_sq(bottom, left, right, pos, sq);
                                // highlight_sq("#black-pawn")
                                change_turns();
                            }
                        })
                    }
                }
                if (pos_obj.bottom.valid) {
                    if (pawn === "#white-pawn") {
                        bottom.droppable({
                            addClasses: true,
                            accept: "#white-pawn",
                            classes: {
                                "ui-droppable-hover": h,
                                "ui-droppable-active": ui_color
                            },
                            tolerance: "fit",
                            drop: function(evt, ui) {
                                // animate_sq("stop", top)
                                var index = square_arr.indexOf(evt.target)
                                var sq = square_arr[index];
                                sq.append(ui.draggable[0])
                                console.log(sq)
                                emit_drop(index, pawn)
                                disable_sq(top, left, right, pos, sq);
                                //  highlight_sq("#white-pawn")
                                change_turns();
                            }
                        })
                    } else if (pawn === "#black-pawn") {
                        bottom.droppable({
                            addClasses: true,
                            accept: "#black-pawn",
                            classes: {
                                "ui-droppable-hover": h,
                                "ui-droppable-active": ui_color
                            },
                            tolerance: "fit",
                            drop: function(evt, ui) {
                                var index = square_arr.indexOf(evt.target)
                                var sq = square_arr[index];
                                sq.append(ui.draggable[0])
                                console.log(sq)
                                emit_drop(index, pawn)
                                disable_sq(top, left, right, pos, sq);
                                //  highlight_sq("#black-pawn")
                                change_turns();
                            }
                        })
                    }
                }
                if (pos_obj.r.valid) {
                    if (pawn === "#white-pawn") {
                        right.droppable({
                            addClasses: true,
                            accept: "#white-pawn",
                            classes: {
                                "ui-droppable-hover": h,
                                "ui-droppable-active": ui_color
                            },
                            tolerance: "fit",
                            drop: function(evt, ui) {
                                // animate_sq("stop", top)
                                var index = square_arr.indexOf(evt.target)
                                var sq = square_arr[index];
                                sq.append(ui.draggable[0])
                                console.log(sq)
                                emit_drop(index, pawn)
                                disable_sq(bottom, left, top, pos, sq);
                                // highlight_sq("#white-pawn")
                                change_turns();
                            }
                        })
                    } else if (pawn === "#black-pawn") {
                        right.droppable({
                            addClasses: true,
                            accept: "#black-pawn",
                            classes: {
                                "ui-droppable-hover": h,
                                "ui-droppable-active": ui_color
                            },
                            tolerance: "fit",
                            drop: function(evt, ui) {
                                var index = square_arr.indexOf(evt.target)
                                var sq = square_arr[index];
                                sq.append(ui.draggable[0])
                                console.log(sq)
                                emit_drop(index, pawn)
                                disable_sq(bottom, left, top, pos, sq);
                                //  highlight_sq("#black-pawn")
                                change_turns();
                            }
                        })
                    }
                }
                if (pos_obj.l.valid) {
                    if (pawn === "#white-pawn") {
                        left.droppable({
                            addClasses: true,
                            accept: "#white-pawn",
                            classes: {
                                "ui-droppable-hover": h,
                                "ui-droppable-active": ui_color
                            },
                            tolerance: "fit",
                            drop: function(evt, ui) {
                                // animate_sq("stop", top)
                                var index = square_arr.indexOf(evt.target)
                                var sq = square_arr[index];
                                sq.append(ui.draggable[0])
                                console.log(sq)
                                emit_drop(index, pawn)
                                disable_sq(bottom, top, right, pos, sq);
                                //  highlight_sq("#white-pawn")
                                change_turns();
                            }
                        })
                    } else if (pawn === "#black-pawn") {
                        left.droppable({
                            addClasses: true,
                            accept: "#black-pawn",
                            classes: {
                                "ui-droppable-hover": h,
                                "ui-droppable-active": ui_color
                            },
                            tolerance: "fit",
                            drop: function(evt, ui) {
                                var index = square_arr.indexOf(evt.target)
                                var sq = square_arr[index];
                                sq.append(ui.draggable[0])
                                console.log(sq)
                                emit_drop(index, pawn)
                            disable_sq(bottom, top, right, pos, sq);
                            // highlight_sq("#black-pawn")
                            change_turns();
                            }
                        })
                    }
                }
               



                check_borders(top, bottom, left, right, pos, pawn);
                check_for_jump(top, bottom, left, right, pos, pawn);

            }


            function check_for_jump(t, b, l, r, curr, p) {
                console.log("checking if valid jump");
                var j_i = curr - 18;
                var j_i_b = curr + 18;
                var j_left = curr - 2;
                var j_right = curr + 2;
                var jump_sq_r_one = $(square_arr[curr + 1]);
                var jump_sq_left = $(square_arr[j_left]);
                var jump_sq_right = $(square_arr[j_right]); 
                var jump_sq = $(square_arr[j_i]);
                var jump_sq_b = $(square_arr[j_i_b]);
                var current = $(square_arr[curr]);
                var h = "highlight";
                var ui_color = "ui-box-color";
                // for the only move to make is to jump over the other pawn in the forward direction
                if (t.children().length > 0){
                    var id =  $(t.children()[0]).attr("id")
                    if (id === "black-pawn") {
                        console.log(t, "sq that contains other pawn: black pawn")
                        if (t.droppable("instance")) {
                            t.droppable("destroy")   
                        }
                        if (!b.droppable("instance") && !l.droppable("instance") && !r.droppable("instance")) {
                            if (t.css("border-top-color") === "rgb(0, 153, 204)") {
                                console.log("no move to make... game over...")
                            } else {
                                console.log(jump_sq, "jump valid")
                                jump_sq.droppable({
                                    addClasses: true,
                                    accept: "#white-pawn",
                                    classes: {
                                        "ui-droppable-hover": h,
                                        "ui-droppable-active": ui_color
                                    },
                                    tolerance: "fit",
                                    drop: function(evt, ui) {
                                        var index = square_arr.indexOf(evt.target)
                                        var sq = square_arr[index];
                                        sq.append(ui.draggable[0])
                                        emit_drop(index, pawn)
                                        console.log(sq)
                                    disable_sq(b, r, l, curr, sq);
                                    // highlight_sq("#black-pawn")
                                    change_turns();
                                    }
                                })
                            }
                        }
                    } else if (id === "white-pawn") {
                        // finish valid jump check and move for black pawn in top pos.
                        // todo finish valid jump check for bottom, left, and right squares for white and black pawns.
                        console.log(t, "sq that contains other pawn: white pawn");
                        if (t.droppable("instance")) {
                            t.droppable("destroy")   
                        }
                        console.log(jump_sq_b);
                        if (!b.droppable("instance") && !l.droppable("instance") && !r.droppable("instance")) {
                            if (jump_sq_b.css("border-top-color") === "rgb(0, 153, 204)") {
                                console.log("no move to make... game over...")
                            } else {
                                console.log(jump_sq_b, "jump valid")
                                jump_sq_b.droppable({
                                    addClasses: true,
                                    accept: "#black-pawn",
                                    classes: {
                                        "ui-droppable-hover": h,
                                        "ui-droppable-active": ui_color
                                    },
                                    tolerance: "fit",
                                    drop: function(evt, ui) {
                                        var index = square_arr.indexOf(evt.target)
                                        var sq = square_arr[index];
                                        sq.append(ui.draggable[0])
                                        emit_drop(index, pawn)
                                        console.log(sq)
                                    disable_sq(b, r, l, curr, sq);
                                    // highlight_sq("#black-pawn")
                                    change_turns();
                                    }
                                })
                            }

                        }
                    }
                } 
                if (b.children().length > 0) {
                    var id =  $(b.children()[0]).attr("id")
                    if (id === "black-pawn") {
                        console.log(b, "sq that contains other pawn: black pawn")
                        if (b.droppable("instance")) {
                            b.droppable("destroy")   
                        }
                        if (!t.droppable("instance") && !l.droppable("instance") && !r.droppable("instance")) {
                            if (jump_sq_b.css("border-top-color") === "rgb(0, 153, 204)") {
                                console.log("no move to make... game over...")
                            } else {
                                console.log(jump_sq, "jump valid")
                                jump_sq_b.droppable({
                                    addClasses: true,
                                    accept: "#white-pawn",
                                    classes: {
                                        "ui-droppable-hover": h,
                                        "ui-droppable-active": ui_color
                                    },
                                    tolerance: "fit",
                                    drop: function(evt, ui) {
                                        var index = square_arr.indexOf(evt.target)
                                        var sq = square_arr[index];
                                        sq.append(ui.draggable[0])
                                        emit_drop(index, pawn)
                                        console.log(sq)
                                    disable_sq(t, r, l, curr, sq);
                                    // highlight_sq("#black-pawn")
                                    change_turns();
                                    }
                                })
                            }
                        }
                    } else if (id === "white-pawn") {
                        // finish valid jump check and move for black pawn in top pos.
                        // todo finish valid jump check for bottom, left, and right squares for white and black pawns.
                        console.log(b, "sq that contains other pawn: white pawn");
                        if (b.droppable("instance")) {
                            b.droppable("destroy");  
                        }
                        console.log(jump_sq);
                        if (!t.droppable("instance") && !l.droppable("instance") && !r.droppable("instance")) {
                            if (current.css("border-top-color") === "rgb(0, 153, 204)") {
                                console.log("no move to make... game over...");
                            } else {
                                console.log(jump_sq, "jump valid")
                                jump_sq.droppable({
                                    addClasses: true,
                                    accept: "#black-pawn",
                                    classes: {
                                        "ui-droppable-hover": h,
                                        "ui-droppable-active": ui_color
                                    },
                                    tolerance: "fit",
                                    drop: function(evt, ui) {
                                        var index = square_arr.indexOf(evt.target)
                                        var sq = square_arr[index];
                                        sq.append(ui.draggable[0])
                                        console.log(sq)
                                        emit_drop(index, pawn)
                                    disable_sq(t, r, l, curr, sq);
                                    // highlight_sq("#black-pawn")
                                    change_turns();
                                    }
                                })
                            }

                        }
                    }
                }
                if (l.children().length > 0) {
                    var id =  $(l.children()[0]).attr("id")
                    if (id === "black-pawn") {
                        console.log(l, "sq that contains other pawn: black pawn")
                        if (l.droppable("instance")) {
                            l.droppable("destroy")   
                        }
                        if (!t.droppable("instance") && !b.droppable("instance") && !r.droppable("instance")) {
                            if (jump_sq_left.css("border-right-color") === "rgb(0, 153, 204)") {
                                console.log("no move to make... game over...")
                            } else {
                                console.log(jump_sq_left, "jump valid")
                                jump_sq_left.droppable({
                                    addClasses: true,
                                    accept: "#white-pawn",
                                    classes: {
                                        "ui-droppable-hover": h,
                                        "ui-droppable-active": ui_color
                                    },
                                    tolerance: "fit",
                                    drop: function(evt, ui) {
                                        var index = square_arr.indexOf(evt.target)
                                        var sq = square_arr[index];
                                        sq.append(ui.draggable[0])
                                        console.log(sq)
                                        emit_drop(index, pawn)
                                    disable_sq(t, r, b, curr, sq);
                                    // highlight_sq("#black-pawn")
                                    change_turns();
                                    }
                                })
                            }
                        }
                    } else if (id === "white-pawn") {
                        // finish valid jump check and move for black pawn in top pos.
                        // todo finish valid jump check for bottom, left, and right squares for white and black pawns.
                        console.log(l, "sq that contains other pawn: white pawn");
                        if (l.droppable("instance")) {
                            l.droppable("destroy")   
                        }
                        console.log(jump_sq_left);
                        if (!t.droppable("instance") && !b.droppable("instance") && !r.droppable("instance")) {
                            if (jump_sq_left.css("border-right-color") === "rgb(0, 153, 204)") {
                                console.log("no move to make... game over...");
                            } else {
                                console.log(jump_sq_left, "jump valid")
                                jump_sq_left.droppable({
                                    addClasses: true,
                                    accept: "#black-pawn",
                                    classes: {
                                        "ui-droppable-hover": h,
                                        "ui-droppable-active": ui_color
                                    },
                                    tolerance: "fit",
                                    drop: function(evt, ui) {
                                        var index = square_arr.indexOf(evt.target)
                                        var sq = square_arr[index];
                                        sq.append(ui.draggable[0])
                                        emit_drop(index, pawn)
                                        console.log(sq)
                                    disable_sq(t, r, b, curr, sq);
                                    // highlight_sq("#black-pawn")
                                    change_turns();
                                    }
                                })
                            }

                        }
                    }
                }
                if ( r.children().length > 0 ) {
                    var id =  $(r.children()[0]).attr("id")
                    if (id === "black-pawn") {
                        console.log(r, "sq that contains other pawn: black pawn")
                        if (r.droppable("instance")) {
                            r.droppable("destroy")   
                        }
                        if (!t.droppable("instance") && !b.droppable("instance") && !l.droppable("instance")) {
                            if (jump_sq_r_one.css("border-right-color") === "rgb(0, 153, 204)") {
                                console.log("no move to make... game over...")
                            } else {
                                console.log(jump_sq_right, "jump valid")
                                jump_sq_right.droppable({
                                    addClasses: true,
                                    accept: "#white-pawn",
                                    classes: {
                                        "ui-droppable-hover": h,
                                        "ui-droppable-active": ui_color
                                    },
                                    tolerance: "fit",
                                    drop: function(evt, ui) {
                                        var index = square_arr.indexOf(evt.target)
                                        var sq = square_arr[index];
                                        sq.append(ui.draggable[0])
                                        emit_drop(index, pawn)
                                        console.log(sq)
                                    disable_sq(t, l, b, curr, sq);
                                    // highlight_sq("#black-pawn")
                                    change_turns();
                                    }
                                })
                            }
                        }
                    } else if (id === "white-pawn") {
                        // finish valid jump check and move for black pawn in top pos.
                        // todo finish valid jump check for bottom, left, and right squares for white and black pawns.
                        console.log(r, "sq that contains other pawn: white pawn");
                        if (r.droppable("instance")) {
                            r.droppable("destroy")   
                        }
                        console.log(jump_sq_right);
                        if (!t.droppable("instance") && !b.droppable("instance") && !l.droppable("instance")) {
                            if (jump_sq_r_one.css("border-right-color") === "rgb(0, 153, 204)") {
                                console.log("no move to make... game over...");
                            } else {
                                console.log(jump_sq_right, "jump valid")
                                jump_sq_right.droppable({
                                    addClasses: true,
                                    accept: "#black-pawn",
                                    classes: {
                                        "ui-droppable-hover": h,
                                        "ui-droppable-active": ui_color
                                    },
                                    tolerance: "fit",
                                    drop: function(evt, ui) {
                                        var index = square_arr.indexOf(evt.target)
                                        var sq = square_arr[index];
                                        sq.append(ui.draggable[0])
                                        emit_drop(index, pawn)
                                        console.log(sq)
                                    disable_sq(t, l, b, curr, sq);
                                    // highlight_sq("#black-pawn")
                                    change_turns();
                                    }
                                })
                            }

                        }
                    }
                }
            }

            function check_borders(t, b, l, r, curr, p) {
                console.log(p, "pawn <><>")
                console.log("checking borders <><><>")
                var current = $(square_arr[curr])

                if (t.length > 0) {
                    console.log(t);
                    if (current.css("border-top-color") === "rgb(0, 153, 204)" && p === "#white-pawn") {
                        t.droppable("destroy");
                    } else if (t.css("border-top-color") === "rgb(0, 153, 204)" && p === "#black-pawn") {
                        t.droppable("destroy");
                    }
                
                }
                if (b.length > 0) {
                    console.log(b);
                    if (b.css("border-top-color") === "rgb(0, 153, 204)" && p === "#white-pawn") {
                        b.droppable("destroy");
                    } else if (current.css("border-top-color") === "rgb(0, 153, 204)" && p === "#black-pawn") {
                        b.droppable("destroy");
                    }
                }
                if (l.length > 0) {
                    console.log(l);
                    if (l.css("border-right-color") === "rgb(0, 153, 204)") {
                        l.droppable("destroy")
                    }
                    
                }
                if (r.length > 0) {
                    console.log(r);
                    if (current.css("border-right-color") === "rgb(0, 153, 204)") {
                        r.droppable("destroy")
                    }
                }
                console.log(current)
            }



            function disable_sq(a, b, c, prev_index, curr_sq) {
                var prev_middle = $(square_arr[prev_index]);
                var current = $(curr_sq);
                if (a.droppable("instance")) {
                    a.droppable("destroy");
                }
                if (b.droppable("instance")) {
                    b.droppable("destroy");
                }
                if (c.droppable("instance")) {
                    c.droppable("destroy");
                }
                if (prev_middle.droppable("instance")) {
                    prev_middle.droppable("destroy");
                }
                current.droppable("destroy");
                // console.log(a, b, c);
            }





            function valid_squares(pawn) {
                var parent = document.querySelector(pawn).parentElement;
                var pos = square_arr.indexOf(parent);
                var range = 80;

                if (pawn === "#white-pawn") {

                    console.log("white pawn pos >> ", pos);

                    var w_p = new Object();

                    w_p.top = { pos: pos - 9 };
                    w_p.bottom = { pos:   pos + 9 };
                    w_p.r = { pos: pos + 1 };
                    w_p.l = { pos: pos - 1 };

                    if (w_p.top.pos >= 0 && w_p.top.pos <= range) {
                        w_p.top.valid = true;
                    } else { w_p.top.valid = false; }
                    if (w_p.bottom.pos >= 0 && w_p.bottom.pos <= range) {
                        w_p.bottom.valid = true;
                    } else { w_p.bottom.valid = false; }
                    if (w_p.r.pos >= 0 && w_p.r.pos <= range) {
                        if (pos !== 8 && pos !== 17 && pos !== 26 && pos !== 35 && pos !== 44 && pos !== 53 && pos !== 62 && pos !== 71) {
                            w_p.r.valid = true;
                        } else { w_p.r.valid = false; } 
                    } else { w_p.r.valid = false; }
                    if (w_p.l.pos >= 0 && w_p.l.pos <= range) {
                        if (pos !== 72 && pos !== 63 && pos !== 54 && pos !== 45 && pos !== 36 && pos !== 27 && pos !== 18 && pos !== 9 && pos !== 0) {
                            w_p.l.valid = true;
                        } else { w_p.l.valid = false; }
                    } else { w_p.l.valid = false; }


                    

                    return w_p;


                } else if (pawn === "#black-pawn") {
                    console.log("black pawn pos >> ", pos);

                    var b_p = new Object();

                    b_p.top = { pos: pos + 9 };
                    b_p.bottom = { pos: pos - 9 };
                    b_p.r = { pos: pos + 1 };
                    b_p.l = { pos: pos - 1 };


                    if (b_p.top.pos >= 0 && b_p.top.pos <= range) {
                        b_p.top.valid = true;
                    } else { b_p.top.valid = false; }
                    if (b_p.bottom.pos >= 0 && b_p.bottom.pos <= range) {
                        b_p.bottom.valid = true;
                    } else { b_p.bottom.valid = false; }
                    if (b_p.r.pos >= 0 && b_p.r.pos <= range) {
                        if (pos !== 8 && pos !== 17 && pos !== 26 && pos !== 35 && pos !== 44 && pos !== 53 && pos !== 62 && pos !== 71) {
                            b_p.r.valid = true;
                        } else { b_p.r.valid = false; }
                    } else { b_p.r.valid = false }
                    if (b_p.l.pos >= 0 && b_p.l.pos <= range) {
                        if (pos !== 72 && pos !== 63 && pos !== 54 && pos !== 45 && pos !== 36 && pos !== 27 && pos !== 18 && pos !== 9 && pos !== 0) {
                            b_p.l.valid = true;
                        } else { b_p.l.valid = false; }
                    } else { b_p.l.valid = false; }


                    return b_p

            

                }


            }



            function create_divs() {
                var square = "<span class='square'></span>";
                var line_break = "<br>";
                for ( var i = 1; i <= 81; i++ ) {
                    game_board.append(square);

                    if (i % 9 === 0) {
                        game_board.append(line_break);
                    }
                }
            }



            function create_pawns() {
                var b_p = "<img id='black-pawn' src='./assets/black_pawn.png'>";
                var w_p = "<img id='white-pawn' src='./assets/white_pawn.png'>";

                var gm_s = game_board.children(".square");

                for (var i in gm_s) {
                    if (Number(i) <= 80) {
                        square_arr.push(gm_s[i]);  
                    }
                }

                $(square_arr[4]).append(b_p);
                $(square_arr[76]).append(w_p);
                document.getElementById("black-pawn").style.top = "inherit";
                document.getElementById("black-pawn").style.left = "inherit";
                document.getElementById("white-pawn").style.top = "inherit";
                document.getElementById("white-pawn").style.left = "inherit";
            }


                    }
            }())