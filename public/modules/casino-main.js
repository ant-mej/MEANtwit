angular.module('casino-main', [
  'casino-lights'
])
.controller('casino-light-controller', function($scope) {
    
  $scope.config = {
    speed: 30,
    filter: 'letter',
    power: true
  };
  
});
