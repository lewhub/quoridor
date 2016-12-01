( function(){
    angular.module("board_game")
        .factory("user_fac", user_fac)

        user_fac.$inject = ["$http"];

        function user_fac($http) {
            var api = "https://quoridor-game.herokuapp.com/users/";
            var api_login = "https://quoridor-game.herokuapp.com/users/login/";
            // var api = "/users/";
            // var api_login = "/users/login/";
            var service = {
                index: index,
                show: show,
                login: login,
                create: create,
                delete_user: delete_user,
                change_status: change_status
            }
            return service;

            function index() {
                return $http.get(api);
            }
            function show(id) {
                return $http.get(api + id);
            }
            function login(data){
                return $http.post(api_login, data);
            }
            function create(data) {
                return $http.post(api, data);
            }
            function delete_user(id) {
                return $http.delete(api + id);
            }
            function change_status(id) {
                return $http.patch(api + id);
            }

        }
}())