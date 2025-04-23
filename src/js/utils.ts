import { date } from 'quasar'

export function calcularEdad (fechaNac : Date) : number {
  const hoy = new Date()
  const fechaNacimiento = new Date(fechaNac)

  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
  const difMeses = hoy.getMonth() - fechaNacimiento.getMonth()

  if (difMeses < 0 || (difMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--
  }

  return edad
}

export function formatearFecha (fecha : Date | string) : string {
  if (fecha !== null) {
    if (typeof fecha === 'string') {
      fecha = fecha.toString() + 'T00:00:00'
    } else {
      fecha.setHours(0, 0, 0, 0)
    }
    return date.formatDate(fecha, 'DD/MM/YYYY')
  } else {
    return ''
  }
}

export function formatearFechaDB (fecha: Date | string): string {
  if (!fecha) return ''

  if (typeof fecha === 'string') {
    return fecha
  }

  const year = fecha.getFullYear()
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  const day = String(fecha.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function base64ToArrayBuffer (base64: string) {
  const binaryString = window.atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  return bytes.map((byte, i) => binaryString.charCodeAt(i))
}
