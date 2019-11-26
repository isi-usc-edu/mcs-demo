export default function scramble(text) {
  var d = ''
  var b = ['+', '=', '$', '&', '#', '?', ' ', '/', '?', '%', '$', '&', '*', '/', '?', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  var f = []
  var a = []
  var j, g
  for (var h = 0; h < text.length; h++) {
    j = text.charAt(h)
    g = b.indexOf(j)
    f[h] = g
    a[h] = Math.floor(Math.random() * b.length)
  }
  for (h = 0; h < f.length; h++) {
    if (f[h] !== a[h]) {
      a[h]++
      if (a[h] > b.length - 1) {
        a[h] = 0
      }
      if (a[h] < 0) {
        a[h] = b.length - 1
      }
    }
    d += b[a[h]]
  }
  return d
}
