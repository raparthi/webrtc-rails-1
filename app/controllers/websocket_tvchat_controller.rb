# WebsocketRails::BaseControllerを継承

class WebsocketTvchatController < WebsocketRails::BaseController
  # Websocket on_open
  def open_connection
    receive_message = message()
    
    broadcast_message(:on_open, receive_message)
  end
  
  def sendOffer
    receive_message = message()
    
    broadcast_message :sendOffer, receive_message
  end
  
  def sendAnswer
    receive_message = message()
    
    broadcast_message :sendAnswer, receive_message
  end
  
  def candidate
    receive_message = message()
    
    broadcast_message :candidate, receive_message
  end
end