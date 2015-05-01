/**
 * Created by kalra on 27-Apr-15.
 */
'use strict';

//socket factory that provides the socket service
angular.module('core').factory('Socket', ['socketFactory',

    function(socketFactory) {
        return socketFactory({
           prefix: '',
            ioSocket: io.connect('http://localhost:3000')
        });
    }
]);