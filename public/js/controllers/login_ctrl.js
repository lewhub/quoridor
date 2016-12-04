( function(){
    angular.module("board_game")
        .controller("LoginController", LoginController)
        // create login
        // create signup
        // create socket connection to play a game where two users play becuase they are both logged in and their online_status fields are both set to true.

        LoginController.$inject = ["user_fac", "$state"];

        function LoginController(user_fac, $state) {
            var vm = this;
            vm.title = "login view."
            vm.user = new Object();

         

            vm.login = function() {
                user_fac
                    .login(vm.user)
                    .then(user_found, err_callback)
            }

            function user_found(res) {
                console.log(res.data)
                user_fac
                    .update_host(res.data.user._id, { is_hosting: false })
                    .then(not_hosting, err_callback)
            }
            function not_hosting(res) {
                console.log(res.data)
                $state.go("join-lobby");
                
            }
            function err_callback(res) {
                console.log("error.");
                console.log(res);
            }
        }
}())