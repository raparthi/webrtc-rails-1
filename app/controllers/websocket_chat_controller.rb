# WebsocketRails::BaseControllerを継承

class WebsocketChatController < WebsocketRails::BaseController
  def receive_message
    # クライアントからのメッセージを取得
    receive_message = message()
  
    # websocket_chatイベントで接続しているクライアントにブロードキャスト
    broadcast_message(:websocket_chat, receive_message)
  end
end