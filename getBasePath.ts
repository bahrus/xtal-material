export function getBasePath(tagName) {
    let path;
    const link = self['xtal_material'];
    if (link) {
        path = link.href;
    } else {
        const cs = document.currentScript as HTMLScriptElement;
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
}