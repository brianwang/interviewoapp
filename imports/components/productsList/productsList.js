import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Products } from '../../api/products.js';

import template from './productsList.html';

class ProductsListCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.subscribe('products');

        this.hideCompleted = false;
        this.ismodify = false;
        this.newProduct = {
          name: '',
          price: 0
        };
        this.searchkey = '';

        this.helpers({
            products() {
                const selector = {};
                // Show newest tasks at the top
                products = Meteor.call('products.search', this.searchkey);
                // products = Products.find({}, {
                //     sort: {
                //         createdAt: -1
                //     }
                // });
                console.log(products);
                return products;
            },
            ProductsCount() {
                return Products.find().count();
            },
            currentUser() {
                return Meteor.user();
            }
        })
    }

    search(){
      console.log(this.searchkey)
      Meteor.call('products.search', this.searchkey);
      //Products.search(searchkey);
    }

    addProduct(newProduct) {
        // Insert a task into the collection
        if(!this.ismodify){
          Meteor.call('products.insert', newProduct);
        }else{
          Meteor.call('products.update', newProduct);
          this.ismodify = false;
        }
        this.newProduct.name = '';
        this.newProduct.price = 0;
        this.newProduct.description = '';
    }

    setChecked(task) {
        // Set the checked property to the opposite of its current value
        Meteor.call('products.setChecked', task._id, !task.checked);
    }

    removeProduct(product) {
        Meteor.call('products.remove', product._id);
    }

    showModify(product){
      this.ismodify = true;
      this.newProduct = product;
    }

}

export default angular.module('productsList', [
        angularMeteor
    ])
    .component('productsList', {
        templateUrl: 'imports/components/productsList/productsList.html',
        controller: ['$scope', ProductsListCtrl]
    });