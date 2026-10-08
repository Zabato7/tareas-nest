<script setup>
import { computed, onMounted, ref } from 'vue';
import { actualizarTarea, borrarTarea, crearTarea, listarTareas } from './api';

const tareas = ref([]);
const nueva = ref('');
const cargando = ref(true);
const error = ref('');

const pendientes = computed(() => tareas.value.filter((t) => !t.completada).length);

// Ejecuta una llamada a la API y muestra el error si falla
async function conError(fn) {
  error.value = '';
  try {
    await fn();
  } catch (e) {
    error.value = e.message === 'Failed to fetch'
      ? 'No se pudo conectar con la API. ¿Está corriendo el backend en el puerto 3000?'
      : e.message;
  }
}

onMounted(() =>
  conError(async () => {
    tareas.value = await listarTareas();
  }).finally(() => (cargando.value = false)),
);

function agregar() {
  const titulo = nueva.value.trim();
  if (!titulo) return;
  conError(async () => {
    tareas.value.push(await crearTarea(titulo));
    nueva.value = '';
  });
}

function alternar(tarea) {
  conError(async () => {
    Object.assign(tarea, await actualizarTarea(tarea.id, { completada: !tarea.completada }));
  });
}

function eliminar(tarea) {
  conError(async () => {
    await borrarTarea(tarea.id);
    tareas.value = tareas.value.filter((t) => t.id !== tarea.id);
  });
}
</script>

<template>
  <main>
    <h1>Mis Tareas</h1>

    <form @submit.prevent="agregar">
      <input v-model="nueva" placeholder="¿Qué hay que hacer?" autofocus />
      <button type="submit">Añadir</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="cargando" class="muted">Cargando…</p>
    <p v-else-if="tareas.length === 0" class="muted">No hay tareas todavía.</p>

    <ul v-else>
      <li v-for="t in tareas" :key="t.id" :class="{ hecha: t.completada }">
        <input type="checkbox" :checked="t.completada" @change="alternar(t)" />
        <span>{{ t.titulo }}</span>
        <button class="borrar" title="Eliminar" @click="eliminar(t)">×</button>
      </li>
    </ul>

    <p v-if="tareas.length" class="muted">{{ pendientes }} pendiente{{ pendientes === 1 ? '' : 's' }}</p>
  </main>
</template>

<style>
:root { color-scheme: light dark; --accent: #42b883; --muted: #888; --border: #8884; }
body { margin: 0; font: 16px/1.5 system-ui, sans-serif; padding: 3rem 1rem; }
main { max-width: 520px; margin: 0 auto; }
form { display: flex; gap: .5rem; margin-bottom: 1rem; }
form input { flex: 1; min-width: 0; padding: .6rem .75rem; font: inherit; border: 1px solid var(--border); border-radius: 8px; }
form button { padding: .6rem 1rem; font: inherit; font-weight: 600; border: none; border-radius: 8px; background: var(--accent); color: #fff; cursor: pointer; }
ul { list-style: none; padding: 0; margin: 0; border: 1px solid var(--border); border-radius: 8px; }
li { display: flex; align-items: center; gap: .75rem; padding: .6rem .75rem; border-bottom: 1px solid var(--border); }
li:last-child { border-bottom: none; }
li span { flex: 1; word-break: break-word; }
li.hecha span { text-decoration: line-through; color: var(--muted); }
li input { accent-color: var(--accent); width: 1.1rem; height: 1.1rem; }
.borrar { background: none; border: none; font-size: 1.25rem; color: var(--muted); cursor: pointer; }
.borrar:hover { color: #e5484d; }
.muted { color: var(--muted); font-size: .9rem; }
.error { color: #e5484d; }
</style>
