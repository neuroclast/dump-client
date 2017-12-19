export class Jwt {
  public header: any;
  public payload: any;
  public signature: string;
  public token: string;

  constructor(jwtString?: string) {

    if(!jwtString)
      return;

    // store token
    this.token = jwtString;

    let jwtParts = jwtString.split(".");
    this.header = JSON.parse(atob(jwtParts[0]));
    this.payload = JSON.parse(atob(jwtParts[1]));
    this.signature = jwtParts[2];
  }
}
