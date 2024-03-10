import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  const router = inject(Router);
 

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        switch (error.status) {

          case 400:
            {
              if (error.error.errors) {
                const modelStateErrors = []
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {

                    modelStateErrors.push(error.error.errors[key])
                  }
                }
                throw modelStateErrors.flat()

              } else {
                toastr.error(error.error, error.status.toString())
              }
            }
            break;
          case 401:
            {
              toastr.error("Unauthorize Access")
              break;
            }

          case 404:
            {
              console.log(error);
              toastr.error("Not Found")
              router.navigateByUrl("/not-found")
              break;
            }
          case 500:
            {
              const navigationExtras: NavigationExtras = { state: { error: error.error } }
              router.navigateByUrl("/server-error", navigationExtras)
              break;
            }
          default:
            {
              const navigationExtras: NavigationExtras = { state: { error: error.error } }
              toastr.error("Internal Server Error")
              console.log(error.error);
                router.navigateByUrl("/server-error", navigationExtras)
              break;
            }
        }
      }
      throw error;
    })
  );

};
