## Simple algorithm to truncate text

For `See more` feature, when the text can be very long. Breaking it into smaller text to make it more readable. 200 characters is choosen as the threshold for best readability. Note that we do not take into limit the number of sentences (like max 3 sentences), because the sentence could be short and does not fulfill the 200 characters requirements.

```js
const text = `The Creaking Pagoda or Chinese Summer-House is located in Tsarskoye Selo, outside Saint Petersburg, Russia, between two ponds on the boundary separating the Catherine Park of the Baroque Catherine Palace and the New Garden of the neoclassical Alexander Palace's Alexander Park. The pagoda, designed by Georg von Veldten, is a folly that resulted from the 18th-century taste for chinoiserie. The walls are decorated with figures of dragons and other stylized Chinese motifs. Construction lasted from 1778 to 1786, and the structure was restored from 1954 to 1956. The name of the structure refers to a characteristic sound produced by a metal weathervane, shaped like a banner, on the top of the structure, which creaks when it is turned by the wind.`

function truncateHalf(text) {
    const tokens = text.split(' ')
    const mid = Math.floor(tokens.length / 2)
    const sentence = tokens.slice(0, mid).join(' ')
    return [sentence, '...'].join(' ')
}

function truncate(text, n = 200) {
    if (text.length < n) return text

    const sentences = text.split('.')
    let len = 0
    const result = []
    while (len < n) {
        const sentence = sentences.shift()
        result.push(sentence)
        len += sentence.length
    }
    const last = result.pop()
    result.push(truncateHalf(last))
    return result.join('.')
}

console.log(truncate(text))
// The Creaking Pagoda or Chinese Summer-House is located in Tsarskoye Selo, outside Saint Petersburg, Russia, between two ponds on the...
```
