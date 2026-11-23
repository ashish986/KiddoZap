const board = document.querySelector('[data-game]');
const length = 6;

const alphabet = [
  ['A','Apple','🍎'], ['B','Ball','⚽'], ['C','Cat','🐱'], ['D','Dog','🐶'],
  ['E','Elephant','🐘'], ['F','Fish','🐟'], ['G','Grapes','🍇'], ['H','Hat','🎩'],
  ['I','Ice cream','🍦'], ['J','Juice','🧃'], ['K','Kite','🪁'], ['L','Lion','🦁'],
  ['M','Moon','🌙'], ['N','Nest','🪺'], ['O','Orange','🍊'], ['P','Penguin','🐧'],
  ['Q','Queen','👸'], ['R','Rabbit','🐰'], ['S','Star','⭐'], ['T','Turtle','🐢'],
  ['U','Umbrella','☂️'], ['V','Violin','🎻'], ['W','Watermelon','🍉'],
  ['X','Xylophone','🎶'], ['Y','Yo-yo','🪀'], ['Z','Zebra','🦓'],
];
const shapes = ['circle','square','triangle','rectangle','diamond','star'];
const pictures = [['🍎','apple'],['🍃','leaf'],['🌼','flower'],['🍄','mushroom'],['⭐','star'],['🦋','butterfly']];
const fruits = [['🍓','strawberry'],['🍋','lemon'],['🍊','orange'],['🍎','apple'],['🍐','pear'],['🍇','grape']];
const animals = [['🐻','bear'],['🐱','cat'],['🐰','rabbit'],['🐸','frog'],['🦊','fox'],['🐼','panda']];
const numbers = Array.from({ length: 10 }, (_, index) => index + 1);

function shuffled(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function choices(value, pool) {
  return shuffled([value, ...shuffled(pool.filter(item => item !== value)).slice(0, 2)]);
}

const captions = {
  'abc-garden': 'You matched six beginning letters.',
  'counting-basket': 'You counted six baskets.',
  'shape-picnic': 'You filled six picnic mats.',
  'pattern-picnic': 'You finished six patterns.',
  'picture-pairs': 'You found all four animal pairs.',
  'firefly-meadow': 'You lit all six lanterns.',
};

let round = 0;
let rounds = [];
let answered = false;
let pending = 0;
let audio;
let currentQuestion;

function chime() {
  try {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    audio ??= new Context();
    if (audio.state === 'suspended') void audio.resume().catch(() => {});
    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const time = audio.currentTime + index * .07;
      const tone = audio.createOscillator();
      const volume = audio.createGain();
      tone.type = 'sine';
      tone.frequency.value = frequency;
      volume.gain.setValueAtTime(.036, time);
      volume.gain.exponentialRampToValueAtTime(.001, time + .23);
      tone.connect(volume);
      volume.connect(audio.destination);
      tone.start(time);
      tone.stop(time + .24);
    });
  } catch {
    // The visual confirmation works on devices without sound.
  }
}

function header(total, completed) {
  return `<div class="game-head"><p>${completed} of ${total} complete</p><div aria-hidden="true" class="progress-dots">${Array.from({ length: total }, (_, i) => `<span class="${i < completed ? 'filled' : ''}"></span>`).join('')}</div></div>`;
}

function finish() {
  board.innerHTML = `<div class="finish arrive"><span class="picture" aria-hidden="true">🌟</span><h2 tabindex="-1">You did it!</h2><p>${captions[board.dataset.game]}</p><button class="primary" data-restart>Play again</button></div>`;
  board.querySelector('h2').focus();
}

function setupRounds() {
  const kind = board.dataset.game;
  if (kind === 'abc-garden') return shuffled(alphabet).slice(0, length);
  if (kind === 'counting-basket') return shuffled(numbers).slice(0, length);
  if (kind === 'shape-picnic') return shuffled(shapes);
  return shuffled([[0,1],[0,0,1],[0,1,1],[0,1,2],[0,1],[0,1,2]]).map((pattern, index) => {
    const order = shuffled(pictures);
    const steps = pattern.length * 2 + index % pattern.length;
    return { line: Array.from({ length: steps }, (_, place) => order[pattern[place % pattern.length]]), answer: order[pattern[steps % pattern.length]], pool: order };
  });
}

function shape(name) {
  return `<span class="shape ${name}" aria-hidden="true"></span>`;
}

function questionData() {
  const current = rounds[round];
  switch (board.dataset.game) {
    case 'abc-garden': {
      const [letter, name, pic] = current;
      return {
        visual: `<div><div class="picture" aria-hidden="true">${pic}</div><p class="picture-name">${name}</p></div>`,
        options: choices(letter, alphabet.map(entry => entry[0])),
        labels: value => value,
        answer: letter,
        say: name,
        correct: `${letter} for ${name}!`,
        hint: `Say “${name}” slowly and listen to the beginning.`,
      };
    }
    case 'counting-basket': {
      const [emoji, name] = fruits[round];
      return {
        visual: `<div class="count-grid">${Array.from({ length: current }, (_, index) => `<button class="counter" type="button" data-count aria-label="${name} ${index + 1}" aria-pressed="false">${emoji}</button>`).join('')}</div>`,
        options: choices(current, numbers),
        labels: value => value,
        answer: current,
        correct: `You counted ${current}!`,
        hint: 'Tap each fruit once to keep your place.',
      };
    }
    case 'shape-picnic':
      return {
        visual: `<div class="shape-outline" role="img" aria-label="${current} outline">${shape(current)}${shape(current)}</div>`,
        options: choices(current, shapes),
        labels: value => value,
        format: shape,
        answer: current,
        correct: `It fits! That is a ${current}.`,
        hint: 'Look at the edges and corners of the outline.',
      };
    default:
      return {
        visual: current.line.map(([emoji, name]) => `<span class="pattern-tile" role="img" aria-label="${name}">${emoji}</span>`).join('') + '<span class="pattern-tile pattern-gap" aria-label="Missing picture">?</span>',
        options: choices(current.answer, current.pool),
        labels: value => value[1],
        format: value => value[0],
        answer: current.answer,
        correct: `Yes! ${current.answer[1]} comes next.`,
        hint: 'Try saying the pictures from the beginning again.',
      };
  }
}

function renderQuestion(focus) {
  answered = false;
  const data = currentQuestion = questionData();
  board.innerHTML = `${header(length, round)}<h2 class="prompt" tabindex="-1">${board.dataset.instruction}</h2>
    <div class="visual arrive">${data.visual}</div>
    <div class="answer-row">${data.options.map((value, index) => `<button class="choice" type="button" data-choice="${index}" aria-label="${data.labels(value)}">${data.format?.(value) ?? value}</button>`).join('')}</div>
    <p class="feedback" role="status"></p>
    <div class="controls">
      ${data.say && 'speechSynthesis' in window ? '<button class="secondary" type="button" data-say>Hear the word</button>' : ''}
      <button class="primary" type="button" data-next hidden>${round === length - 1 ? 'Finish' : 'Next round'}</button>
    </div>`;
  if (focus) board.querySelector('h2').focus();
}

let cards = [];
let open = [];
let matched = 0;
function startMemory() {
  open = [];
  matched = 0;
  const pair = shuffled(animals).slice(0, 4);
  cards = shuffled([...pair, ...pair]);
  board.innerHTML = `${header(4, 0)}<h2 class="prompt" tabindex="-1">${board.dataset.instruction}</h2>
    <div class="memory-grid arrive">${cards.map((_, index) => `<button class="memory-card" data-card="${index}" aria-label="Turn over card ${index + 1}">✦</button>`).join('')}</div>
    <p class="feedback" role="status"></p><div class="controls"><button class="primary" data-next hidden>Finish</button></div>`;
}

function flipCard(button) {
  if (pending || button.classList.contains('revealed')) return;
  const index = Number(button.dataset.card);
  const [emoji, name] = cards[index];
  button.innerHTML = `<span class="arrive">${emoji}</span>`;
  button.classList.add('revealed');
  button.setAttribute('aria-label', `Card ${index + 1}: ${name}`);
  open.push(button);
  if (open.length !== 2) return;
  const feedback = board.querySelector('.feedback');
  if (cards[Number(open[0].dataset.card)] === cards[index]) {
    for (const card of open) {
      card.classList.add('matched');
      card.setAttribute('aria-disabled', 'true');
    }
    open = [];
    matched++;
    board.querySelector('.game-head').outerHTML = header(4, matched);
    feedback.textContent = `A pair of ${name}s!`;
    chime();
    if (matched === 4) {
      answered = true;
      board.querySelector('[data-next]').hidden = false;
      board.querySelector('[data-next]').focus();
    }
    return;
  }
  feedback.textContent = 'Different animals. Try another pair.';
  pending = window.setTimeout(() => {
    for (const card of open) {
      card.classList.remove('revealed');
      card.textContent = '✦';
      card.setAttribute('aria-label', `Turn over card ${Number(card.dataset.card) + 1}`);
    }
    open = [];
    pending = 0;
  }, 850);
}

let fireflies = [];
function renderMeadow(focus) {
  const lit = fireflies[round];
  board.innerHTML = `${header(length, round)}<h2 class="prompt" tabindex="-1">${board.dataset.instruction}</h2>
    <div class="meadow arrive">${Array.from({ length: 9 }, (_, index) => `<button class="firefly-cell" data-spot="${index}" aria-label="${index === lit ? 'Glowing firefly' : `Meadow spot ${index + 1}`}">${index === lit ? '<span class="glow" aria-hidden="true">✦</span>' : '·'}</button>`).join('')}</div>
    <p class="feedback" role="status"></p><div class="controls"><button class="primary" data-next hidden>${round === length - 1 ? 'Finish' : 'Next firefly'}</button></div>`;
  if (focus) board.querySelector('h2').focus();
}

function start(focus = false) {
  round = 0;
  answered = false;
  if (pending) window.clearTimeout(pending);
  pending = 0;
  if (board.dataset.game === 'picture-pairs') {
    startMemory();
  } else if (board.dataset.game === 'firefly-meadow') {
    fireflies = shuffled(Array.from({ length: 9 }, (_, index) => index)).slice(0, length);
    renderMeadow(focus);
  } else {
    rounds = setupRounds();
    renderQuestion(focus);
  }
  if (focus) board.querySelector('h2')?.focus();
}

function completeRound(button, message) {
  answered = true;
  button.classList.add('good');
  board.querySelector('.game-head').outerHTML = header(length, round + 1);
  board.querySelector('.feedback').textContent = message;
  for (const option of board.querySelectorAll('[data-choice], [data-spot]')) option.disabled = true;
  chime();
  const next = board.querySelector('[data-next]');
  next.hidden = false;
  next.focus();
}

board.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.hasAttribute('data-restart')) return start(true);
  if (button.hasAttribute('data-next')) {
    if (!answered) return;
    if (board.dataset.game === 'picture-pairs' || ++round === length) return finish();
    answered = false;
    return board.dataset.game === 'firefly-meadow' ? renderMeadow(true) : renderQuestion(true);
  }
  if (button.hasAttribute('data-card')) return flipCard(button);
  if (button.hasAttribute('data-spot') && !answered) {
    if (Number(button.dataset.spot) === fireflies[round]) {
      button.innerHTML = '🏮';
      completeRound(button, 'A lantern is glowing!');
    } else {
      board.querySelector('.feedback').textContent = 'Look for the bright star.';
    }
    return;
  }
  if (button.hasAttribute('data-count') && !answered) {
    button.classList.toggle('counted');
    button.setAttribute('aria-pressed', String(button.classList.contains('counted')));
    const count = board.querySelectorAll('.counted').length;
    board.querySelector('.feedback').textContent = `Counted: ${count}`;
    return;
  }
  if (button.hasAttribute('data-say')) {
    const utterance = new SpeechSynthesisUtterance(currentQuestion.say);
    utterance.lang = 'en-IN';
    utterance.rate = .82;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return;
  }
  if (button.hasAttribute('data-choice') && !answered) {
    const data = currentQuestion;
    if (data.options[Number(button.dataset.choice)] === data.answer) {
      completeRound(button, data.correct);
    } else {
      button.classList.add('try');
      board.querySelector('.feedback').textContent = data.hint;
    }
  }
});

start();
