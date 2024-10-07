const state = {
  score: {
    playerScore: 0,
    cpuScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    cpu: document.getElementById("cpu-field-card"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

const playerSides = {
  player1: "player-cards",
  player2: "cpu-cards",
};

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: "./src/assets/icons/dragon.png",
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: "./src/assets/icons/magician.png",
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: "./src/assets/icons/exodia.png",
    winOf: [0],
    loseOf: [1],
  },
];

async function getRandomCard() {
  const randomCard = cardData[Math.floor(Math.random() * cardData.length)];
  return randomCard;
}

async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", idCard.id);
  cardImage.classList.add("card");

  if (fieldSide === playerSides.player1) {
    cardImage.addEventListener("click", () => {
      setCardField(cardImage.getAttribute("data-id"));
    });

    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(idCard);
    });
  }

  return cardImage;
}

async function setCardField(cardId) {
  await removeAllCardsImages();
  let cpuCardId = await getRandomCard();
  state.fieldCards.player.style.display = "block";
  state.fieldCards.cpu.style.display = "block";
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.cpu.src = cpuCardId.img;

  let duelResult = await checkDuelResult(cardId, cpuCardId);

  await updateScore();
  await drawButton(duelResult);
}

async function removeAllCardsImages() {
  let cards = document.querySelector(".card-box.framed#cpu-cards");

  let imgElements = cards.querySelectorAll("img");

  imgElements.forEach((card) => {
    card.remove();
  });

  cards = document.querySelector(".card-box.framed#player-cards");

  imgElements = cards.querySelectorAll("img");

  imgElements.forEach((card) => {
    card.remove();
  });
}

async function showHiddenCardFieldsImages(value) {
  if (value === true) {
    state.fieldCards.player.style.display = "block";
    state.fieldCards.cpu.style.display = "block";
  }

  if (value === false) {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.cpu.style.display = "none";
  }
}

async function checkDuelResult(cardId, cpuCardId) {
  let duelResult = "draw";
  let playerCard = cardData[cardId];

  if (playerCard.winOf.includes(cpuCardId.id)) {
    state.score.playerScore++;
    duelResult = "win";
  } else if (playerCard.loseOf.includes(cpuCardId.id)) {
    duelResult = "lose";
    state.score.cpuScore++;
  } else {
    return duelResult;
  }

  playAudio(duelResult);
  return duelResult;
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.cpuScore}`;
}

async function drawButton(duelResult) {
  state.actions.button.innerHTML = duelResult;
  state.actions.button.style.display = "block";
}

async function drawSelectedCard(card) {
  state.cardSprites.avatar.src = card.img;
  state.cardSprites.name.innerHTML = card.name;
  state.cardSprites.type.innerHTML = "Atribute : " + card.type;
}

async function drawCards(numberOfCards, fieldSide) {
  for (let i = 0; i < numberOfCards; i++) {
    const randomIdCard = await getRandomCard();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.cpu.style.display = "none";
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
  state.actions.button.style.display = "none";

  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
}

async function init() {
  await showHiddenCardFieldsImages(true);

  drawCards(5, playerSides.player1);
  drawCards(5, playerSides.player2);

  const bgm = document.getElementById("bgm");
  bgm.play();
}

init();
