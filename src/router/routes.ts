import {RouteConfig} from 'vue-router'
import MainLayout from 'layouts/MainLayout.vue'
import Index from 'pages/Index.vue'
import Pacientes from 'pages/Pacientes.vue'
import Paciente from 'components/Paciente.vue'
import Login from 'pages/Login.vue'
import ApoyoDomiciliario from 'components/ApoyoDomiciliario.vue'
import ObservacionDiagnostico from 'components/ObservacionDiagnostico.vue'
import AltaPaciente from 'components/AltaPaciente.vue'
import Productos from 'pages/Productos.vue'
import Marcas from 'pages/Marcas.vue'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        name: 'index',
        path: '',
        component: Index
      },
      {
        name: '/alta-paciente',
        path: 'alta-paciente',
        component: AltaPaciente
      },
      {
        name: '/pacientes',
        path: 'pacientes',
        component: Pacientes
      },
      {
        name: '/productos',
        path: 'productos',
        component: Productos
      },
      {
        name: '/marcas',
        path: 'marcas',
        component: Marcas
      },
      {
        name: '/login',
        path: 'login',
        component: Login
      },
      {
        name: 'paciente',
        path: '/paciente/:idPaciente',
        component: Paciente
      },
      {
        name: 'apoyoDomiciliario',
        path: '/apoyoDomiciliario',
        component: ApoyoDomiciliario
      },
      {
        name: 'observacionDiagnostico',
        path: '/observacion-diagnostico',
        component: ObservacionDiagnostico
      }
    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
