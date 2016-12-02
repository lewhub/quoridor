( function(){
    angular.module("board_game")
        .controller("SignupController", SignupController)

        SignupController.$inject = ["user_fac", "$state"];

        function SignupController(user_fac, $state) {
            var vm = this;
            vm.title = "signup view.";
            vm.user = new Object();
            vm.create_account = function() {
                user_fac
                    .create(vm.user)
                    .then(account_created, err_callback)
            }

            function account_created(res) {
                console.log(res.data);
                $state.go("login");
            }
            function err_callback(res) {
                console.log("error.");
                console.log(res);
            }
        }
}())