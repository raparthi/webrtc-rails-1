# WebsocketRails::BaseControllerを継承

class WebsocketTvchatController < WebsocketRails::BaseController
  # Websocket on_open
  def open_connection
    logger.info("open_connection");
    logger.info("self.client_id is " + self.client_id)
    receive_message = message()
    
    broadcast_message(:on_open, receive_message)
  end
  
  def sendOffer
    logger.info("sendOffer");
    logger.info("self.client_id is " + self.client_id)
    # logger.info("self.connection is " + self.connection)
    receive_message = message()
    
    broadcast_message :sendOffer, receive_message
  end
  
  def sendAnswer
    logger.info("sendAnswer");
    logger.info("self.client_id is " + self.client_id)
    # logger.info("self.connection is " + self.connection)
    receive_message = message()
    
    broadcast_message :sendAnswer, receive_message
  end
  
  def candidate
    logger.info("candidate");
    logger.info("self.client_id is " + self.client_id)
    # logger.info("self.connection is " + self.connection)
    receive_message = message()
    
    broadcast_message :candidate, receive_message
  end
end