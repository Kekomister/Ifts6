export class Publicacion{
    id_Publicacion : number;
    titulo : string;
    descripcion : string;
    imagen : any;
    fecha_Publicacion : Date | undefined;
    id_Usuario : number;
    id_Pagina : number;

    pagina : string;
    id_Sector : number;
    nombre_Usuario : string;
    sector : string;
    
    constructor(){}
}

// id_Publicacion, titulo, descripcion, imagen, fecha_Publicacion, id_Usuario, id_Sector
//  int,           varchar,varchar,   varbinary,   date,             int,        int