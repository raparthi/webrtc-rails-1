// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(function() {
	// GUID FUNCTION
	var GUID = (function() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	               .toString(16)
	               .substring(1);
	  };
	  return function() {
	    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	           s4() + '-' + s4() + s4() + s4();
	  };
	})()();
	
	// ベンダープレフィックスを除外
	RTCPeerConnection = webkitRTCPeerConnection ||
		mozRTCPeerConnection ||
		RTCPeerConnection ||
		msRTCPeerConnection;
	
	// navigator.getUserMediaに統一
	navigator.getUserMedia = navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia;
	
	// window.URLに統一
	URL = window.URL || window.webkitURL;
	
	// WebSocket接続
	var dispatcher = new WebSocketRails('localhost:3000/websocket');
	
	// Peerオブジェクトを生成
	var peer = new RTCPeerConnection({ 
		"iceServers": [{
			"url": "stun:stun.l.google.com:19302"
		}]
	});
	
	// 相手のPeerが接続された時のイベント
	peer.onaddstream = function(e) {
		
		console.log("onAddstream log");
		// TODO ユーザーがデバイスのアクセスを拒否した際のフォールバック処理の記述
		var remote = $("#remote_tv")[0];
		remote.src = URL.createObjectURL(e.stream);
	};
	
	peer.onicecandidate = function(e) {
		console.log("onicecandidate log");
		
		if (e.candidate) {
			var message = {
				username: "送信元のユーザー名",
				guid: GUID,
				target: "接続先のGUID",
				candidate: e.candidate
			};
			
			// Candidateの送信
			dispatcher.trigger("candidate", JSON.stringify(message));
		}
	};
	
	// Offerの作成
	$("#connect").on("click", function() {
		peer.createOffer(function(localDescription)　{
			console.log("createOffer log");
			
			// 自身のSDPをローカルのPeerオブジェクトにセット
			peer.setLocalDescription(localDescription, function() {
				var offer = {
					username: 'AnonymousUser',
					guid: GUID,
					target: "接続先のGUID",
					description: localDescription
				};
				
				// 自身のdescriptionと接続したいGUIDを送信する
				dispatcher.trigger("sendOffer", JSON.stringify(offer));
			});
		});
	});
	
	// navigator.getUserMediaを実行
	if (!navigator.getUserMedia) {
		alert("WebRTC is not supported!!");
		return false;
	} else {
		navigator.getUserMedia({video: true, audio: false}, function(stream) {
			// video要素の取得
			var video = $("#my_tv")[0];
			
			// srcにBlob URLを指定するとカメラの画像がストリームで流れる
	        video.src = URL.createObjectURL(stream);
	        video.play();
	        
	        // 自分のpeerにカメラストリームを接続させる
	        // RTC接続確立後に相手のストリームに渡される
	        peer.addStream(stream);
			
		}, function(error) {
			alert(error.name);
		});
	}
	
	
	// OnOpenが呼び出されているか確かめる
	dispatcher.bind("on_open", function(message) {
		console.log("broadcast on_open log");
		
		var json = JSON.parse(message);
		
		console.log("username is " + json.username);
		console.log("guid is " + json.guid);
		console.log("connection_id is " + json.connection_id);
	});
	
	// WebSocketにコネクションを張った時に呼ばれるイベント
	dispatcher.on_open = function(data) {
		console.log("on_open log");
		
		var message = {
			username: 'Anonymous',
			guid: GUID,
			connection_id: data.connection_id
		};
		dispatcher.trigger("on_open", JSON.stringify(message));
		// ws_rails.trigger("websocket_chat", comment);
	};
	
	dispatcher.bind("sendOffer", function(message) {
		var json = JSON.parse(message);
		
		if (json.guid == GUID) return;
		
		console.log("broadcast sendOffer log");
		//alert(message);
		
		// 送信元の情報を元にdescriptionを初期化
		var remoteDescription = new RTCSessionDescription(json.description);
		
		if (remoteDescription.type === 'offer') {
			peer.setRemoteDescription(remoteDescription, function() {
				console.log("sendOffer setRemoteDescription log");
				
				// 相手のPeerオブジェクトにローカルのSDPをセットした後は
				// アンサーを返します
				peer.createAnswer(function(localDescription) {
					
					// 相手のローカルのSDPをまず自分自身のPeerオブジェクトにセットする
					peer.setLocalDescription(localDescription, function() {
						var answer = {
							username: "Anonymous Answer User log",
							guid: GUID,
							target: "送信相手のGUID",
							description: localDescription
						};
						// アンサーの送信
						dispatcher.trigger("sendAnswer", JSON.stringify(answer));
					});
					
				});
			});
		}
	});
	
	dispatcher.bind("sendAnswer", function(message) {
		var json = JSON.parse(message);
		
		if (json.guid == GUID) return;
		
		console.log("broadcast sendAnswer log");
		
		// 送信元の情報を元にdescriptionを初期化
		var remoteDescription = new RTCSessionDescription(json.description);
		
		if (remoteDescription.type === 'answer') {
			peer.setRemoteDescription(remoteDescription, function() {
				console.log("finished!!!");
			});
		}
	});
	
	dispatcher.bind("candidate", function(message) {
		console.log("broadcast candidate log");
		
		var json = JSON.parse(message);
		if (json.candidate) {
			// Candidateオブジェクトに復元(文字列から)
			var iceCandidate = new RTCIceCandidate(json.candidate);
			
			// Peerオブジェクトにセット
			peer.addIceCandidate(iceCandidate);
		}
	});
	

});