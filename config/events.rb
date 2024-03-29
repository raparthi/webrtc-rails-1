WebsocketRails::EventMap.describe do
  # You can use this file to map incoming events to controller actions.
  # One event can be mapped to any number of controller actions. The
  # actions will be executed in the order they were subscribed.
  #
  # Uncomment and edit the next line to handle the client connected event:
  #   subscribe :client_connected, :to => Controller, :with_method => :method_name
  #
  # Here is an example of mapping namespaced events:
  #   namespace :product do
  #     subscribe :new, :to => ProductController, :with_method => :new_product
  #   end
  # The above will handle an event triggered on the client like `product.new`.
  
  # websocket_chatイベントのマッピング
  # 第一引数がイベント名、第二引数がコントローラー、第三引数がメソッド
  
  subscribe :websocket_chat, 
    to: WebsocketChatController,
    with_method: :receive_message
    
    
  subscribe :on_open,
    to: WebsocketTvchatController,
    with_method: :open_connection
    
  subscribe :sendOffer,
    :to => WebsocketTvchatController,
    :with_method => :sendOffer
    
  subscribe :sendAnswer,
    :to => WebsocketTvchatController,
    :with_method => :sendAnswer
    
  subscribe :candidate,
    :to => WebsocketTvchatController,
    :with_method => :candidate

end
