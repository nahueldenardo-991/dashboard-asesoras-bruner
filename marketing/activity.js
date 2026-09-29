// Editorial activity is counted by actual publication date, not planned date.
export function publicationStats(records, month) {
  const published = records.filter(r => r.kind === 'content' && r.state === 'Publicado' && /^\d{4}-\d{2}-\d{2}$/.test(r.publishedDate || '') && r.publishedDate.startsWith(month + '-'));
  return {
    total: published.length,
    instagram: published.filter(r => r.platform === 'Instagram').length,
    whatsapp: published.filter(r => r.platform === 'WhatsApp').length,
    courses: new Set(published.flatMap(r => r.courseNames || [r.courseName || r.courseCode]).filter(Boolean).map(name => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())).size,
  };
}
export function enrollmentRanking(items) {
  return (items || []).map(r => ({ label: String(r.label || 'Sin informar'), count: Math.max(0, Number(r.count) || 0) }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'es'));
}
