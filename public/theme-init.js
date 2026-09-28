try {
  var savedTheme = localStorage.getItem('subtv-tema')
  document.documentElement.setAttribute('data-tema', savedTheme === 'escuro' ? 'escuro' : 'claro')
} catch (error) {
  document.documentElement.setAttribute('data-tema', 'claro')
}
