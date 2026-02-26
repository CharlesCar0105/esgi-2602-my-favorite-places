import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Address } from "./entities/Address";

const datasource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "admin",
  password: "admin",
  database: "myapp",
  entities: [User, Address],
  logging: true,
  synchronize: true,
});

export default datasource;
