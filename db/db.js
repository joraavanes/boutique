exports.connectionString = process.env.MONGODB_URI;

exports.localDatabase = process.env.MONGO_URI_LOCAL;

exports.options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};