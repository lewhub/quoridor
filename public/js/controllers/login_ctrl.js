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

            vm.statusChangeCallback = function(response) {
                console.log('statusChangeCallback');
                console.log(response);
                console.log(response.authResponse.userID)
                // The response object is returned with a status field that lets the
                // app know the current login status of the person.
                // Full docs on the response object can be found in the documentation
                // for FB.getLoginStatus().
                if (response.status === 'connected') {
                // Logged into your app and Facebook.
                return true;
                // testAPI(response.authResponse.userID);
                } else if (response.status === 'not_authorized') {
                // The person is logged into Facebook, but not your app.
                document.getElementById('status').innerHTML = 'Please log ' +
                    'into this app.';
                } else {
                // The person is not logged into Facebook, so we're not sure if
                // they are logged into this app or not.
                document.getElementById('status').innerHTML = 'Please log ' +
                    'into Facebook.';
                    return false;
                }
            }

  vm.fb_logged_in = function () {
    if (window.FB) {
        window.FB.getLoginStatus(function(response) {
        vm.statusChangeCallback(response)
    })
    } else {
        return false
    }
    
   }

            // vm. = function() {

            //     FB.getLoginStatus(function(response) {
            //         console.log(response, "getting status.")
            //         if (response.status === "connected") {
            //             return true;
            //         } else if (response.status === "not_authorized") {
            //             return false;
            //         } else {
            //             return false;
            //         }
            //     })
            // }
            
        }
}())