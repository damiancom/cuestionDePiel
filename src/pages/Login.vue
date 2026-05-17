<template>
  <q-page class="flex flex-center bg-grey-2" style="min-height: 100vh;">
    <q-card class="q-pa-xl shadow-2 minimal-login-card">
      <div class="text-h5 text-center text-primary q-mb-lg">Iniciar Sesión</div>
      <q-form @submit.prevent="handleLogin">
        <q-input v-model="email" label="Email" type="email" class="minimal-input q-mb-md" borderless dense autofocus />
        <q-input v-model="password" label="Contraseña" type="password" class="minimal-input q-mb-md" borderless dense />
        <q-btn
          label="Ingresar"
          color="primary"
          type="submit"
          class="full-width minimal-btn-save q-mt-md"
          :loading="loading"
          :disable="loading"
        />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { login } from '../services/auth';

const router = useRouter();
const $q = useQuasar();
const email = ref('');
const password = ref('');
const loading = ref(false);

async function handleLogin() {
  if (!email.value || !password.value) return;

  loading.value = true;
  try {
    await login(email.value, password.value);
    router.push('/pacientes');
  } catch (error) {
    const errorMessages = {
      'auth/invalid-credential': 'Email o contraseña incorrectos',
      'auth/user-not-found': 'No existe una cuenta con ese email',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos. Intente más tarde',
      'auth/invalid-email': 'El formato del email no es válido',
    };
    const message = errorMessages[error.code] || 'Error al iniciar sesión';
    $q.notify({
      type: 'negative',
      message,
      caption: error.code || error.message,
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.minimal-login-card {
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #ececec;
  max-width: 340px;
  width: 100%;
}
.minimal-input {
  background: transparent !important;
  border-radius: 10px;
  border: none !important;
  box-shadow: none !important;
  font-size: 15px;
  padding: 8px 12px;
  transition: border-color 0.2s;
  border-bottom: 1.5px solid #e0e4ea !important;
  margin-bottom: 8px;
}
.minimal-input:focus-within {
  border-bottom: 1.5px solid #1976d2 !important;
}
.minimal-btn-save {
  border-radius: 8px;
  font-weight: 500;
  font-size: 15px;
  min-width: 90px;
  box-shadow: none;
  text-transform: none;
  background: #1976d2;
  color: #fff;
  transition: background 0.15s;
}
.minimal-btn-save:hover {
  background: #125ea7;
}
</style>
