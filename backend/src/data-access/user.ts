import { localCache } from "../localCache";
import { prisma } from "../lib/prismaConn";
import logger from "../logger";
import bcrypt from "bcrypt"

//temporary type
interface UserDTO {
    id: string
    password_hash: string
}

export async function getUserByEmail(email: string): Promise<UserDTO | null>{
    let user = localCache.get(email) as UserDTO | null;
    try {
        if(!user) {
            user = await prisma.user.findUnique({
                where: {email},
                select: {
                    id: true,
                    password_hash: true
                }
            })
            if(!user) return null
            localCache.set(email, user)
        }; 
        return user;
    } catch (err) {
        //temporary error handler
        logger.error(err)
        return null
    }
}
 
//no type for now
export async function createUser(fullname: string, phone_number: string, email: string, password: string) {
    try {   
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                display_name: fullname,
                email,
                phone_number,
                password_hash: hashPassword,
            },
            select: {
                id: true,
            }
        });

        return user
    } catch (err) {
        //temporary error handler
        logger.error("Database Error: ", err)
        return null
    }
}