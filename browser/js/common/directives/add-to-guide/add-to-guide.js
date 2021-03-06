app.directive('addToGuide', function($mdDialog, $mdToast, GuideFactory, $log, $rootScope){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/add-to-guide/add-to-guide.html',
		scope: {
      resource: '=',
      userGuides: '=',
      user: '='
    },
		link: function(scope) {
			scope.guide = {tags: []}
      scope.openPanel = false;

			scope.newGuide = false;
			scope.openToast = function(){
				$mdToast.show($mdToast.simple()
											.textContent('Resource added to Guide!'));
			}

			scope.showAdvanced = function(){
				$mdDialog.show({
          scope: scope,
          preserveScope: true,
					templateUrl: 'js/common/directives/add-to-guide/dialog-template.html',
					clickOutsideToClose: true,
					escapeToClose: true,
				});
			}

			scope.clearForm = function(){
				scope.guideForm.$setPristine();
				scope.guideForm.$setUntouched();
				scope.guide = {tags: []}
			}

			scope.submitForm = function(){
				if (scope.guide.id){
					return GuideFactory.addResource(scope.guide.id, scope.resource)
					.then(function(){
						scope.clearForm();
						$mdDialog.hide();
						scope.openToast();
					})
				}
				else if (scope.guide.title){
					return GuideFactory.addNewGuide({title: scope.guide.title, author: scope.user, description: scope.guide.description, tags: scope.guide.tags})
					.then(function(guide){
						return GuideFactory.addResource(guide.id, scope.resource);
					})
					.then(function(){
            $rootScope.$broadcast('new guide');
						scope.clearForm();
						$mdDialog.hide();
						scope.openToast();
					})
					.catch($log.error)
				}
			}
		}
	}
})
