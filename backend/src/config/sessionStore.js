import MongoStore from "connect-mongo";

export async function createCustomMongoStore({ mongoUrl, dbName, collectionName }) {
  const mongoStore = MongoStore.create({
    mongoUrl,
    dbName,
    collectionName
  });

  mongoStore.on("error", err => {
    console.error("❌ Session store error:", err);
  });

  // Keep original set method
  const origSet = mongoStore.set;

  mongoStore.set = async function (sid, sessionData, callback) {
    try {
      let userId = sessionData.userId || (sessionData.passport && sessionData.passport.user);
  
      const s = {
        _id: sid,
        session: this.transformFunctions.serialize(sessionData),
        expires: sessionData?.cookie?.expires
          ? new Date(sessionData.cookie.expires)
          : new Date(Date.now() + this.options.ttl * 1000),
        userId: userId ? userId.toString() : null,
      };
  
      const collection = await this.collectionP;
      await collection.updateOne(
        { _id: s._id },
        { $set: s },
        { upsert: true }
      );
  
      if (callback) callback(null);
    } catch (err) {
      if (callback) callback(err);
    }
  };
  

  return mongoStore;
}
