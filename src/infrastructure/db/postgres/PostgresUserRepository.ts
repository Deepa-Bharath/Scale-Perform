import type { CreateUserInput, PublicUser,User } from "../../../domain/entities/User.js";
import type { UserRepository } from "../../../domain/repositories/UserRespository.js";
import { db } from "./connection.js"
export class PostgresUserRepository implements UserRepository {
    async create(user: CreateUserInput): Promise<PublicUser> {
        const userCreated = await db.insertInto('users').values({
             name: user.name,
             email: user.email,
             password_hash: user.password_hash,
             created_at: new Date(),
             updated_at: new Date()
            }).returning(["id", "name", "email"]).executeTakeFirstOrThrow();
            return {
                id: String(userCreated.id),
                name: userCreated.name,
                email: userCreated.email,
            };
    }
    
    async findByEmail(email: string): Promise<User | null> {
        const user = await db.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst();
        if (!user) return null;
        return { ...user, id: String(user.id) };
    }

    async findByemailWithPasswordHash(email: string, password_hash: string): Promise<User | null> {
        const user = await db.selectFrom('users').where('email', '=', email).where('password_hash', '=', password_hash)
        .selectAll().executeTakeFirst();
        return user || null;
    }
}
