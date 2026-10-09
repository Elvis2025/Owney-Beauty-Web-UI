import axe from 'axe-core';

describe('accesibilidad base', () => {
  it('no presenta violaciones axe en la estructura interactiva principal', async () => {
    document.documentElement.lang = 'es';
    document.body.innerHTML = `<header><nav aria-label="Navegación principal"><a href="#contenido">Inicio</a></nav></header><main id="contenido"><h1>Owney Beauty</h1><form><label for="buscar">Buscar profesionales</label><input id="buscar"><button type="submit">Buscar</button></form><section aria-labelledby="resultados"><h2 id="resultados">Resultados</h2><article><h3>Profesional verificada</h3><p>Servicios de belleza.</p></article></section></main>`;
    const result = await axe.run(document.body, { rules: { 'color-contrast': { enabled: false } } });
    expect(result.violations).toEqual([]);
  });
});
