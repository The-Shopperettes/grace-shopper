const { faker } = require('@faker-js/faker');

function createSingleUser() {
    const username = faker.internet.userName().toLowerCase();
    //to make it easy to remember
    const password = username + "_pass";
    return {
        username,
        password,
        email: faker.internet.email()
    }
}


function createUsers(n) {
    const users = [];
    for(let i = 0; i < n; i++) {
        users.push(createSingleUser());
    }

    return users;
}

module.exports = createUsers;