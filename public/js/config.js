( function(){
    angular.module("board_game")
        .config( function( $stateProvider, $urlRouterProvider, $httpProvider ) {
            $httpProvider.interceptors.push( function($window) {
                return {
                    "request": function( config ) {
                        var token = $window.localStorage["user-jwt-token"];
                        if (token) {
                            config.headers["x-access-token"] = token;
                        }
                        return config;
                    },
                    "response": function( response ) {
                        if ( response.data.token ) {
                            $window.localStorage["current-user-id"] = response.data.user._id;
                            $window.localStorage["current-user-status"] = response.data.user.online_status;
                            $window.localStorage["user-email"] = response.data.user.email;
                            $window.localStorage["user-jwt-token"] = response.data.token;
                        }
                        return response;
                    }
                }
            })

            $urlRouterProvider.otherwise("/login");
            $stateProvider
                .state("login", {
                    url: "/login",
                    templateUrl: "partials/login.html",
                    controller: "LoginController as login_ctrl"
                })
                .state("start-game", {
                    url: "/game/:host_id/",
                    templateUrl: "partials/game.html",
                    controller: "GameController as game_ctrl"
                })
                .state("create-account", {
                    url: "/signup",
                    templateUrl: "partials/signup.html",
                    controller: "SignupController as signup_ctrl"
                })
                .state("join-lobby", {
                    url: "/lobby",
                    templateUrl: "partials/lobby.html",
                    controller: "LobbyCtrl as lobby_ctrl"
                })

        })
}())