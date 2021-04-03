import { date } from 'quasar'

export function calcularEdad (fechaNac : Date) : number {
  const hoy = new Date()
  const unit = 'years'

  return date.getDateDiff(hoy, fechaNac, unit)
}

export function formatearFecha (fechaNac : Date) : string {
  return date.formatDate(new Date(fechaNac), 'DD/MM/YYYY')
}
