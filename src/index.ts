interface User {
    birthYear: number
}

function calcAgeOfUser(user: User) {
    return new Date().getFullYear() - user.birthYear
}

calcAgeOfUser({
    birthYear: 2000
})