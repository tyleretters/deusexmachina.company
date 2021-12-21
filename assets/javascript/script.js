$(function() {

/*
 * Make all post images link to high res versions of themsleves.
 * The other options besides JS were to do it in markdown which is an awful author/writing
 * experience or extend Jekyll to do this during compilation. ¯\_(ツ)_/¯
 */
$('article img').each(function() {
  $(this).wrap('<a href="' + this.src + '"></a>');
});

// Thanks to Andy E for this shuffler:
// https://stackoverflow.com/questions/3943772/how-do-i-shuffle-the-characters-in-a-string-in-javascript
String.prototype.shuffle = function () {
    var trim = this.trim();
    var [padL, padR] = this.split(trim);
    var a = trim.split("").filter(c => c !== " "),
        fullLen = trim.length,
        len = a.length;

    for(var i = len - 1; i > 0; i--) {
        var tmp = a[i];

        var j = Math.floor(Math.random() * (i + 1));
        a[i] = a[j];
        a[j] = tmp;
    }

    for (var i = (fullLen - len); i > 0; i--) {
        a.splice(Math.floor(Math.random() * (len - 1) + 1), 0, " ");
    }
    
    return [padL, ...a, padR].join("");
}

// Thanks to Justin Windle for posting this scrambler:
// https://codepen.io/soulwire/pen/mErPAK
class TextScramble {
  constructor(el) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#________'
    this.update = this.update.bind(this)
  }
  setText(newText) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => this.resolve = resolve)
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }
  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}

/* thanks to https://commoner.earth for the the holy ciphers */
/* https://github.com/tyleretters/apodcastfornow.com/blob/master/assets/script.js */
const phrases = [
  'Community',
  'Now',
  '2022',
  'Alienation',
  'the Possible',
  'Change',
  '⁂',
  'አሁን',
  'Now',
  'Anarchy',
  'Cyborgs',
  'Lost Futures',
  'the Anthropocene',
  '&#19932;',
  '现在',
  'Now',
  'the Open Sea',
  'Exit',
  'the Impatient',
  '&#10178;',
  'τώρα'
]

/* todo: scramble each */
/* todo: scramble only the title? */
if ($('.scramble').length) {
  const el = document.querySelector('.scramble');
  const fx = new TextScramble(el);

  let counter = 0;
  const next = () => {
    fx.setText(phrases[counter]).then(() => {
      setTimeout(next, 800);
    })
    counter = (counter + 1) % phrases.length;
  }

  next();
}

});