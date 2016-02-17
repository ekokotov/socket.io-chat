/**
*  Module Chat
*
* Description
*/
var app = angular.module('chat', ['btford.socket-io', 'ngSanitize']);

app.controller('main', function($scope, socket, $sce){
	 var vm = this;
	 vm.header = 'JchAt v.0.1';
	 vm.messages = [];
	 vm.$sce = $sce;
	 vm.myMessage = {
	 	text: '',
	 	time: null,
	 	user: 'Me'
	 }
	 var client = {
	 	id: null,
	 	totalUsers: 0
	 }
	 socket.on('new:message', function (data) {
	 	if (data.id!==client.id) addNewMessage(data);
  	});

 	socket.on('connected', function (data) {
	 	console.log("connected approuved. id: ", data.id)
	 	client.id = data.id;
	 	addSystemMessage(data);
  	}); 

  	socket.on('disconnect:user', function (data) {
  		data.text = 'One user left the channel';
	 	addSystemMessage(data);
  	});

  	socket.on('new:user', function (data) {
  		data.text = 'new user joined the channel';
	 	addSystemMessage(data);
  	});

	 vm.sendMessage = function() {
	 	if (!vm.myMessage || !vm.myMessage.text) return;
	 	addNewMessage(vm.myMessage, 'Me');
	 	vm.myMessage.id = client.id;
	 	socket.emit('send:message', vm.myMessage);
	 	vm.myMessage = null;
	 }

  	function addSystemMessage(message) {
  		message.type = 'SYSTEM';
  		message.time = new Date(message.time).toGMTString();
  		if (message.totalUsers) client.totalUsers = message.totalUsers;
	 	vm.messages.push(message);
  	}

	 function addNewMessage(data, user) {
	 	var message = {
	 		text: data.text,
	 		user: user || 'Unknown',
	 		type: 'USER'
	 	}
	 	vm.messages.push(message);
	 }
});

//Service to interact with the socket library
app.factory('socket', function (socketFactory) {
    var myIoSocket = io.connect(SOCKETADDR);

    var socket = socketFactory({
        ioSocket: myIoSocket
    });

    return socket;
});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.filter('html', ['$sce', function ($sce) { 
    return function (text) {
        return $sce.trustAsHtml(text);
    };    
}])