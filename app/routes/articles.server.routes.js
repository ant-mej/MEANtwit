'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	articles = require('../../app/controllers/articles.server.controller');
var image_route = require('../../app/controllers/file-upload.server.controller');
var Buffer =    require('buffer/').Buffer;
var path = require('path');
module.exports = function(app) {
	// Article Routes
    app.route('/uploadfile').post(users.requiresLogin, articles.uploadFiles);
    	app.route('/articles')
		.get(articles.list,Buffer)
		.post(users.requiresLogin, articles.create);


	app.route('/articles/:articleId')
		.get(articles.read)
		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
};