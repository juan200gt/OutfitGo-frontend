export interface UserAddress {
  id?: number;
  nombre_direccion: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string;
  telefono: string;
  es_principal: boolean;
}