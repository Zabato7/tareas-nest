import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App.vue';

// Simula la API de NestJS con un array en memoria
function mockApi(inicial = []) {
  let tareas = structuredClone(inicial);
  let siguienteId = tareas.length + 1;
  // Devuelve copias, como una respuesta HTTP real (si no, App y el mock compartirían objetos)
  const responder = (status, body) => ({
    ok: status < 400,
    status,
    json: async () => structuredClone(body),
  });

  return vi.fn(async (url, { method = 'GET', body } = {}) => {
    const id = Number(url.split('/').pop());
    const datos = body ? JSON.parse(body) : {};

    if (method === 'GET') return responder(200, tareas);
    if (method === 'POST') {
      const t = { id: siguienteId++, titulo: datos.titulo, completada: false };
      tareas.push(t);
      return responder(201, t);
    }
    if (method === 'PATCH') {
      const t = tareas.find((x) => x.id === id);
      Object.assign(t, datos);
      return responder(200, t);
    }
    if (method === 'DELETE') {
      tareas = tareas.filter((x) => x.id !== id);
      return responder(204, null);
    }
  });
}

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockApi([{ id: 1, titulo: 'Existente', completada: false }]));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('carga y muestra las tareas de la API', async () => {
    const wrapper = mount(App);
    await flushPromises();

    expect(wrapper.findAll('li')).toHaveLength(1);
    expect(wrapper.text()).toContain('Existente');
    expect(wrapper.text()).toContain('1 pendiente');
  });

  it('añade una tarea nueva', async () => {
    const wrapper = mount(App);
    await flushPromises();

    await wrapper.find('form input').setValue('Nueva tarea');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.findAll('li')).toHaveLength(2);
    expect(wrapper.text()).toContain('Nueva tarea');
    expect(wrapper.find('form input').element.value).toBe('');
  });

  it('marca y elimina tareas', async () => {
    const wrapper = mount(App);
    await flushPromises();

    await wrapper.find('li input[type="checkbox"]').trigger('change');
    await flushPromises();
    expect(wrapper.find('li').classes()).toContain('hecha');
    expect(wrapper.text()).toContain('0 pendientes');

    await wrapper.find('li .borrar').trigger('click');
    await flushPromises();
    expect(wrapper.findAll('li')).toHaveLength(0);
    expect(wrapper.text()).toContain('No hay tareas todavía');
  });

  it('muestra un aviso si el backend no responde', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const wrapper = mount(App);
    await flushPromises();

    expect(wrapper.find('.error').text()).toContain('No se pudo conectar con la API');
  });
});
