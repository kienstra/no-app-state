export default function hasSchema(a, b) {
  return typeof b === 'object'
    ? Object.entries(b).every(([k, v]) => {
      return hasSchema(a[k], v)
    })
    : typeof a === typeof b
}
