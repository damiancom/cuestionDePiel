export interface datosPersonales {
  id?: string,
  fotoPerfil: string,
  nombre: string,
  apellido: string,
  fechaNacimiento: string,
  domicilio: string,
  localidad: string,
  celular: string,
  telefono: string,
  mail: string,
  genero: string,
  estadoCivil: string,
  escolaridad: string
}

export interface datosAdicionales {
  escolaridad: string,
  motivoConsulta: string
}

export interface antecedenteMedico {
  id?: number,
  intervencionesQuirurgicas: string,
  enfermedades: string,
  alergias: string,
  medicamentos: string,
  habitos: string,
  antecedentesEnfermedadesCutaneas: string,
  antecedentesFamiliares: string
}

export interface apoyoDomiciliario {
  id?: number,
  motivoConsulta: string,
  rutinaDiaSugerida: string,
  rutinaNocheSugerida: string,
  rutinaSemanalSugerida: string
}

export interface observacionDiagnostico {
  id: number,
  biotipoCutaneo: string,
  fototipo: string,
  sesiones: sesion[]
}

export interface sesion {
  id?: number,
  observacion: string,
  tratamiento: string,
  frecuenciaSesiones: string,
  apoyoDomiciliario: string,
  fecha: Date
}

export interface piel {
  tipo: string,
  forma: string,
  disposicion: string,
  distribucionLesiones: string
}

export interface lesionCutanea {
  inicio: string,
  lugarInicio: string,
  sintomas: string,
  evolucion: string,
  cambios: string,
  factoresIncrementanRiesgo: string,
  tratamientosPosteriores: string
}

export interface observacionLesiones {
  aspectoFisico: string,
  piel: piel,
  lesionCutanea: lesionCutanea
}

export interface rutina {
  id?: number,
  nombre: string,
  multipartFile: string,
  mimeType: string
}

export interface marca {
  id?: number,
  nombre: string
}

export interface marcaSelect {
  label: string,
  brand: marca
}

export interface product {
  id?: number,
  name: string,
  codigo: string,
  contenido: string,
  marca?: marca,
  precioCompra: number
}
