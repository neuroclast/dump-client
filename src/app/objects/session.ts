import {Jwt} from "./jwt";

export class Session {
  user_id: number;
  username: string;
  expiration: Date;
  jwt_token: Jwt;
}
