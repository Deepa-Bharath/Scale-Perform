import { RepositoryType } from "../shared/types";  
import { MongoDBRepository } from "./mongoDB/mongoRepository.js";
// import { PostgreSQLRepository } from "./postgreSQL/repository.js"; --- IGNORE ---

export class RepositoryFactory {
    static createRepository(type: RepositoryType) {
        switch (type) {
            case "mongoDB":
                return new MongoDBRepository();
            default:
                throw new Error("Unsupported repository type");
        }
    }
}