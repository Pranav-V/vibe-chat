const users = []

function addUser(id,name,room)
{
    name = name.trim().toLowerCase() 
    room = room.trim().toLowerCase()

    const existingUser = users.find((user) => user.room === room & user.name === name)
    if(existingUser)
    {
        return {error: "Username is taken", user: null}
    }

    const user = {id,name,room}

    users.push(user)
    console.log(users)
    return {error: false, user: user}
}

function removeUser(id)
{
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1)
    {
        return users.splice(index,1)[0]
    }
}

function getUser(id)
{
    return users.find((user) => user.id === id)
}

function getUsersInRoom(room)
{
    users.filter((user) => user.room === room)
}

module.exports = {addUser, removeUser, getUser, getUsersInRoom}