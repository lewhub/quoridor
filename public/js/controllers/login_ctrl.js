( function(){
    angular.module("board_game")
        .controller("LoginController", LoginController)
        // create login
        // create signup
        // create socket connection to play a game where two users play becuase they are both logged in and their online_status fields are both set to true.

        LoginController.$inject = ["user_fac", "$state", "$window"];

        function LoginController(user_fac, $state, $window) {
            var vm = this;
            vm.title = "login view."
            vm.user = new Object();


            $window.fbAsyncInit = function() {
                FB.init({
                appId      : '1202135139865938',
                xfbml      : true,
                status: true,
                cookie: true,
                version    : 'v2.6'
                });
            };

         

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

             vm.fb_login_start = function() {
                FB.login(function(response) {
                    console.log(response);
                    FB.api("/" + response.authResponse.userID + "?fields=id,name,email", function(response) {
                        console.log(response, "in api call")
                    })
                    FB.api("/" + response.authResponse.userID, { fields: "friends" }, function(response){
                        console.log(response, "friends")
                    })
                }, { scope: "public_profile, email, user_friends" })
            }

            vm.fb_logout = function() {
                FB.logout(function(response) {
                    console.log(response, "logout")
                })
            }

            vm.fb_logged_in = function() {

                $window.fbAsyncInit = function() {
                    FB.init({
                    appId      : '1202135139865938',
                    xfbml      : true,
                    status: true,
                    cookie: true,
                    version    : 'v2.6'
                    });
                };
                FB.getLoginStatus(function(response) {
                    console.log(response, "getting status.")
                    if (response.status === "connected") {
                        return true;
                    } else if (response.status === "not_authorized") {
                        return false;
                    } else {
                        return false;
                    }
                })
            }
            
        }
}())