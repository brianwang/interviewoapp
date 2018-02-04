import angular from 'angular';
import angularMeteor from 'angular-meteor';
import prodcutsList from '../imports/components/productsList/productsList';
import '../imports/startup/accounts-config.js';

angular.module('simple-products', [
  angularMeteor,
  prodcutsList.name,
  'accounts.ui'
]);

function onReady() {
  angular.bootstrap(document, ['simple-products']);
}

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}
