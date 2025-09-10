import autocannon from "autocannon"
import {faker} from "@faker-js/faker"


async function run() {
    const result = await autocannon({
        url: "http://localhost:4000/api/auth/login",
        connections: 10,
        amount: 1000,
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify({
            email: `${faker.internet.email()}`,
            password: `${faker.internet.password()}`
        })
    });

    
    console.log(result)
}

run().catch((err) => console.error(err))
