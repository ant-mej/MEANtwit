'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    multer = require('multer'),
	Article = mongoose.model('Article'),
    fs = require('fs'),
	_ = require('lodash'),
    Buffer =    require('buffer/').Buffer;
    var path = require('path');
/**
 * Create a article
 */
exports.create = function(req, res) {
	var article = new Article(req.body);
	    article.user = req.user;
        article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
            socketio.sockets.emit('article.created', article); // emit an event for all connected clients
			res.json(article);
		}
	});
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
	var article = req.article;

	article = _.extend(article, req.body);

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
	var article = req.article;

	article.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
	Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	});
};
exports.uploadFiles = function(req,res)
{
    var venue = req;
    var fullUrl = req.protocol + '://' + req.get('host') ;
    var dateObject = new Date();
    var uniqueId = dateObject.getFullYear() + '' + dateObject.getMonth() + '' +dateObject.getDate() + '' +dateObject.getTime();
    var _filepath = path.resolve('uploads/');//path.resolve('public/uploads/', 'uploads');


    function decodeBase64Image(dataString) { //console.log();
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};

        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        return response;
    }

    var imgName = uniqueId + '.jpeg';
    var _newPath = _filepath + '/' +imgName;
    var dbPath = fullUrl + '/uploads/' + imgName;
    var imageContent = decodeBase64Image(venue.image);
    venue.image = dbPath;
    fs.writeFile(_newPath, imageContent.data, function(err) {
        if (err) {
            console.log('Error comes');
        }
    });
    console.log(req.body);
console.log(req);
}
/**
 * Article middleware
 */
exports.articleByID = function(req, res, next, id) {
	Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
		if (err) return next(err);
		if (!article) return next(new Error('Failed to load article ' + id));
		req.article = article;
		next();
	});
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};