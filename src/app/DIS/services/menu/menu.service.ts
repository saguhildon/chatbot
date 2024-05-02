import {EventEmitter, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AuthGuard} from '@dis/auth/auth.guard';
import {RoleTypes} from '@dis/auth/roles.enum';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  isLoggedIn$: Promise<boolean>;

  pageNameChangeEmitter = new EventEmitter<string>();

  constructor(
    private router: Router,
    private authGuard: AuthGuard
  ) {}

  filterMenuItems(menuGroups): Array<any> {
    menuGroups = menuGroups.filter(groups => {
      let result = new Array();

      if (groups.items){
        result = groups.items.filter(item => this.isLinkActivated(item.elevation));
        groups.items = result;
      }else {
        return this.isLinkActivated(groups.elevation);
      }

      return result.length > 0;
    });

    return menuGroups;
  }

  isLoginView(): boolean {
    return this.router.url === '/login';
  }

  isLinkActivated(elevation: Array<RoleTypes>): boolean {
    return this.authGuard.isAuthorized(elevation);
  }

  checkIsLoggedIn(): Promise<boolean>{
    return this.authGuard.isAuthenticated();
  }

  getPageNameChangeEmitter() {
    return this.pageNameChangeEmitter;
  }

  pageChange(name) {
    this.pageNameChangeEmitter.emit(name);
  }
}
