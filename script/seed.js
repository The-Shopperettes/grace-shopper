'use strict'

const {db, models: {User, Product, CartItem, Order} } = require('../server/db');
const plantData = require('./plants/data');
const createUsers = require('./user_data');

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }) // clears db and matches models to tables

  const numUsers = 40;

  // Create Users with carts
  const userData = createUsers(numUsers);

  const users = await Promise.all(userData.map(user => {
    return User.create(user);
  }))

  // Creating products
  const products = await Product.bulkCreate(plantData);

  //add random products to user's carts
  await Promise.all(users.map(async ({id}) => {
    const productIds = Array(Math.floor(Math.random()*20)).fill(Math.floor(Math.random()*978)).map((num, i) => i + num + 1);

    CartItem.bulkCreate(productIds.map((productId) => {
      return {
        productId,
        cartId: id,
        qty: (Math.floor(Math.random() * 10) + 1)
      }
    }));
  }));


  await Promise.all(users.map(async ({id}) => {

    const arr = Array(Math.ceil(Math.random()*30)).fill({userId: id});

    const orders = await Order.bulkCreate(arr);

    orders.forEach(({id}) => {
      const productIds = Array(Math.floor(Math.random()*10)).fill(Math.floor(Math.random()*978)).map((num, i) => i + num + 1);

      CartItem.bulkCreate(productIds.map((productId) => {
        return {
          productId,
          orderId: id,
          qty: (Math.floor(Math.random() * 10) + 1)
        }
      }));
    })
  }))

  

  return {
    users,
    products
  }
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
  
    await db.close()
    
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
