export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);

    const isHtml = response.headers.get('content-type')?.includes('text/html');
    const isAsset = url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|css|js|ico|woff2?)$/i);

    const headers = new Headers(response.headers);
    if (isHtml) {
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
