'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);

/**
 * Create a File upload
 */

exports.create = function(req, res) {
   console.log("Hi");
   console.log(res);



};


exports.read = function(req, res) {

    gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {

        if(files.length===0){
            return res.status(400).send({
                message: 'File not found'
            });
        }

        res.writeHead(200, {'Content-Type': files[0].contentType});

        var readstream = gfs.createReadStream({
            filename: files[0].filename
        });

        readstream.on('data', function(data) {
            res.write(data);
        });

        readstream.on('end', function() {
            res.end();
        });

        readstream.on('error', function (err) {
            console.log('An error occurred!', err);
            throw err;
        });
    });
};


/**
 * Update a File upload
 */
exports.update = function(req, res) {

};

/**
 * Delete an File upload
 */
exports.delete = function(req, res) {

};

/**
 * List of File uploads
 */
exports.list = function(req, res) {

};