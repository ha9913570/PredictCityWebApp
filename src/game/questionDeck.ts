export interface QuestionDeck<T> {
  remaining: T[]
  previous: T | undefined
  candidates: readonly T[]
}

/** ランダムな順番の山札を作成する */
export function createQuestionDeck<T>(candidates: readonly T[]): QuestionDeck<T> {
  return {
    remaining: shuffle(candidates),
    previous: undefined,
    candidates,
  }
}

/** 山札から1件引き、全候補を出し終えたら再シャッフルして続ける。 */
export function drawQuestion<T>(deck: QuestionDeck<T>): T {
  if (deck.remaining.length === 0) {
    deck.remaining = shuffle(deck.candidates)

    if (deck.remaining.length > 1 && deck.remaining[0] === deck.previous) {
      const differentQuestionIndex = deck.remaining.findIndex(
        (candidate) => candidate !== deck.previous,
      )
      ;[deck.remaining[0], deck.remaining[differentQuestionIndex]] = [
        deck.remaining[differentQuestionIndex],
        deck.remaining[0],
      ]
    }
  }

  const question = deck.remaining.shift()

  if (question === undefined) {
    throw new Error('出題候補がありません。')
  }

  deck.previous = question
  return question
}

/** 候補を変更せずにランダムな順序の配列を返す。 */
function shuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }

  return shuffled
}
