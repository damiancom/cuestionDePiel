import { date } from 'quasar'

export function calcularEdad (fechaNac : Date) : number {
  const hoy = new Date()
  const unit = 'years'

  console.log(hoy, fechaNac)
  return date.getDateDiff(hoy, fechaNac, unit)
}

export function formatearFecha (fechaNac : Date | string) : string {
  return date.formatDate(fechaNac, 'DD/MM/YYYY')
}

export function formatearFechaDB (fechaNac : Date | string) : string {
  return date.formatDate(fechaNac, 'YYYY-MM-DD')
}
