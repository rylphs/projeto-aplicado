import { Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  content: string;
  confirm: boolean;
  somenteNotificacao?: boolean;
}

export function confirm(dialog: MatDialog, title:string, content:string, callback:(result:any)=>any){
  const dialogRef = dialog.open(ConfirmDialogComponent, {
    data: {title, content},
  });
  dialogRef.afterClosed().subscribe(callback)
}

export function notify(dialog: MatDialog, title:string, content:string, callback:(result:any)=>any){
  const dialogRef = dialog.open(ConfirmDialogComponent, {
    data: {title, content, somenteNotificacao:true},
  });
  dialogRef.afterClosed().subscribe(callback)
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  cancelar(){
    this.dialogRef.close(false);
  }

  confirmar(){
    this.dialogRef.close(true);
  }
}
