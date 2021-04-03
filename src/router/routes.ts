import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'Pacientes', component: () => import('pages/Pacientes.vue') }
    ]
  },
  {
    path: '/Login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ]
  },
  {
    name: 'Paciente',
    path: '/Paciente/:idPaciente',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/components/Paciente.vue') }
    ]
  },
  {
    name: 'AnamnesisSocial',
    path: '/Paciente/:idPaciente/AnamnesisSocial',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/components/AnamnesisSocial.vue') }
    ]
  },
  {
    name: 'ObservacionDiagnostivo',
    path: '/Paciente/:idPaciente/ObservacionDiagnostico',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/components/ObservacionDiagnostico.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
