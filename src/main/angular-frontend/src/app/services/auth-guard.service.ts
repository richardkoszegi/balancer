import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {UserService} from "./UserService";
import {PathAllowerService} from "./path-allower.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService,
              private pathAllowerService: PathAllowerService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.userService.isUserLoggedIn()) {
      const path: string = route.url.join('/');
      return this.pathAllowerService.checkPath(path);
    }
    this.router.navigate(['/login']);
    return false;
  }


}
