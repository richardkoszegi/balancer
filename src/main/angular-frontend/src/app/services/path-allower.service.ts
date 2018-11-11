import {Injectable} from "@angular/core";
import {UserService} from "./user.service";

class Restriction {
  path: string;
  role: string;
}

const restrictions: Restriction[] = [
  {path: 'users', role: 'ROLE_ADMIN'} as Restriction,
];

@Injectable()
export class PathAllowerService {

  constructor(private userService: UserService) {
  }

  checkPath(path: string): boolean {
    const restriction = this.getRestriction(path);
    if (restriction !== null && this.userService.user) {
        return restriction.role === this.userService.user.role;
    } else {
      return true;
    }
  }

  getRestriction(path: string): Restriction {
    for (const r of restrictions) {
      if (r.path === path) {
        return r;
      }
    }
    return null;
  }

}

