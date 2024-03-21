import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModalRef?: BsModalRef<ConfirmDialogComponent>

  constructor(private modalService: BsModalService) { }

  confirm(
    title = 'confirmation',
    message = 'Are you sure you want to do this',
    btnOkTxt = 'OK',
    btnCancelTxt = 'Cancel',
  ): Observable<boolean> {
    const config = {
      initialState: {
        title,
        message,
        btnOkTxt,
        btnCancelTxt
      }

    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, config);
    return this.bsModalRef.onHidden!.pipe(
      map(() => {
        return this.bsModalRef!.content!.result
      })
    )
  }
}
