const trim = (value: string) => {
    return ( value || '' ).replace(/^\s+|\s+$/g, '');
}

export {
    trim
}
