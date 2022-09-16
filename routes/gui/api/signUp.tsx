import { HandlerContext } from "$fresh/server.ts";
import { Pool } from "pg/mod.ts";
import * as bcrypt from "bcrypt/mod.ts";
import { QueryObjectResult } from "pg/query/query.ts";

//import * as postgres from "https://deno.land/x/postgres/mod.ts";

export interface Ilogin {
  username: string;
  password: string;
}

export const handler = {
  async POST(req: Request, _res: Response, _ctx: HandlerContext) {
    try {
      const body: Ilogin = await req.json();
      const { username, password } = body;
      const salt: string = await bcrypt.genSalt(8);
      const hashedPW: string = await bcrypt.hash(password, salt);

      const POOL_CONNECTIONS = 3;
      const pool = new Pool(Deno.env.get("DB_URI"), POOL_CONNECTIONS, true);
      const connection = await pool.connect();

      // write to DB
      const checkUser: QueryObjectResult = await connection.queryObject(
        `
        SELECT * FROM users WHERE username = '${username}'
        `,
      );

      if (checkUser.rows.length === 0) {
        // TODO: set up JWT and redirect passing JWT
        await connection.queryObject(
          `INSERT INTO users (username, password) VALUES ('${username}', '${hashedPW}')`,
        );

        connection.end();

        return new Response(JSON.stringify({ username, password }), {
          status: 201,
        });
      }
    } catch (err) {
      console.log(err);
    }

    return new Response("Invalid Credentials", { status: 404 });
  },
};
