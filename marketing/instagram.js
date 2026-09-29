const normalized = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const aliases = [
  ['Moldería, Corte y Confección', ['molderia', 'corte y confeccion']],
  ['Secretariado y Facturación Médica', ['secretariado y facturacion medica']],
  ['Instalación de aire acondicionado', ['aire acondicionado']],
  ['Mecánica de motos', ['mecanica de motos']],
  ['Inyección de motos', ['inyeccion de motos']],
  ['Soldadura', ['soldadura']],
  ['Armado de muebles', ['armado de muebles']],
  ['Electricidad domiciliaria', ['electricidad domiciliaria']],
  ['Cerrajería', ['cerrajeria']],
  ['Plomería', ['plomeria']],
  ['Lencería y trajes de baño', ['lenceria', 'trajes de bano']],
];
export function detectCourses(text, catalog = []) {
  const caption = ' ' + normalized(text) + ' ';
  const matches = new Map();
  for (const [label, words] of [...aliases, ...catalog.filter(Boolean).map(label => [label, [label]])]) {
    if (words.some(word => caption.includes(' ' + normalized(word) + ' '))) {
      const canonical = aliases.find(([name]) => normalized(name) === normalized(label))?.[0] || label;
      matches.set(normalized(canonical), canonical);
    }
  }
  return [...matches.values()];
}
export function instagramId(value) {
  try {
    const url = new URL(value);
    if (!['instagram.com', 'www.instagram.com'].includes(url.hostname)) return '';
    return url.pathname.match(/\/(?:p|reel|reels)\/([A-Za-z0-9_-]+)(?:\/|$)/)?.[1] || '';
  } catch { return ''; }
}
export function snapshotRecords(snapshot, catalog = []) {
  return (snapshot?.posts || []).map(post => {
    const date = new Intl.DateTimeFormat('sv-SE', {timeZone:'America/Argentina/Buenos_Aires'}).format(new Date(post.publishedAt));
    const names = detectCourses(post.text, catalog);
    return {id:'instagram:' + instagramId(post.url),kind:'content',state:'Publicado',platform:'Instagram',format:post.format,
      publishedDate:date,date,url:post.url,text:post.text,title:post.text.split('\n')[0],courseNames:names,source:'Instagram verificado'};
  });
}
export function mergePublications(local, imported) {
  const combined = new Map();
  for (const record of [...imported, ...local.filter(r => r.kind === 'content' && r.state === 'Publicado')]) {
    const id = record.platform === 'Instagram' ? instagramId(record.url) : '';
    const key = id ? 'instagram:' + id : 'local:' + record.id;
    const existing = combined.get(key);
    // The verified source determines the publication date; local planning remains untouched.
    combined.set(key, existing ? {...record,...existing} : record);
  }
  return [...combined.values()];
}
