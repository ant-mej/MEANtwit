'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Socket' , 'Authentication', 'Articles',
    function($scope, $stateParams, $location,Socket, Authentication, Articles) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');

        $scope.authentication = Authentication;
        Socket.on('article.created', function(article) {
          alert('Your article is created successfully !!');
          //  console.log(article);
        });
$scope.upload = function(){
    var article = new Articles({
        content: this.content
    });
};

        $scope.create = function() {
            var article = new Articles({
                content: this.content
            });
            article.$save(function(response) {
                //	$location.path('articles/' + response._id);
                $location.path('/');
                //$scope.title = '';
                $scope.content = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function(article) {
            if (article) {
                article.$remove();

                for (var i in $scope.articles) {
                    if ($scope.articles[i] === article) {
                        $scope.articles.splice(i, 1);
                    }
                }
            } else {
                $scope.article.$remove(function() {
                    $location.path('articles');
                });
            }
        };

        $scope.update = function() {
            var article = $scope.article;

            article.$update(function() {
                $location.path('articles/' + article._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function() {
            $scope.articles = Articles.query();
        };

        $scope.findOne = function() {
            $scope.article = Articles.get({
                articleId: $stateParams.articleId
            });
        };
    }
]);