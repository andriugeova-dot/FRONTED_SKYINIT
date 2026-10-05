import type { APIRoute } from 'astro';

const BACKEND_URL = 'http://localhost:8001/api/inmobiliaria/servicios';

export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params;
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const body = await request.text();

    const response = await fetch(`${BACKEND_URL}/${id}/estado`, {
      method: 'PATCH',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, message: 'Error de conexión al cambiar el estado del servicio.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};