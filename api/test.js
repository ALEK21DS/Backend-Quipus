// Endpoint de prueba simple para verificar que Vercel funciona
module.exports = (req, res) => {
  res.json({
    success: true,
    message: 'Vercel Serverless Function funcionando',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  })
}
