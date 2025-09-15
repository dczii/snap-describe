import {faker} from "@faker-js/faker"
import bcrypt from "bcrypt"
import { prisma } from "./lib/prismaConn";
import logger from "./logger";

console.log(process.env.DATABASE_URL);
const uniqueEmail = new Set(); // storage
function generateUniqueEmail () {
    
    let email: string
    do {
        email = faker.internet.email() //generate email
    } while (uniqueEmail.has(email)) //repeat if already exist
    uniqueEmail.add(email)
    return email
}

async function hashPassword (pass: string) {
    const hashed_Password = await bcrypt.hash(pass, 10);
    return hashed_Password
}

async function main () {
    // await Promise.all(
    //     Array.from({length: 10}).map(async () => {
    //         await prisma.user.create({
    //             data: {
    //                 email: generateUniqueEmail(),
    //                 display_name: faker.person.fullName(),
    //                 password_hash: await hashPassword(faker.internet.password()),
    //                 status: Math.random() > 0.5 ? "verified" : "unverified",
    //             }
    //         })
    //     })
    // )
    
    const hash_password = await bcrypt.hash("Tester01!", 10)
    await prisma.user.create({
        data: {
            email: "tester01@gmail.com",
            display_name: "Tester01",
            password_hash: hash_password,
            status: "unverified",
        }
    })

}

main()
  .then(() => logger.info("Successfully populated database."))
  .catch((err) => logger.error("Error during seeding:", err))