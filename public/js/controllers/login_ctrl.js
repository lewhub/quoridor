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
                    // console.log(response);
                    var fb_res = response;
                    FB.api("/" + response.authResponse.userID + "?fields=id,name,email", function(response) {
                        console.log(response, "in api call")
                        if (fb_res.status === "connected") {
                            user_fac
                                .show_with_email(response.email)
                                .then(function(res) {
                                    // vm.fb_user_info = new Object();
                                    // vm.fb_user_info.email = response.email;
                                    // vm.fb_user_info.password =  reponse.authResponse.accessToken;
                                    // vm.fb_user_info.fb_user = true;
                                    // user_fac
                                    //     .create(vm.fb_user_info)
                                    //     .then(function(res) {
                                    //         console.log(res, "user created");
                                    //     }, err_callback)
                                    console.log(res, "found with email res.")
                                }, err_callback)
                           
                        }
                     
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
                if (window.FB) {
                window.FB.getLoginStatus(function(response) {
                    console.log(response, "getting status.")
                    if (response.status === "connected") {
                        console.log("showing logout button");
                        var logout_btn = angular.element(document.querySelector(".fb_logout_btn"));
                        console.log(logout_btn);
                        logout_btn.removeClass("ng-hide")
                        logout_btn.addClass("ng-show")
                        logout_btn.css("display", "inline-block");
                        return true;
                    } else if (response.status === "not_authorized") {
                        return false;
                    } else {
                        return false;
                    }
                })
                }
              
            }
            
        }
}())