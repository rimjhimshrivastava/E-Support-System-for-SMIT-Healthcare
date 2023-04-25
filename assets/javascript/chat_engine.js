class ChatEngine {
  constructor(chatBoxId, userEmail) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;

    this.socket = io.connect("http://localhost:5000");

    if (this.userEmail) {
      this.connectionHandler();
    }
  }

  connectionHandler() {
    let self = this;
    this.socket.on("connect", function () {
      console.log("connection established using sockets for text chat...!");
      self.socket.emit("join_room", {
        user_email: self.userEmail,
        chatroom: window.locals.chatting_key
      });
      console.log("chatkey:", window.locals.chatting_key);
      console.log(window.locals);
      self.socket.on("user_joined", function (data) {
        console.log("a user joined text chat: ", data);
      });
    });

    // send a message on clicking the send button.
    $("#send-message").click(function () {
      let msg = $("#chat-message-input").val();
      if (msg != "") {
        self.socket.emit("send_message", {
          message: msg,
          user_email: self.userEmail,
          chatroom: `${window.locals.chatting_key}`,
        });
      }
    });

    self.socket.on("receive_message", function (data) {
      console.log("message received", data.message);

      let newMessage = $("<li>");
      let messageType = "other-message";
      if (data.user_email == self.userEmail) {
        messageType = "self-message";
      }

      newMessage.append($("<span>", {
        html: data.message,
      }));
      // sub stands for subscript
      newMessage.append($("<sub>", {
        html: data.user_email,
      }));

      newMessage.addClass(messageType);

      $('#chat-messages-list').append(newMessage);
    });
  }
}
