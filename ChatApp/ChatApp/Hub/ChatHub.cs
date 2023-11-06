using ChatApp.Configuration;
using ChatApp.Models;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Hub
{
    public class ChatHub:Microsoft.AspNetCore.SignalR.Hub
    {
        private readonly IDictionary<string, UserRoomConnection> _connection;
        private readonly ChatContext _context;

        public ChatHub(IDictionary<string, UserRoomConnection> connection , ChatContext context)
        {
            _connection = connection;
            _context = context;
            
        }

        public async Task JoinRoom(UserRoomConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room!);
            _connection[Context.ConnectionId] = userConnection;
            await Clients.Group(userConnection.Room!).SendAsync("RecieveMessage","Lets program",$"{ userConnection.User} has Joined the chat",DateTime.Now);
            await SendConnectedUser(userConnection.Room!);
        }


        public async Task SendMessage(string message)
        {
            if(_connection.TryGetValue(Context.ConnectionId,out UserRoomConnection userRoomConnection))
            {
                var chatMessage = new ChatMessage
                {
                    User = userRoomConnection.User,
                    Room = userRoomConnection.Room,
                    Message = message,
                    Timestamp = DateTime.Now
                };

                _context.ChatMessages.InsertOne(chatMessage);

                await Clients.Group(userRoomConnection.Room!).SendAsync("RecieveMessage", userRoomConnection.User, message, DateTime.Now);
            }
        }


        public override Task OnDisconnectedAsync(Exception? exception)
        {
            if (!_connection.TryGetValue(Context.ConnectionId, out UserRoomConnection roomConnection) )
            {
                return base.OnDisconnectedAsync(exception);

                // Room connection exists and is not null, perform operations
            }
            _connection.Remove(Context.ConnectionId);   
            Clients.Group(roomConnection.Room!).SendAsync("RecieveMessage", "Lets program", $"{roomConnection.User} has left the chat", DateTime.Now);
            SendConnectedUser(roomConnection.Room!);
            return base.OnDisconnectedAsync(exception);
        }



        public Task SendConnectedUser(string room)
        {
            var users = _connection.Values.Where(u=>u.Room == room).Select(s=>s.User);
            return Clients.Group(room).SendAsync("ConnectedUser", users);
        }



    }
}
