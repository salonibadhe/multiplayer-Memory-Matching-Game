const THEMES = {
  animals: ['🐶', '🐱', '🦁', '🐼', '🐨', '🦊', '🐸', '🐵'],
  fruits: ['🍎', '🍌', '🍇', '🍉', '🍒', '🍍', '🥝', '🍑'],
  marvel: ['🛡️', '🕷️', '🔨', '💎', '🦾', '🧤', '🕶️', '⚡'],
  emojis: ['😀', '😎', '🤖', '👻', '🔥', '🌈', '🎮', '🚀'],
  anime: ['⚔️', '🍥', '🌀', '📓', '👒', '🐉', '🧪', '🦿']
};

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export const createDeck = (theme = 'emojis') => {
  const base = THEMES[theme] || THEMES.emojis;
  return shuffle(base.concat(base)).map((symbol, i) => ({ id: i, symbol, matched: false }));
};

export const buildInitialState = (room) => ({
  roomCode: room.code,
  mode: room.mode,
  theme: room.theme,
  deck: createDeck(room.theme),
  flipped: [],
  turnIndex: 0,
  turnTimeLeft: 20,
  totalTimeLeft: room.mode === 'time' ? 180 : null,
  players: room.players.map((p) => ({ username: p.username, score: 0, isBot: p.isBot })),
  status: 'active',
  chat: [],
  reactions: []
});

export const nextTurn = (state) => {
  state.flipped = [];
  state.turnTimeLeft = 20;
  state.turnIndex = (state.turnIndex + 1) % state.players.length;
};

export const scoreDelta = (mode, isMatch) => {
  if (isMatch) return 10;
  if (mode === 'survival') return -3;
  return 0;
};

export const isFinished = (state) =>
  state.deck.every((card) => card.matched) || (state.mode === 'time' && state.totalTimeLeft <= 0);
