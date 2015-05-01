'use strict';

var users = require('../../app/controllers/users.server.controller'),
    image = require('../../app/controllers/file-upload.server.controller');

module.exports = function(app) {
	// Routing logic   
	// ...
    app.route('/uploadfile')
        .post(image.create);

};