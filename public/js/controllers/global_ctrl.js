( function(){
    angular.module("board_game")
        .controller("GlobalController", GlobalController)

        GlobalController.$inject = ["$window", "$rootScope", "$state"];

        function GlobalController($window, $rootScope, $state) {
            var vm = this;

             $window.fbAsyncInit = function() {
                FB.init({
                appId      : '1202135139865938',
                xfbml      : true,
                status: true,
                cookie: true,
                version    : 'v2.6'
                });
            };

            vm.parse_jwt = function(token) {
                var base64Url = token.split(".")[1];
                var base64 = base64Url.replace("-", "+").replace("_", "/");
                return JSON.parse($window.atob(base64));
            }

            vm.is_authed = function() {
                var token = $window.localStorage["user-jwt-token"];
                if (token) {
                    var params = vm.parse_jwt(token);
                    return Math.round( new Date().getTime() / 1000 ) <= params.exp; 
                } else {
                    return false;
                }
            }

            vm.logout = function() {
                $window.localStorage.removeItem("current-user-id");
                $window.localStorage.removeItem("current-user-status");
                $window.localStorage.removeItem("user-jwt-token");
                $window.localStorage.removeItem("user-email");
                if ($window.localStorage["fb-user"]) {
                    FB.logout(function(response) {
                        console.log(response, "logout")
                    })
                    $window.localStorage.removeItem("fb-user");
                } 
                $state.go("login");
            }


        }
}())