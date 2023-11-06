using ChatApp.Models;
using MongoDB.Driver;

namespace ChatApp.Configuration
{
    public class ChatContext
    {
        private readonly IMongoDatabase _database;
        private readonly ILogger<ChatContext> _logger;
        public ChatContext(IConfiguration configuration, ILogger<ChatContext> logger)
        {
            _logger = logger;

            var connectionString = configuration.GetSection("MongoDbSettings:ConnectionString").Value;
            var databaseName = configuration.GetSection("MongoDbSettings:DatabaseName").Value;

            _logger.LogInformation("MongoDB Connection String: {connectionString}", connectionString);
            _logger.LogInformation("MongoDB Database Name: {databaseName}", databaseName);

            var mongoClient = new MongoClient(connectionString);
            _database = mongoClient.GetDatabase(databaseName);
        }

        public IMongoCollection<ChatMessage> ChatMessages => _database.GetCollection<ChatMessage>("ChatMessages");
    }

}
