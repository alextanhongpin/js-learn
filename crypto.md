```js
// Using the window crypto  api to generate random string.
function randomString(length) {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._~'
  let result = ''
  while (length > 0) {
    const bytes = new Uint8Array(16)
    const random = window.crypto.getRandomValues(bytes)
    random.forEach(function(c) {
      if (length === 0) {
        return
      }
      if (c < charset.length) {
        result += charset[c]
        length--
      }
    })
  }
  return result
}
randomString(16)

// Persist the nonce against the request.
window.localStorage.setItem('nonce', randomString(16))

// Validate the nonce.
const jwt = '...' // Validate the decoded jwt body.
if (jwt.nonce === window.localStorage.getItem('nonce')) {
  // Nonce is ok.
}
```
