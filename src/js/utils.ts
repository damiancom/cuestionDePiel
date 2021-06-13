import { date } from 'quasar'

export function calcularEdad (fechaNac : Date) : number {
  const hoy = new Date()
  const fechaNacimiento = new Date(fechaNac)
  console.log(hoy, fechaNac, fechaNacimiento)

  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
  const difMeses = hoy.getMonth() - fechaNacimiento.getMonth()

  if (difMeses < 0 || (difMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--
  }

  return edad
}

export function formatearFecha (fechaNac : Date | string) : string {
  return date.formatDate(fechaNac, 'DD/MM/YYYY')
}

export function formatearFechaDB (fechaNac : Date | string) : string {
  return date.formatDate(fechaNac, 'YYYY-MM-DD')
}
