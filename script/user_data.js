const { faker } = require('@faker-js/faker');


function createSingleUser(isAdmin) {
    const username = faker.internet.userName().toLowerCase();
    //to make it easy to remember
    const password = username + "_pass";
    return {
        username,
        password,
        email: faker.internet.email(),
        isAdmin
    }
}

//creates n users, including n/10 admins
function createUsers(n) {
    const users = [];
    for(let i = 0; i < n; i++) {
        users.push(createSingleUser(i % 10 === 0 ? true : false));
    }

    users.push[
        {
            username: 'leah',
            password: 'leah_pass',
            email: 'leah@shop.com',
            isAdmin: true
        },
        {
            username: 'judy',
            password: 'judy_pass',
            email: 'judy@shop.com',
            isAdmin: true
        },
        {
            username: 'carla',
            password: 'carla_pass',
            email: 'carla@shop.com',
            isAdmin: true
        },
        {
            username: 'monique',
            password: 'monique_pass',
            email: 'leah@shop.com',
            isAdmin: true
        }
    ]

    return users.sort((a,b) => a.username.localeCompare(b.username));
}

module.exports = createUsers;