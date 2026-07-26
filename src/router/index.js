import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated, waitForAuth } from '../services/auth';

const routes = [
  {
    path: '/login',
    component: () => import('../pages/Login.vue'),
    meta: { layout: 'auth', public: true }
  },
  {
    path: '/',
    redirect: '/pacientes',
    meta: { requiresAuth: true }
  },
  {
    path: '/pacientes',
    component: () => import('../pages/PatientsList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pacientes/nuevo',
    component: () => import('../pages/PatientCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pacientes/:id',
    component: () => import('../pages/PatientDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/agenda',
    component: () => import('../pages/Agenda.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/servicios',
    component: () => import('../pages/Services.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ventas',
    component: () => import('../pages/Sales.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/catalogo',
    component: () => import('../pages/RecommendedProducts.vue'),
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Esperamos a que Firebase resuelva el estado de auth antes de evaluar el guard.
// Esto evita el "flasheo" al login cuando el usuario ya está autenticado y recarga la página.
let authReady = false;

router.beforeEach(async (to, from, next) => {
  if (!authReady) {
    await waitForAuth();
    authReady = true;
  }

  const authenticated = isAuthenticated();

  if (!to.meta.public && to.meta.requiresAuth && !authenticated) {
    next({ path: '/login' });
  } else if (to.path === '/login' && authenticated) {
    next({ path: '/pacientes' });
  } else {
    next();
  }
});

export default router;
