import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Column } from 'src/app/classes/column.model';
import { ConexionService } from 'src/app/services/conexion.service';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
  })
  export class TableComponent{
    @Input() filas: any[] = [];
  
    @Input() columnas: Column[] | undefined;
  
    @Output() accion: EventEmitter<any[]> = new EventEmitter<any[]>();
  
    constructor() {}

    borrar(info: any) {
      this.accion.emit(["borrar", info]);
    }
  
    modificar(info: any) {
      this.accion.emit(["modificar", info]);
    }
  }
  