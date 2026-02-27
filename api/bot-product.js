// Archivo: /api/bot-product.js

export default async function handler(req, res) {
    const { slug } = req.query;
  
    // Variables de entorno de Supabase (las mismas que usas en Vite)
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
  
    try {
      // Buscamos el producto en Supabase directamente (sin React)
      const response = await fetch(`${SUPABASE_URL}/rest/v1/products?slug=eq.${slug}&select=*`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      
      const data = await response.json();
      const product = data[0];
  
      // Si no encuentra el producto, lo manda al index
      if (!product) {
        return res.redirect(302, `/product/${slug}`);
      }
  
      // Le devolvemos a WhatsApp un HTML vacío pero con las etiquetas perfectas
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta property="og:type" content="product" />
            <meta property="og:title" content="${product.name} - ${product.brand}" />
            <meta property="og:description" content="${product.description}" />
            <meta property="og:image" content="${product.image_url}" />
            <meta property="og:url" content="https://lumiereessence.com.ar/product/${slug}" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content="${product.image_url}" />
          </head>
          <body>
            <script>window.location.href = "/product/${slug}";</script>
          </body>
        </html>
      `);
  
    } catch (error) {
      res.redirect(302, `/product/${slug}`);
    }
  }