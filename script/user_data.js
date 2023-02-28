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

    return users.sort((a,b) => a.username.localeCompare(b.username));
}

module.exports = createUsers;