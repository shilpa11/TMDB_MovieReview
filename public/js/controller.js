var tmdbApp = angular.module('tmdbApp' ,[]);
tmdbApp.filter('unescape', function () {
    return function (value) {
        return value.replace(/&#x[0-9a-fA-F]+;/img, function (matched) {
            var hexcode = matched.substring(3,matched.length -1);
            var decimalcode = parseInt(hexcode,16);
            return String.fromCharCode(decimalcode);
        });
    }
}).controller('TmdbCtrl',['$scope', '$http', function(sc , http) {
        sc.inp_movie_search = "";
        sc.getMovie = function (event) {
        if(event.keyCode === 13){
            http.get('http://api.themoviedb.org/3/search/movie?api_key=' + api_key + '&query=' + sc.inp_movie_search).success(function (data) {
                sc.movies=data.results;
                sc.movies.forEach(function(elem){
                    if(!elem.poster_path){
                        elem.poster_path = "/img/image_not_found.png";
                    }else{
                        elem.poster_path = "http://image.tmdb.org/t/p/w500"+ elem.poster_path;
                    }
                });
            });
        }
    }
   }]);
tmdbApp.controller('TmdbDetailCtrl',['$scope', '$http', '$routeParams', function(sc, http, routeparam){
        http.get('http://api.themoviedb.org/3/movie/' + routeparam.id + '?api_key=' + api_key)
            .success(function (data) {
                sc.movies = data;
                sc.genres = data.genres;
                if(!data.poster_path){
                    data.poster_path = "/img/image_not_found.png";
                }else{
                    data.poster_path = "http://image.tmdb.org/t/p/w500"+ data.poster_path;
                }
        });
        http.get('http://localhost:3000/reviews/' + routeparam.id)
            .success(function (data) {
                    sc.showdata = data;
                console.log((sc.showdata[0]));
            });
            sc.email = "";
            sc.reviewData  = "";
            sc.movieid = routeparam.id;
            sc.postData = function ($event) {
               $event.preventDefault();
               var review = sc.reviewData;
               var str_san = review.replace(/[^a-z0-9 ._]/gim, function (char) {
                    return '&#x' + char.charCodeAt(0).toString(16) + ';';
            });

            var obj={email : sc.email, review : str_san, movieid: sc.movieid};
            http.post('http://localhost:3000/reviews', obj).success(function (data) {
                console.log(data);
                sc.showdata.unshift(data.details);
            });
            sc.email = "";
            sc.reviewData  = "";
        };
}]);
