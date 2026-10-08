const API_URL = 'http://localhost:3000/api/tareas';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    throw new Error(msg || `Error ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export const listarTareas = () => request(API_URL);

export const crearTarea = (titulo) =>
  request(API_URL, { method: 'POST', body: JSON.stringify({ titulo }) });

export const actualizarTarea = (id, cambios) =>
  request(`${API_URL}/${id}`, { method: 'PATCH', body: JSON.stringify(cambios) });

export const borrarTarea = (id) => request(`${API_URL}/${id}`, { method: 'DELETE' });
