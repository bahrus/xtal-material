export function getBasePath(tagName) {
  var path;
  var link = self['xtal_material'];

  if (link) {
    path = link.href;
  } else {
    var cs = document.currentScript;

    if (cs) {
      path = cs.src;
    } else {
      path = import.meta['url'];
    }
  }

  return path.split('/').slice(0, -1).join('/');
}
export function lispToSnakeCase(s) {
  return s.split('-').join('_');
} //# sourceMappingURL=getBasePath.js.map