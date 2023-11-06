using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ChatApp.Models

{
    public class ChatMessage
    {

    
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string User { get; set; }
        public string Room { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }


}
