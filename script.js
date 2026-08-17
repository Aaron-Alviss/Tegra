/*
  script.js
  Jeu interactif romantique pour Tegra
  - Gère les écrans (intro, questions, final)
  - Contrôle la progression, les réactions personnalisées
  - Affiche des particules en forme de petits cœurs
  - Supporte activation/désactivation du son

  Commenté pour qu'un débutant comprenne.
*/

// ----- Configuration: questions, choix et réactions -----
const QUESTIONS = [
  {
    id: 'q1',
    text: 'Tu penses qu’on finira notre vie ensemble ? ❤️',
    choices: [
      { id: 'q1_yes', label: '❤️ Oui', type: 'romantic', react: 'Cette réponse me fait tellement plaisir… ❤️' },
      { id: 'q1_no', label: '🤍 Non', type: 'witty', react: null, follow: [
        { id: 'r1', label: 'Parce que tu ne me supporteras pas jusque-là 😂', react: 'Hmm… je vais devoir te convaincre alors 😏❤️' },
        { id: 'r2', label: 'Parce que tu penses qu’on est trop différents', react: 'D’accord… mais je n’abandonne pas aussi facilement 😂❤️' },
        { id: 'r3', label: 'Parce que tu as une autre raison…', react: null, isFreeText:true }
      ] }
    ]
  },

  {
    id: 'q2',
    text: 'Quel serait ton plan préféré avec moi ? ❤️',
    choices: [
      { id: 'q2_1', label: '🥰 Une soirée romantique', react: 'J’avoue… ce choix me plaît beaucoup 😌❤️' },
      { id: 'q2_2', label: '🍿 Regarder un film ensemble', react: 'Un bon film et toi à côté, parfait 😍' },
      { id: 'q2_3', label: '🍽️ Aller manger quelque part', react: 'Miam… je réserve déjà une table 😏❤️' },
      { id: 'q2_4', label: '🌅 Faire une sortie ensemble', react: 'Les promenades avec toi sont magiques ✨' },
      { id: 'q2_5', label: '🏠 Rester tranquillement à deux', react: 'Rien que nous deux, j’adore ❤️' },
      { id: 'q2_6', label: '✈️ Voyager ensemble', react: 'On part quand ? Je prépare la valise 🧳❤️' }
    ]
  },

  {
    id: 'q3',
    text: 'Quel est ton plus beau souvenir avec moi ?',
    choices: [
      { id: 'q3_1', label: 'Notre première rencontre', react: 'La première fois… je m’en souviens comme si c’était hier ❤️' },
      { id: 'q3_2', label: 'Notre première sortie', react: 'Cette sortie était magique 😭❤️' },
      { id: 'q3_3', label: 'Un moment où on a beaucoup rigolé', react: 'Toi + rire = meilleur souvenir 😂❤️' },
      { id: 'q3_4', label: 'Un moment difficile qu’on a réussi à traverser ensemble', react: 'Ça montre combien on est forts ensemble 💪❤️' },
      { id: 'q3_5', label: 'Un autre souvenir ❤️', react: 'Chaque souvenir avec toi est unique 😌❤️' }
    ]
  },

  {
    id: 'q4',
    text: 'Si on pouvait partir demain quelque part tous les deux, tu choisirais où ?',
    choices: [
      { id: 'q4_1', label: '🌊 La plage', react: 'Sable, mer et toi… parfait 🌊❤️' },
      { id: 'q4_2', label: '🏔️ La montagne', react: 'La montagne + toi = paix intérieure 🏔️❤️' },
      { id: 'q4_3', label: '🌍 Un autre pays', react: 'Découvrir le monde avec toi, oui ✈️❤️' },
      { id: 'q4_4', label: '🏙️ Une grande ville', react: 'Ambiance urbaine et toi à mes côtés ✨' },
      { id: 'q4_5', label: '🏡 Un endroit tranquille juste nous deux', react: 'Le calme et toi… le combo parfait ❤️' }
    ]
  },

  {
    id: 'q5',
    text: 'Quelle chose chez moi tu préfères ?',
    choices: [
      { id: 'q5_1', label: 'Mon caractère', react: 'Ton caractère me charme chaque jour 😌❤️' },
      { id: 'q5_2', label: 'Mon humour', react: 'Ton humour rend tout meilleur 😂❤️' },
      { id: 'q5_3', label: 'Ma façon de prendre soin de toi', react: 'Tu prends soin de moi, merci 😭❤️' },
      { id: 'q5_4', label: 'Mon sourire', react: 'Ton sourire est mon soleil ☀️❤️' },
      { id: 'q5_5', label: 'Ma façon de t’aimer', react: 'Ta façon d’aimer me touche profondément 😭❤️' },
      { id: 'q5_6', label: 'Autre ❤️', react: 'Chaque détail chez toi est précieux ❤️' }
    ]
  },

  /* Question mariage */
  {
    id: 'q6',
    text: 'Bon… maintenant une question un peu plus sérieuse…\nSi un jour on se mariait… 💍❤️\nTu voudrais quel genre de mariage ?',
    choices: [
      { id: 'q6_1', label: '💍 Un grand mariage', react: 'Un grand jour pour nous deux ✨' },
      { id: 'q6_2', label: '🌹 Un petit mariage romantique', react: 'Un petit moment intime, je fonds 😭❤️' },
      { id: 'q6_3', label: '🌴 Un mariage dans un endroit magnifique', react: 'Des souvenirs pour la vie dans un lieu magique 🌅' },
      { id: 'q6_4', label: '👨‍👩‍👧‍👦 Un mariage entouré de toute la famille', react: 'La famille autour de nous, chaleureux et beau ❤️' },
      { id: 'q6_5', label: '❤️ Peu importe le mariage, tant qu’on est ensemble', react: 'C’est la meilleure réponse 😭❤️' }
    ]
  },

  /* Questions additionnelles */
  {
    id: 'q7',
    text: 'Quelle chanson te fait penser à nous ?',
    choices: [
      { id: 'q7_1', label: 'Une chanson douce', react: 'Celle-là me donne la chair de poule quand je pense à toi ❤️' },
      { id: 'q7_2', label: 'Une chanson rythmée', react: 'Prête pour danser ? Je te tiens la main 😏❤️' },
      { id: 'q7_3', label: 'Une autre (écris le titre)', react: null, isFreeText:true }
    ]
  },

  {
    id: 'q8',
    text: 'Quel petit geste de ma part te rend la plus heureuse ?',
    choices: [
      { id: 'q8_1', label: 'Quand je te prépare un repas', react: 'Je ferai encore plus de petits plats pour toi 🍽️❤️' },
      { id: 'q8_2', label: 'Quand je t’écoute', react: 'Je promets d’être toujours là pour t’écouter 😌❤️' },
      { id: 'q8_3', label: 'Quand je te surprends', react: 'Les surprises pour toi sont mon hobby 😏❤️' },
      { id: 'q8_4', label: 'Autre', react: 'Chaque petit geste que je fais pour toi vient du cœur ❤️' }
    ]
  },

  {
    id: 'q9',
    text: 'Si tu devais me donner un surnom affectueux, ce serait lequel ?',
    choices: [
      { id: 'q9_1', label: 'Mon amour', react: 'Mon cœur ❤️' },
      { id: 'q9_2', label: 'Mon trésor', react: 'Je garde ce trésor précieusement 😭❤️' },
      { id: 'q9_3', label: 'Mon/ma partenaire', react: 'Toujours à tes côtés ❤️' },
      { id: 'q9_4', label: 'Autre', react: 'Ce surnom sera notre secret 🥰' }
    ]
  },

  {
    id: 'q10',
    text: 'Un dernier petit rêve à partager ensemble ?',
    choices: [
      { id: 'q10_1', label: 'Construire une maison', react: 'Une maison remplie d’amour, j’en rêve déjà 🏡❤️' },
      { id: 'q10_2', label: 'Avoir une routine douce', react: 'Les petites routines partagées sont précieuses 😌❤️' },
      { id: 'q10_3', label: 'Faire le tour du monde', react: 'Tous les pays avec toi, oui ✈️❤️' },
      { id: 'q10_4', label: 'Autre', react: 'Chaque rêve avec toi me suffit ❤️' }
    ]
  }
];

// Total questions affichées (on peut diluer en 10 étapes en ajoutant transitions)
const TOTAL_STEPS = 10;

// ----- État du jeu -----
let state = {
  step: 0, // index logique de la question (1-based pour l'affichage)
  answers: [],
  sound: true
};

// ----- Helpers DOM -----
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

// éléments clés
const intro = $('#intro');
const startBtn = $('#startBtn');
const game = $('#game');
const questionText = $('#questionText');
const choicesWrap = $('#choices');
const followUp = $('#followUp');
const final = $('#final');
const secret = $('#secret');
const surpriseBtn = $('#surpriseBtn');
const restartBtn = $('#restart');
const progressBar = $('#progressBar');
const currentLabel = $('#current');
const totalLabel = $('#total');
const soundToggle = $('#soundToggle');

totalLabel.textContent = TOTAL_STEPS;

// Empêche double clics rapides
let busy = false;

// ----- Sons (optionnels) -----
const SFX = {
  click: null,
  pop: null,
  romantic: null
};

function loadSounds(){
  try{
    SFX.click = new Audio('');
  }catch(e){/* silence si pas de son */}
}

// ----- Particules (coeurs) -----
function spawnHearts(count=20){
  const container = document.getElementById('particles');
  for(let i=0;i<count;i++){
    const h = document.createElement('div');
    h.className='heart';
    const size = 8 + Math.random()*18;
    h.style.width = `${size}px`;
    h.style.height = `${size}px`;
    h.style.left = `${Math.random()*100}%`;
    h.style.top = `${Math.random()*100}%`;
    h.style.opacity = 0.4 + Math.random()*0.8;
    container.appendChild(h);
    // animation montée
    const toY = -100 - Math.random()*200;
    h.animate([{transform:'translateY(0) rotate(0deg)',opacity:1},{transform:`translateY(${toY}px) rotate(${Math.random()*360}deg)`,opacity:0}],{duration:4000+Math.random()*6000,iterations:1,easing:'cubic-bezier(.2,.9,.2,1)'});
    setTimeout(()=>{h.remove()},6000+Math.random()*2000);
  }
}

// Spawn quelques coeurs en arrière-plan continuellement
setInterval(()=>spawnHearts(3),1200);

// ----- Navigation entre écrans -----
function showIntro(){
  intro.classList.add('active');
  game.classList.remove('active');
  final.classList.remove('active');
  secret.style.display='none';
}

function showGame(){
  intro.classList.remove('active');
  game.classList.add('active');
  final.classList.remove('active');
}

function showFinal(){
  intro.classList.remove('active');
  game.classList.remove('active');
  final.classList.add('active');
}

// ----- Progression -----
function updateProgress(){
  const step = state.step;
  currentLabel.textContent = Math.min(step, TOTAL_STEPS);
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  progressBar.style.width = pct + '%';
}

// ----- Rendu d'une question -----
function renderQuestion(index){
  // index: 0-based into QUESTIONS
  busy = false;
  const q = QUESTIONS[index];
  if(!q) return endGame();
  questionText.textContent = q.text;
  choicesWrap.innerHTML = '';
  followUp.textContent = '';

  q.choices.forEach(choice => {
    const b = document.createElement('button');
    b.className='choice fade-in';
    b.textContent = choice.label;
    b.dataset.choiceId = choice.id;
    b.addEventListener('click', async (e)=>{
      if(busy) return; busy = true;
      // play sfx
      handleChoice(q, choice, b);
    });
    choicesWrap.appendChild(b);
  });

  // animation d'entrée
  questionText.classList.add('fade-in');
}

async function handleChoice(q, choice, btn){
  // Disable further clicks briefly
  disableChoices(true);
  // Si le choix a un sous-ensemble (follow-up)
  if(choice.follow){
    // Affiche les options follow-up
    followUp.textContent = 'Alors dis-moi pourquoi…';
    choicesWrap.innerHTML = '';
    choice.follow.forEach(f => {
      if(f.isFreeText){
        // créer un champ texte pour réponse libre
        const container = document.createElement('div');
        container.style.display='flex';
        container.style.gap='8px';
        const input = document.createElement('input');
        input.type='text';
        input.placeholder = 'Écris ta raison ici...';
        input.className='choice';
        input.style.flex='1';
        input.addEventListener('keydown',(e)=>{
          if(e.key === 'Enter') submitFreeText();
        });
        const send = document.createElement('button');
        send.className='choice';
        send.textContent='Envoyer';
        send.style.flex='0 0 auto';
        send.addEventListener('click', submitFreeText);
        container.appendChild(input);
        container.appendChild(send);
        choicesWrap.appendChild(container);

        function submitFreeText(){
          const val = input.value.trim();
          if(!val) return; // ignore vide
          followUp.textContent = val;
          state.answers.push({q:q.id,choice:f.id, text: val});
          spawnHearts(12);
          setTimeout(()=>nextStep(),900);
        }
      } else {
        const b = document.createElement('button');
        b.className='choice fade-in';
        b.textContent = f.label;
        b.addEventListener('click',()=>{
          followUp.textContent = f.react;
          state.answers.push({q:q.id,choice:f.id});
          // animation romantique discrète
          spawnHearts(12);
          setTimeout(()=>nextStep(),900);
        });
        choicesWrap.appendChild(b);
      }
    });
    disableChoices(false);
    return;
  }

  // Si le choix possède react direct
  if(choice.react){
    followUp.textContent = choice.react;
    spawnHearts(18);
  }

  // Enregistrer réponse
  state.answers.push({q:q.id,choice:choice.id});

  // Transition vers la prochaine question
  setTimeout(()=>nextStep(),800);
}

function disableChoices(dis){
  $$('.choice').forEach(b=>b.disabled = dis);
}

// Passe à l'étape suivante
function nextStep(){
  state.step++;
  updateProgress();
  // mapping: map step to question index (simple)
  const qIndex = state.step - 1; // 0-based
  if(qIndex < QUESTIONS.length){
    renderQuestion(qIndex);
  } else if(state.step < TOTAL_STEPS){
    // étapes intermédiaires: on peut réafficher des messages ou petites activités
    // pour la simplicité, on réaffiche certaines questions ou petits compliments
    const idx = (qIndex) % QUESTIONS.length;
    renderQuestion(idx);
  } else {
    endGame();
  }
}

// Fin du jeu
function endGame(){
  showFinal();
  spawnHearts(60);
  // monter plein de petits coeurs depuis le bas
  const container = document.getElementById('particles');
  for(let i=0;i<40;i++) setTimeout(()=>spawnHearts(3), i*80);
}

// ----- Événements UI -----
startBtn.addEventListener('click', ()=>{
  if(busy) return; busy=true;
  // animation d'intro
  intro.classList.add('exiting');
  spawnHearts(30);
  setTimeout(()=>{
    intro.classList.remove('active');
    intro.classList.remove('exiting');
    showGame();
    state.step = 0;
    nextStep();
    busy=false;
  },800);
});

surpriseBtn.addEventListener('click', ()=>{
  secret.style.display='block';
  secret.classList.add('fade-in');
  spawnHearts(50);
});

restartBtn.addEventListener('click', ()=>{
  // reset
  state = {step:0,answers:[],sound:state.sound};
  secret.style.display='none';
  showIntro();
  updateProgress();
});

soundToggle.addEventListener('click', ()=>{
  state.sound = !state.sound;
  soundToggle.textContent = state.sound? '🔊':'🔇';
});

// Empêche refresh et comportements indésirables (toucher multiple)
document.addEventListener('touchstart',()=>{},false);

// ----- Initialisation -----
function init(){
  loadSounds();
  showIntro();
  updateProgress();
}

init();
