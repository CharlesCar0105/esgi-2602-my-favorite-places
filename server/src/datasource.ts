import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Address } from "./entities/Address";

const datasource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  entities: [User, Address],
  logging: true,
  synchronize: true,
});

export default datasource;
