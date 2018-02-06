import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
//import {Match}  from "meteor/"

var elasticsearch = require('elasticsearch');

var ES = new elasticsearch.Client({
    host: '127.0.0.1:9200'
});
console.log(ES);
export const Products = new Mongo.Collection('products');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('products', function productsPublication() {
        return Products.find({
            $or: [{
                owner: this.userId
            }, ],
        });
    });
}
const NumberAndBigThan0 = Match.Where((x) => {
    check(x, Number);
    return x > 0;
});
Meteor.methods({
    'products.insert' (product) {
        console.log(product);
        try {
            check(product.name, String);
            check(product.price, NumberAndBigThan0);
        } catch (err) {
            return console.log(err);
        }
        


        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        product.createdAt = new Date();
        product.owner = Meteor.userId();
        id = Products.insert(product);
        console.log(id);
        ES.create({
            index: 'products',
            type: 'product',
            id: id,
            body: product
        }, function(error, response) {
            console.log(error);
            console.log(response)
        });
    },
    'products.remove' (productId) {
        try {
            check(productId, String);
        } catch (err) {
            return alert(err);
        }
        const product = Products.findOne(productId);
        if (product.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        Products.remove(productId);
        ES.remove({
            index: 'products',
            type: 'product',
            id: productId
        }, function(error, response) {
            console.log(error);
            console.log(response)
        });
    },
    'products.search' (key) {
        //this.ES.
        console.log('search key:'+key);
        result = ES.search({
            index: 'products',
            type: 'product',
            query: {
                "bool": {
                    "should": [{
                            "match": {
                                "name": key
                            }
                        },
                        {
                            "match": {
                                "description": key
                            }
                        }
                    ]
                }
            }
            
        }).then(function (body) {
            console.log(body);
            var hits = body.hits.hits;
          }, function (error) {
            console.trace(error.message);
          });
        return result;//this.Products.find({});
    },
    'products.update' (product) {
        console.log(product);
        try {
            check(product.id, String);
            check(product.name, String);
            check(product.price, NumberAndBigThan0);
        } catch (err) {
            return alert(err);
        }

        const prod = Products.findOne(product.id);
        if (prod.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        Products.update(product.id, {
            $set: product
        });
        ES.update({
            index: 'products',
            type: 'product',
            id: product.id,
            body: product
        }, function(error, response) {
            console.log(error);
            console.log(response)
        });
    },
    'products.setChecked' (taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        const task = Products.findOne(taskId);
        if (task.private && task.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }

        Products.update(taskId, {
            $set: {
                checked: setChecked
            }
        });
    }
});