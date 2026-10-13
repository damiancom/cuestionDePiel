import { createApp } from 'vue';
import { Quasar } from 'quasar';
import quasarLang from 'quasar/lang/es'; // español opcional
import quasarIconSet from 'quasar/icon-set/material-icons';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

import 'quasar/dist/quasar.css';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/roboto-font/roboto-font.css';

if (quasarLang && quasarLang.label) {
  quasarLang.label.ok = 'Confirmar';
  quasarLang.label.cancel = 'Cancelar';
}

const app = createApp(App);

app.use(Quasar, {
  lang: quasarLang,
  iconSet: quasarIconSet,
});
app.use(router);
app.use(createPinia());

app.mount('#q-app');
