import {AuthService} from "../services/auth.service";

declare var $;

export class ErrorHandler {
  public static http(authService: AuthService, err) {
    if(err && err.status && err.status == 418) {
      console.error("Error: Login expired");

      $('#expiredModal').modal()
        .on('hidden.bs.modal', function (e) {
          authService.logout();
      });
    }
  }
}
