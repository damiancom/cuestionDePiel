export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface datosPersonales {
  nombre: string,
  apellido: string,
  fechaNacimiento: Date,
  domicilio: string,
  localidad: string,
  celular: string,
  telefono: string,
  mail: string,
  genero: string,
  estadoCivil: string
}

export interface datosAdicionales {
  escolaridad: string,
  motivoConsulta: string
}

export interface antecedentesMedicos {
  intervencionesQuirurgicas: string,
  enfermedades: string,
  alergias: string,
  medicamentos: string,
  habitos: string,
  antedecentesEnfermedadesCutaneas: string,
  antecedentesFamiliares: string
}

export interface anamnesisSocial {
  ocupacionLaboral: string,
  aficiones: string,
  exposicionRiesgos: string
}

export interface observacionDiagnostico {
  biotipoCutaneo: string,
  fototipo: string,
  edadCronologica: string,
  edadAparente: string,
  observaciones: string,
  tratamiento: string,
  frecuenciaSesiones: string,
  apoyoDomiciliario: string
}

export interface piel {
  tipo: string,
  forma: string,
  disposicion: string,
  distribucionLesiones: string
}

export interface lesion {
  inicio: string,
  lugarInicio: string,
  sintomas: string,
  evolucion: string,
  cambios: string,
  factoresIncrementanSintomas: string,
  tratamientoPosteriores: string
}

export interface observacionLesiones {
  aspectoFisico: string,
  piel: piel,
  lesion: lesion
}
