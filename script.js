// SASS compilation
Sass.compile(`
  // Variables
  $background: #000000;
  $card-bg: #ffffff;
  $text-dark: #000000;
  $text-light: #ffffff;

  // Mixins
  @mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  // Welcome text styles
  .welcome-text {
    font-size: 2rem;
    font-weight: bold;
    color: transparent;
    -webkit-text-stroke: 1px $text-light;
    position: relative;
    text-align: center;

    @media (min-width: 640px) {
      font-size: 3rem;
    }

    @media (min-width: 1024px) {
      font-size: 4rem;
    }

    .filled {
      position: absolute;
      left: 0;
      top: 0;
      color: $text-light;
      overflow: hidden;
      white-space: nowrap;
      transition: width 0.5s ease-in-out;
    }
  }

  // Card container styles
  .card-container {
    @include flex-center;
    perspective: 1000px;
  }

  // Card styles
  .card {
    width: 280px;
    height: 350px;
    position: absolute;
    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    transform-style: preserve-3d;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    border-radius: 20px;
    overflow: hidden;
    background: $card-bg;

    @media (min-width: 640px) {
      width: 300px;
      height: 400px;
    }

    &.active {
      transform: translateY(-30px) scale(1.05);
      z-index: 10;
    }

    &:not(.active) {
      filter: brightness(0.7) contrast(1.2);
    }
  }

  // Card content styles
  .card-content {
    height: 100%;
    padding: 20px;
    @include flex-center;
    flex-direction: column;
    text-align: center;
    position: relative;
    overflow: hidden;
    color: $text-dark;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(0,0,0,0.05), rgba(0,0,0,0));
      z-index: 1;
    }

    h2 {
      position: relative;
      z-index: 2;
      padding: 10px 20px;
      background: rgba(0,0,0,0.1);
      border-radius: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .word-container {
      position: relative;
      z-index: 2;
      width: 90%;
      height: 60%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      align-content: center;
    }
  }

  // Word styles
  .word {
    position: relative;
    transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    color: $text-dark;
    font-size: 14px;
    opacity: 0;
    font-weight: 300;
    margin-right: 5px;
    margin-bottom: 5px;

    @media (min-width: 640px) {
      font-size: 16px;
    }

    &.active {
      opacity: 1;
    }
  }

  // Styles for fixed positioning
  .fixed-section {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #welcome-section {
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.8);
    transition: opacity 0.5s ease-in-out;
  }

  #cards-section {
    z-index: 5;
  }

  .scroll-container {
    height: 400vh;
  }
`, function(result) {
  document.getElementById('compiled-css').textContent = result.text;
});

// Global variables
const cards = document.querySelectorAll('.card');
let currentCard = 0;

const welcomeText = document.querySelector('.welcome-text');
const changingWord = document.getElementById('changing-word');
const filledChangingWord = document.getElementById('filled-changing-word');
const filledText = document.querySelector('.welcome-text .filled');
const words = ['Master', 'Crush', 'Friend', 'Recruiter', 'Basher'];
let currentWordIndex = 0;

const welcomeSection = document.getElementById('welcome-section');

// Updated variables for typewriter effect
const cardTitles = [
    { element: document.querySelector('#card-0 .card-content h2'), originalText: "About Me" },
    { element: document.querySelector('#card-1 .card-content h2'), originalText: "Work Experience" },
    { element: document.querySelector('#card-2 .card-content h2'), originalText: "Skills" }
];
const specialChars = "!@#$%^&*";
let currentTexts = cardTitles.map(({ originalText }) => originalText);
let isForward = cardTitles.map(() => true);
let charIndices = cardTitles.map(({ originalText }) => originalText.length);

// Functions
function createWordElements() {
  cards.forEach((card, cardIndex) => {
      const content = card.querySelector('p').textContent;
      const words = content.split(' ');
      const wordContainer = card.querySelector('.word-container');

      words.forEach((word, index) => {
          const wordElement = document.createElement('span');
          wordElement.textContent = word;
          wordElement.classList.add('word');
          wordContainer.appendChild(wordElement);
      });
  });
}

function animateWords(cardIndex) {
  const activeWords = cards[cardIndex].querySelectorAll('.word');
  activeWords.forEach((word, index) => {
      word.classList.add('active');
      word.style.transitionDelay = `${index * 50}ms`;
  });
}

function resetWords(cardIndex) {
  const words = cards[cardIndex].querySelectorAll('.word');
  words.forEach(word => {
      word.classList.remove('active');
      word.style.transitionDelay = '0ms';
  });
}

function updateCards(index) {
  cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
      const offset = (i - index) * 60;
      const tiltAngle = 25; // Tilt angle for cards
      card.style.transform = `
        translateX(${offset}px) 
        translateY(${i === index ? -30 : 0}px) 
        scale(${i === index ? 1.05 : 0.9}) 
        rotateY(${(i - index) * 5}deg)
        rotateZ(${(i - index) * tiltAngle}deg)`; // Apply tilt
      card.style.zIndex = i === index ? 10 : 9 - Math.abs(i - index);

      if (i === index) {
          animateWords(i);
      } else {
          resetWords(i);
      }
  });
}

function handleScroll() {
  const scrollPosition = window.scrollY;
  const viewportHeight = window.innerHeight;

  // Handle welcome text animation
  if (scrollPosition <= viewportHeight) {
      const progress = Math.min(scrollPosition / viewportHeight, 1);
      filledText.style.width = `${progress * 100}%`;

      const wordIndex = Math.floor(progress * words.length);
      if (wordIndex !== currentWordIndex) {
          currentWordIndex = wordIndex;
          changingWord.textContent = words[currentWordIndex];
          filledChangingWord.textContent = words[currentWordIndex];
      }

      welcomeSection.style.opacity = 1 - progress;
  } else {
      welcomeSection.style.opacity = 0;
  }

  // Handle card animation
  const newCard = Math.floor((scrollPosition - viewportHeight) / viewportHeight);

  if (newCard !== currentCard && newCard >= 0 && newCard < cards.length) {
      currentCard = newCard;
      updateCards(currentCard);
  }
}

// Updated function for enhanced typewriter effect
function typewriterEffect(index) {
    const { element, originalText } = cardTitles[index];
    const currentText = currentTexts[index];
    
    if (isForward[index]) {
        if (charIndices[index] > 0) {
            const replaceIndex = originalText.length - charIndices[index];
            const randomChar = specialChars[Math.floor(Math.random() * specialChars.length)];
            currentTexts[index] = currentText.substring(0, replaceIndex) + randomChar + currentText.substring(replaceIndex + 1);
            charIndices[index]--;
        } else {
            isForward[index] = false;
        }
    } else {
        if (charIndices[index] < originalText.length) {
            currentTexts[index] = originalText.substring(0, charIndices[index] + 1) + currentText.substring(charIndices[index] + 1);
            charIndices[index]++;
        } else {
            isForward[index] = true;
        }
    }
    
    element.textContent = currentTexts[index];
    
    const typingSpeed = Math.random() * 100 + 50; // Random speed between 50ms and 150ms
    setTimeout(() => typewriterEffect(index), typingSpeed);
}

// Event listeners
window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleScroll);

// Initialization
createWordElements();
updateCards(currentCard);

// Fix initial view
filledText.style.width = '0%';
welcomeSection.style.opacity = 1;

// Start typewriter effect for all card titles
cardTitles.forEach((_, index) => typewriterEffect(index));