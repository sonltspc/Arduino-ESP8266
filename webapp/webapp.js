angular.module('myApp', [
    'ngRoute',
    'mobile-angular-ui',
	'btford.socket-io'
])

.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'home.html',
        controller: 'Home'
    })
})

.factory('mySocket', function (socketFactory) {
	var myIoSocket = io.connect('/webapp');	//Tên namespace webapp

	mySocket = socketFactory({
		ioSocket: myIoSocket
	})
	return mySocket;

/////////////////////// Những dòng code ở trên phần này là phần cài đặt, các bạn hãy đọc thêm về angularjs để hiểu, cái này không nhảy cóc được nha!
})

.controller('Home', function($scope, mySocket) {
	////Khu 1 -- Khu cài đặt tham số
    //cài đặt một số tham số test chơi
	//dùng để đặt các giá trị mặc định
    $scope.TrangThai = "Chưa kết nối với Server";
    $scope.Den = "Đang Tắt"

	////Khu 2 -- Cài đặt các sự kiện khi tương tác với người dùng
	//các sự kiện ng-click, nhấn nút sẽ gửi "ON"
	$scope.BatDen  = function() {
		mySocket.emit("ON")    // Gửi "ON" đến esp8266
	}

  $scope.TatDen  = function() {
    mySocket.emit("OFF")
  }

	////Khu 3 -- Nhận dữ liệu từ ESP8266 rồi socket server truyền tải!)
	//các sự kiện từ esp8266, thông qua server)
	mySocket.on('ON', function(json) {
		$scope.Den = (json.digital == 1) ? "" : "ĐANG BẬT"
	})

  mySocket.on('OFF', function(json) {
    $scope.Den = (json.digital == 1) ? "" : "Đang Tắt"
  })

  mySocket.on('OK', function(json) {
    $scope.TrangThai = (json.digital == 1) ? "" : "ĐÃ KẾT NỐi VỚI SERVER"
  })

  mySocket.on('NO', function(json) {
    $scope.TrangThai = (json.digital == 1) ? "" : "Đã mất kết nối với Server"
  })
	//// Khu 4 -- Những dòng code sẽ được thực thi khi kết nối với ESP8266 (thông qua socket server)
  // Khi Webapp connected với Server sẽ gửi "WEB" hiển thị trên Console Server
  // Và gửi "WEB" đến ESP8266, ESP8266 gửi "OK" cho Webapp qua Server
	mySocket.on('connect', function() {
		console.log("connected")
		mySocket.emit("WEB") //Cập nhập trạng thái ESP8266
	})

})
