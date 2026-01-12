//selectors
const screens = document.querySelectorAll('[data-screen]');
const startBtn = document.querySelector('[data-action="start"]');
const chatContainer = document.querySelector('.chat-container');
const chatOptions = document.querySelector('.chat-options');
const chatInput = document.querySelector('[data-screen-element="input"] input');
const sendBtn = document.querySelector('[data-action="send"]');
const backBtn = document.querySelector('[data-action="back"]');
const skipBtn = document.querySelector('[data-action="skip"]');
const input = document.getElementById('chatInput');
const inputContainer = document.getElementById('chatInputContainer');
const answersHistory = [];
const uploadOverlay = document.getElementById('uploadOverlay');
const confirmationOverlay = document.getElementById('confirmationOverlay');
const endBtn = document.querySelector('[data-action="end"]');

//questions array
const questions = [
  {
    id: 'complaint_intro',
    next: 'context_duration',
    type: 'single',
    text: 'Hoi, voor welke klacht wil je een afspraak maken? Kies een van de opties of voer zelf iets in.',
    options: [
      {
        label: 'Algemeen en energie',
        icons: [
          { src: 'running-man.svg', alt: '' },
          { src: 'energy.svg', alt: '' },
        ],
        next: 'fallback_context_duration',
      },
      {
        label: 'Ademhaling, ogen of oren',
        icons: [
          { src: 'lungs.svg', alt: '' },
          { src: 'eye.svg', alt: '' },
          { src: 'ear.svg', alt: '' },
        ],
        next: 'breath_eyes_ears_intro',
      },
      {
        label: 'Spieren, gewrichten of huid',
        icons: [
          { src: 'muscle.svg', alt: '' },
          { src: 'joint.svg', alt: '' },
          { src: 'back.svg', alt: '' },
        ],
        next: 'fallback_context_duration',
      },
      {
        label: 'Hoofd en zenuwen',
        icons: [
          { src: 'head.svg', alt: '' },
          { src: 'nerve.svg', alt: '' },
        ],
        next: 'fallback_context_duration',
      },
      {
        label: 'Mentaal en gevoelens',
        icons: [{ src: 'sadness.svg', alt: '' }],
        next: 'fallback_context_duration',
      },
      {
        label: 'Geslachtsorganen of zwangerschap',
        icons: [
          { src: 'gender.svg', alt: '' },
          { src: 'fetus.svg', alt: '' },
        ],
        next: 'fallback_context_duration',
      },
      {
        label: 'Hart, bloed of buik',
        icons: [
          { src: 'cardio.svg', alt: '' },
          { src: 'blood.svg', alt: '' },
          { src: 'stomach.svg', alt: '' },
        ],
        next: 'fallback_context_duration',
      },
      {
        label: 'Zelf invullen',
        next: 'context_duration',
      },
    ],
  },
  {
    id: 'breath_eyes_ears_intro',
    next: 'context_duration',
    type: 'single',
    text: 'Kies de optie die het beste past.',
    options: [
      {
        label: 'Ademhaling',
        icons: [{ src: 'lungs.svg', alt: '' }],
        next: 'breath_intro',
      },
      {
        label: 'Ogen',
        icons: [{ src: 'eye.svg', alt: '' }],
        next: 'fallback_context_duration',
      },
      {
        label: 'Oren',
        icons: [{ src: 'ear.svg', alt: '' }],
        next: 'fallback_context_duration',
      },
      {
        label: 'Zelf invullen',
        next: 'context_duration',
      },
    ],
  },
  {
    id: 'breath_intro',
    next: 'context_duration',
    type: 'single',
    text: 'Dankjewel. Kun je aangeven wat het meest van toepassing is?',
    options: [
      {
        label: 'Verstopte neus of loopneus',
        icons: [{ src: 'runny-nose.svg', alt: '' }],
        next: 'context_duration',
      },
      {
        label: 'Keelpijn',
        icons: [{ src: 'throat.svg', alt: '' }],
        next: 'context_duration',
      },
      {
        label: 'Hoesten',
        icons: [{ src: 'cough.svg', alt: '' }],
        next: 'context_duration',
      },
      {
        label: 'Zelf invullen',
        next: 'context_duration',
      },
    ],
  },
  {
    id: 'fallback_context_duration',
    next: 'context_progress',
    type: 'single',
    text: 'Let op! De testflow bevat alleen de stappen voor hoesten. Je krijgt alleen vragen te zien over hoesten. Laten we dieper ingaan op je probleem. Hoe lang heb je daar last van?',
    options: [
      { label: 'Korter dan 1 week', next: 'context_progress' },
      { label: '1 tot 2 weken', next: 'context_progress' },
      { label: '2 tot 3 weken', next: 'context_progress' },
      { label: 'Langer dan 3 weken', next: 'context_progress' },
    ],
  },
  {
    id: 'context_duration',
    next: 'context_progress',
    type: 'single',
    text: 'Duidelijk! Laten we dieper ingaan op je probleem. Hoe lang heb je daar last van?',
    options: [
      { label: 'Korter dan 1 week', next: 'context_progress' },
      { label: '1 tot 2 weken', next: 'context_progress' },
      { label: '2 tot 3 weken', next: 'context_progress' },
      { label: 'Langer dan 3 weken', next: 'context_progress' },
    ],
  },
  {
    id: 'context_progress',
    next: 'context_tried_category',
    type: 'single',
    text: 'Hoe was het verloop van je klacht?',
    options: [
      {
        label: 'Het is erger geworden',
        icons: [{ src: 'arrow-down.svg', alt: '' }],
        next: 'context_tried_category',
      },
      {
        label: 'Het is verbeterd',
        icons: [{ src: 'arrow-up.svg', alt: '' }],
        next: 'context_tried_category',
      },
      {
        label: 'Het blijft ongeveer hetzelfde',
        icons: [{ src: 'even.svg', alt: '' }],
        next: 'context_tried_category',
      },
      {
        label: 'Het gaat op en neer',
        icons: [{ src: 'unstable.svg', alt: '' }],
        next: 'context_tried_category',
      },
    ],
  },
  {
    id: 'context_tried_category',
    next: 'triage_feeling',
    type: 'single',
    text: 'Wat heb je al geprobeerd om dit te verhelpen?',
    options: [
      {
        label: 'Niets',
        next: 'triage_feeling',
      },

      {
        label: 'Medicatie',
        icons: [{ src: 'pill.svg', alt: '' }],
        next: 'context_tried_medicine',
      },

      {
        label: 'Huisremedies',
        icons: [{ src: 'tea.svg', alt: '' }],
        next: 'context_tried_home',
      },
      {
        label: 'Zelfmedicatie en huisremedies',
        icons: [
          { src: 'tea.svg', alt: '' },
          { src: 'pill.svg', alt: '' },
        ],
        next: 'context_tried_medicine_home',
      },
    ],
  },
  {
    id: 'context_tried_home',
    next: 'triage_feeling',
    type: 'multiple',
    text: 'Welke huisremedies heb je al geprobeerd om dit te verhelpen?',
    options: [
      {
        label: 'Hoestdrank of tabletten',
        icons: {
          default: 'checkbox-empty.svg',
          selected: 'checkbox-checked.svg',
          alt: 'checkbox',
        },
        next: 'triage_feeling',
      },

      {
        label: 'Thee of water drinken',
        icons: {
          default: 'checkbox-empty.svg',
          selected: 'checkbox-checked.svg',
          alt: 'checkbox',
        },
        next: 'triage_feeling',
      },

      {
        label: 'Zuigsnoep',
        icons: {
          default: 'checkbox-empty.svg',
          selected: 'checkbox-checked.svg',
          alt: 'checkbox',
        },
        next: 'triage_feeling',
      },
    ],
    continue: {
      label: 'Verder',
      icons: [{ src: 'forward-arrow-black.svg', alt: '' }],
    },
  },
  {
    id: 'context_tried_medicine',
    next: 'triage_feeling',
    type: 'multiple',
    text: 'Welke medicatie heb je geprobeerd om dit te verhelpen?',
    options: [
      {
        label: 'Pijnstillers zoals paracetamol of codeïne',
        icons: {
          default: 'checkbox-empty.svg',
          selected: 'checkbox-checked.svg',
          alt: 'checkbox',
        },
        next: 'triage_feeling',
      },

      {
        label: 'Andere voorgeschreven medicijnen',
        icons: {
          default: 'checkbox-empty.svg',
          selected: 'checkbox-checked.svg',
          alt: 'checkbox',
        },
        next: 'triage_feeling',
      },
    ],
    continue: {
      label: 'Verder',
      icons: [{ src: 'forward-arrow-black.svg', alt: '' }],
    },
  },
  {
    id: 'context_tried_medicine_home',
    next: 'triage_feeling',
    type: 'multiple',
    text: 'Welke medicatie heb je geprobeerd om dit te verhelpen?',
    options: [
      {
        label: 'Pijnstillers zoals paracetamol of codeïne',
        icons: {
          default: 'checkbox-empty.svg',
          selected: 'checkbox-checked.svg',
          alt: 'checkbox',
        },
        next: 'triage_feeling',
      },

      {
        label: 'Andere voorgeschreven medicijnen',
        icons: {
          default: 'checkbox-empty.svg',
          selected: 'checkbox-checked.svg',
          alt: 'checkbox',
        },
        next: 'triage_feeling',
      },
      {
        label: 'Hoestdrank of tabletten',
        icons: {
          default: 'checkbox-empty.svg',
          selected: 'checkbox-checked.svg',
          alt: 'checkbox',
        },
        next: 'triage_feeling',
      },

      {
        label: 'Thee of water drinken',
        icons: {
          default: 'checkbox-empty.svg',
          selected: 'checkbox-checked.svg',
          alt: 'checkbox',
        },
        next: 'triage_feeling',
      },

      {
        label: 'Zuigsnoep',
        icons: {
          default: 'checkbox-empty.svg',
          selected: 'checkbox-checked.svg',
          alt: 'checkbox',
        },
        next: 'triage_feeling',
      },
    ],
    continue: {
      label: 'Verder',
      icons: [{ src: 'forward-arrow-black.svg', alt: '' }],
    },
  },
  {
    id: 'triage_feeling',
    next: 'triage_immunity',
    type: 'single',
    text: 'Hoe voel je je?',
    options: [
      {
        label: 'Goed',
        icons: [{ src: 'good.svg', alt: '' }],
        next: 'triage_immunity',
      },
      {
        label: 'Neutraal',
        icons: [{ src: 'neutral.svg', alt: '' }],
        next: 'triage_immunity',
      },
      {
        label: 'Ziek',
        icons: [{ src: 'sick.svg', alt: '' }],
        next: 'triage_immunity',
      },
      {
        label: 'Heel ziek',
        icons: [{ src: 'very-sick.svg', alt: '' }],
        next: 'triage_immunity',
      },
      {
        label: 'Ernstig ziek (versnelde ademhaling, sufheid)',
        icons: [{ src: 'extreme-ill.svg', alt: '' }],
        next: 'triage_immunity',
      },
    ],
  },
  {
    id: 'triage_immunity',
    next: 'triage_wheeze',
    type: 'single',
    text: 'Heb je een verminderde weerstand door een van de volgende oorzaken?',
    options: [
      {
        label: 'Ja, door medicatie of behandeling',
        next: 'triage_wheeze',
      },
      {
        label: 'Ja, door leeftijd',
        next: 'triage_wheeze',
      },
      {
        label: 'Ja, door zwangerschap',
        next: 'triage_wheeze',
      },
      {
        label: 'Ja, door chronische ziekte',
        next: 'triage_wheeze',
      },
      {
        label: 'Nee',
        next: 'triage_wheeze',
      },
    ],
  },
  {
    id: 'triage_wheeze',
    next: 'triage_blood',
    type: 'single',
    text: 'Heb je piepende ademhaling?',
    options: [
      {
        label: 'Ja, vooral bij inademen',
        next: 'triage_blood',
      },
      {
        label: 'Ja, vooral bij uitademen',
        next: 'triage_blood',
      },
      {
        label: 'Nee',
        next: 'triage_blood',
      },
    ],
  },
  {
    id: 'triage_blood',
    next: 'end_photo_comment',
    type: 'single',
    text: 'Geef je bloed op bij het hoesten?',
    options: [
      {
        label: 'Ja, enkele druppels',
        next: 'end_photo_comment',
      },
      {
        label: 'Ja, matig (slijm met overduidelijk bloed)',
        next: 'end_photo_comment',
      },
      {
        label: 'Ja, veel (puur bloed)',
        next: 'end_photo_comment',
      },
      {
        label: 'Nee',
        next: 'end_photo_comment',
      },
    ],
  },
  {
    id: 'end_photo_comment',
    type: 'single',
    text: 'Bedankt! Dit was de laatste vraag. Als je voor je huisarts een foto of een opmerking wilt achterlaten, is dit de kans. Deze stap en het uploaden van foto is niet verplicht*',
    options: [
      { label: 'Kies een foto', icon: 'forward-arrow.svg' },
      { label: 'Opmerking schrijven', icon: 'forward-arrow.svg' },
      {
        label: 'Verder',
        icon: 'forward-arrow.svg',
        alt: '',
        variant: 'main',
      },
    ],
  },
];

function openUploadPopup() {
  uploadOverlay.classList.remove('is-hidden');
  uploadOverlay.setAttribute('aria-modal', 'true');
  uploadOverlay.querySelector('button')?.focus();
}
function closeUploadPopup() {
  uploadOverlay.classList.add('is-hidden');
  uploadOverlay.removeAttribute('aria-modal');
  document.activeElement?.blur();
}

function addImageMessage(src) {
  const box = document.createElement('section');
  box.classList.add('message-box', 'container-outbox');

  const message = document.createElement('section');
  message.classList.add('message-outbox');

  message.innerHTML = `
     <section class="user-picture-message">
      <img class="user-picture-chat" src="${src}" alt="uploaded image">
      <button class="button" data-action="delete-image">
        <img src="src/trash.svg" alt="verwijderen">
      </button>
    </section>`;

  box.appendChild(message);
  chatContainer.appendChild(box);

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

//picture preview & upload
uploadOverlay.addEventListener('click', (e) => {
  const action = e.target.closest('[data-action]')?.dataset.action;

  if (!action) return;

  if (action === 'close-upload') {
    closeUploadPopup();
  }

  if (action === 'send-upload') {
    addImageMessage('src/neck.png');

    //save in data
    answersHistory.push({
      questionIndex: currentQuestionIndex,
      answer: 'Foto geüpload',
    });

    closeUploadPopup();
  }
});

//removing chat picture
chatContainer.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('[data-action="delete-image"]');
  if (!deleteBtn) return;

  const messageBox = deleteBtn.closest('.message-box');
  if (!messageBox) return;

  //removing from DOM
  messageBox.remove();

  //removing from history
  const imgIndex = answersHistory.findIndex(
    (item) => item.answer === 'Foto geüpload'
  );
  if (imgIndex !== -1) {
    answersHistory.splice(imgIndex, 1);
  }
});

function openConfirmationPopup() {
  confirmationOverlay.classList.remove('is-hidden');
  confirmationOverlay.setAttribute('aria-modal', 'true');
  confirmationOverlay.querySelector('button')?.focus();
}

function closeConfirmationPopup() {
  confirmationOverlay.classList.add('is-hidden');
  confirmationOverlay.removeAttribute('aria-modal');
  document.activeElement?.blur();
  //set screen start
  setScreen('welcome');
  chatContainer.innerHTML = '';
  answersHistory.length = 0; //delete history
  currentQuestionIndex = 0;
}

//confitmation pop-up
confirmationOverlay.addEventListener('click', (e) => {
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (!action) return;

  if (action === 'close-confirmation' || action === 'confirm-and-restart') {
    closeConfirmationPopup();
  }
});

endBtn.addEventListener('click', () => {
  openConfirmationPopup();
});

let currentQuestionIndex = 0;

function findQuestionIndexById(id) {
  return questions.findIndex((q) => q.id === id);
}

//skip question
skipBtn.addEventListener('click', () => {
  goToNextQuestion(null);
});

//hide nav in the first question
function updateNavigationVisibility() {
  const nav = document.querySelector('.nav-bottom');

  if (currentQuestionIndex === 0) {
    nav.classList.add('is-hidden');
  } else {
    nav.classList.remove('is-hidden');
  }
}

//render questions and options
function renderQuestion(index) {
  const question = questions[index];
  if (!question) return;

  addMessage(question.text, 'inbox');
  chatOptions.innerHTML = '';

  updateNavigationVisibility();

  if (question.type === 'single') {
    renderSingleOptions(question.options);
  }

  if (question.type === 'multiple') {
    renderMultipleOptions(
      question.options,
      question.continue || { label: question.continueLabel }
    );
  }
}

function handleFreeInput(text) {
  const currentQuestion = questions[currentQuestionIndex];

  if (currentQuestion.next) {
    goToNextQuestion(text, currentQuestion.next);
  } else {
    answersHistory.push({
      questionIndex: currentQuestionIndex,
      answer: text,
    });

    addMessage(text, 'outbox');
  }
}

//next question
function goToNextQuestion(answerText = null, nextId = null) {
  //save answer
  answersHistory.push({
    questionIndex: currentQuestionIndex,
    answer: answerText,
  });

  if (answerText) addMessage(answerText, 'outbox');

  //next question check
  if (nextId) {
    currentQuestionIndex = findQuestionIndexById(nextId);
  } else {
    currentQuestionIndex++;
  }

  if (currentQuestionIndex < questions.length) {
    renderQuestion(currentQuestionIndex);
  } else {
    setScreen('end');
  }
}

//render single options
function renderSingleOptions(options) {
  options.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'button button-cta';

    if (option.variant === 'main') {
      button.classList.add('button-main');
    }

    // icons?
    if (option.icons && Array.isArray(option.icons)) {
      option.icons.forEach((iconObj) => {
        const img = document.createElement('img');
        img.className = 'svg-filterable';
        img.src = `src/${iconObj.src}`;
        img.alt = iconObj.alt || '';
        button.appendChild(img);
      });
    }
    // text
    const text = document.createElement('p');
    text.textContent = option.label;
    button.appendChild(text);

    // click
    button.addEventListener('click', () => {
      if (
        option.label === 'Zelf invullen' ||
        option.label === 'Opmerking schrijven'
      ) {
        activateTextInput();
        return;
      }
      if (option.label === 'Kies een foto') {
        openUploadPopup();
        return;
      }

      goToNextQuestion(option.label, option.next);
    });

    chatOptions.appendChild(button);
  });
}

function handleSingleAnswer(answer) {
  goToNextQuestion(answer);
}

//render multiple choice answers
function renderMultipleOptions(options, continueConfig) {
  chatOptions.innerHTML = '';
  const selected = new Set();

  const continueBtn = document.createElement('button');
  continueBtn.className = 'button button--primary button-cta continue-button';
  const label = continueConfig?.label || 'Keuze bevestigen';
  const icon = continueConfig?.icon;

  continueBtn.innerHTML = '';

  const text = document.createElement('p');
  text.textContent = label;
  continueBtn.appendChild(text);

  if (continueConfig?.icons && Array.isArray(continueConfig.icons)) {
    continueConfig.icons.forEach((iconObj) => {
      const img = document.createElement('img');
      img.src = `src/${iconObj.src}`;
      img.alt = iconObj.alt || '';
      continueBtn.appendChild(img);
    });
  }

  continueBtn.disabled = true; // default state
  continueBtn.addEventListener('click', () => {
    if (selected.size === 0) return;
    const currentQuestion = questions[currentQuestionIndex];
    goToNextQuestion([...selected].join(', '), currentQuestion.next);
  });

  options.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'button button--checkbox button-cta';

    //icon
    let iconSrc = 'src/checkbox-empty.svg';
    if (option.icons?.default) iconSrc = `src/${option.icons.default}`;
    if (option.icon) iconSrc = `src/${option.icon}`;

    const icon = document.createElement('img');
    icon.src = iconSrc;
    icon.alt = option.icons?.alt || '';
    icon.classList.add('icon');
    button.appendChild(icon);

    //text
    const text = document.createElement('p');
    text.textContent = option.label;
    button.appendChild(text);

    //click
    button.addEventListener('click', () => {
      const isSelected = selected.has(option.label);

      if (isSelected) {
        selected.delete(option.label);
        button.classList.remove('is-selected');
        if (option.icons?.default) {
          icon.src = `src/${option.icons.default}`;
        } else if (option.icon) {
          icon.src = `src/${option.icon}`;
        } else {
          icon.src = 'src/checkbox-empty.svg';
        }
      } else {
        selected.add(option.label);
        button.classList.add('is-selected');
        if (option.icons?.selected) {
          icon.src = `src/${option.icons.selected}`;
        }
      }

      // continue button state update
      continueBtn.disabled = selected.size === 0;
    });

    chatOptions.appendChild(button);
  });

  chatOptions.appendChild(continueBtn);
}

//setting screen
function setScreen(screenName) {
  screens.forEach((s) => s.classList.remove('is-active'));
  document
    .querySelector(`[data-screen="${screenName}"]`)
    ?.classList.add('is-active');

  toggleHeaderBottom(screenName);

  //accessibility focus
  if (screenName === 'chat') {
    document.getElementById('chatContent')?.focus();
  }
}

//set header
function toggleHeaderBottom(screenName) {
  const mainBottom = document.querySelector('.header-bottom--main');
  const chatBottom = document.querySelector('.header-bottom--chat');

  if (screenName === 'chat') {
    mainBottom.style.display = 'none';
    mainBottom.setAttribute('aria-hidden', 'true');
    chatBottom.style.display = 'flex';
    chatBottom.removeAttribute('aria-hidden');
  } else {
    mainBottom.style.display = 'flex';
    mainBottom.removeAttribute('aria-hidden');
    chatBottom.style.display = 'none';
    chatBottom.setAttribute('aria-hidden', 'true');
  }
}

//start chat
startBtn.addEventListener('click', () => {
  setScreen('chat');
  renderQuestion(currentQuestionIndex);
});

//add message into chat
// function addMessage(text, type = 'inbox') {
//   const box = document.createElement('section');
//   box.classList.add(
//     'message-box',
//     type === 'inbox' ? 'container-inbox' : 'container-outbox'
//   );

//   const message = document.createElement('section');
//   message.classList.add(type === 'inbox' ? 'message-inbox' : 'message-outbox');
//   message.innerHTML = `<p>${text}</p>`;

//   box.appendChild(message);
//   chatContainer.appendChild(box);

//   // auto scroll
//   chatContainer.scrollTop = chatContainer.scrollHeight;
//   requestAnimationFrame(() => {
//     chatContainer.scrollTop = chatContainer.scrollHeight;
//   });
// }
//
//

function addMessage(text, type = 'inbox') {
  const box = document.createElement('section');
  box.classList.add(
    'message-box',
    type === 'inbox' ? 'container-inbox' : 'container-outbox'
  );

  const message = document.createElement('section');
  message.classList.add(type === 'inbox' ? 'message-inbox' : 'message-outbox');

  //message text
  message.innerHTML = `<p>${text}</p>`;

  //only for inbox messages
  if (type === 'inbox') {
    const helpBtn = document.createElement('button');
    helpBtn.className = 'button, help-btn';
    helpBtn.setAttribute('aria-label', 'Extra uitleg over deze vraag');
    helpBtn.innerHTML = `<img src="src/question.svg" alt="">`;

    message.appendChild(helpBtn);
  }

  box.appendChild(message);
  chatContainer.appendChild(box);

  //scroll to the last message
  chatContainer.scrollTop = chatContainer.scrollHeight;
  requestAnimationFrame(() => {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  });
}

//sending a message
sendBtn.addEventListener('click', () => {
  const value = input.value.trim();
  if (!value) return;

  input.value = '';
  handleFreeInput(value);
});

//previous question
backBtn.addEventListener('click', () => {
  if (answersHistory.length === 0) return;

  //removing last answer
  answersHistory.pop();

  //going back
  currentQuestionIndex = Math.max(0, currentQuestionIndex - 1);

  //clearing the chat
  chatContainer.innerHTML = '';

  //re-rendering answers
  answersHistory.forEach((item) => {
    addMessage(questions[item.questionIndex].text, 'inbox');
    if (item.answer) {
      addMessage(item.answer, 'outbox');
    }
  });

  renderQuestion(currentQuestionIndex);
});

//activate text input
function activateTextInput() {
  const input = document.getElementById('chatInput');
  const container = document.getElementById('chatInputContainer');

  container.classList.add('is-focussed');

  //timeout for mobiles (browser)
  setTimeout(() => {
    input.focus();
  }, 50);
}

input.addEventListener('blur', () => {
  inputContainer.classList.remove('is-focussed');
});

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();

    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    handleFreeInput(text);
  }
});

// === INIT ===
setScreen('welcome');
