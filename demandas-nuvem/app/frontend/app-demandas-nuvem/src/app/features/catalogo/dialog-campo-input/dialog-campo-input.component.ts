import { Component, forwardRef, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { InstanciaCampo } from '../campo.model';
import { CampoInputComponent } from "../campo-input/campo-input.component";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-campo-input',
  imports: [forwardRef(() => CampoInputComponent), MatDialogTitle, MatDialogContent,
    MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './dialog-campo-input.component.html',
  styleUrl: './dialog-campo-input.component.css'
})
export class DialogCampoInputComponent {
  campos!: InstanciaCampo[];
  readonly: boolean = false;
  dialogData = inject(MAT_DIALOG_DATA);

  constructor(private dialogRef: MatDialogRef<DialogCampoInputComponent>){
    this.campos = this.dialogData["campos"];
  }

  salvar(){
    this.dialogRef.close(this.campos);
  }

}
