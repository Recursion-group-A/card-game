import Card from '@/models/common/Card'

export default class CardView {
  public static render(card: Card): string {
    const rank: string = card.getRank()
    const suit: string | undefined = card.getSuit()

    return `
        <div className="relative mx-1 h-28  w-20 cursor-pointer rounded bg-white text-red-500">
            <div className="absolute flex items-center justify-center shadow-xl">
              <div className="absolute left-1 top-0 w-4 text-center">
                <p className="h-4 text-xl">${rank}</p>
                <p className="mt-1 h-4">${suit}</p>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-2xl">${rank}</p>
            </div>

            <div className="absolute bottom-0 right-1 w-4 rotate-180 text-center">
              <p className="h-4 text-xl">{card}</p>
              <p className="mt-1 h-4">${suit}</p>
            </div>
        </div>
        `
  }
}
