( function(){
    angular.module("board_game")
        .controller("LobbyCtrl", LobbyCtrl)

        LobbyCtrl.$inject = ["user_fac", "$state", "$window"];

        function LobbyCtrl(user_fac, $state, $window) {
            var vm = this;
            vm.title = "lobby view."

            user_fac
                .host_index()
                .then(users_found, err_callback)

            function err_callback(res) {
                console.log("error.");
                console.log(res);
            }

            function users_found(res) {
                console.log(res.data.users);
                vm.users = res.data.users;
            }

            vm.host_lobby = function() {
                console.log("host a new lobby.");
                console.log($window.localStorage["current-user-id"]);
                console.log($window.localStorage["user-email"]);
                user_fac
                    .update_host($window.localStorage["current-user-id"])
                    .then(host_updated, err_callback)
            }

            function host_updated(res) {
                console.log("now hosting");
                console.log(res);
                console.log(res.data.user._id);
                user_fac
                    .connect_server(res.data.user._id)
                    .then(function(res){
                        console.log(res)
                        $state.go("start-game", { host_id: res.data.user._id })
                    }, err_callback)


            }

            vm.join_lobby = function(evt, u) {
                console.log("joining lobby.")
                // console.log(u._id);
                // console.log(u);
                $(evt.target).addClass("active");
                user_fac
                    .connect_server(u._id)
                    .then(function(res){
                        console.log(res)
                        $state.go("start-game", { host_id: u._id })
                    }, err_callback)
                
            }
            
        }
}())