/// This is for mongodb only

const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget); // so we can use await here
const exec = mongoose.Query.prototype.exec;

// whenever we run some Query, we can use .cache() with the query to use caching with that query
mongoose.Query.prototype.cache = function (options = {}) {
  // to only cache the queries we want -
  // we need to do Task.find().cache()

  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || ''); // we could send some valid key like userId or we we may send nothing

  return this;
};

// this fn will run b4 every mongodb query
mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) return exec.apply(this, arguments);
  // if we have not used .cache() with a query fn, it will not run for a cache but a simple mongoose fn

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  //! 'this' refers to this 'Query' object
  //! this.model refers to a single record

  // See if we already have some value stored in a cache , for a 'key'
  const cacheValue = await client.hget(this.hashKey, key);

  // If we have, return that
  if (cacheValue) {
    console.log('RUNNING THROUGH CACHE', JSON.parse(cacheValue));
    const doc = JSON.parse(cacheValue);

    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  // Otherwise, issue the query and store the result in cache
  const result = await exec.apply(this, arguments);

  // hset is not working
  client.hset(this.hashKey, key, JSON.stringify(result));
  // if we wanna add expiration in 10s , we would have to do
  // client.hset(this.hashKey , key , JSON.stringify(result) , 'EX' . 10);

  console.log('RUNNING THROUGH MONGO', result);

  return result;
};

module.exports = {
  // whenever we create, update or delete something , we will clear cache
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};

// Clearing Cache
// terminal - node
// const redis = require('redis');
// const redisUrl = 'redis://127.0.0.1:6379';
// const client = redis.createClient(redisUrl);
// client.flushall()
