export default class ActionVew {
  public static render() {
    return `
              <div className="flex items-center justify-around">
                  <div className="m-3 flex flex-col items-center justify-center">
                    <button
                      type="button"
                      aria-label="SURRENDER"
                      id="surrenderBtn"
                      className="h-[4.5rem] w-[4.5rem]  rounded-full bg-red-600 text-lg font-semibold text-white hover:bg-blue-500 hover:opacity-60"
                    />
                    <p className="pt-2 text-center font-bold">SURRENDER</p>
                  </div>
                  <div className="m-3 flex flex-col items-center justify-center">
                    <button
                      type="button"
                      aria-label="STAND"
                      id="standBtn"
                      className="h-[4.5rem] w-[4.5rem]  rounded-full bg-green-700 text-lg font-semibold text-white hover:bg-green-200 hover:opacity-60"
                    />
                    <p className="pt-2 text-center font-bold">STAND</p>
                  </div>
                  <div className="m-3 flex flex-col items-center justify-center">
                    <button
                      type="button"
                      aria-label="HIT"
                      id="hitBtn"
                      className="h-[4.5rem] w-[4.5rem]  rounded-full bg-yellow-300 text-lg font-semibold text-white hover:bg-yellow-400 hover:opacity-60"
                    />
                    <p className="pt-2 text-center font-bold">HIT</p>
                  </div>
                  <div className="m-3 flex flex-col items-center justify-center">
                    <button
                      type="button"
                      aria-label="DOUBLE"
                      id="doubleBtn"
                      className="h-[4.5rem] w-[4.5rem]  rounded-full bg-blue-500 text-lg font-semibold text-white hover:bg-blue-400 hover:opacity-60"
                    />
                    <p className="pt-2 text-center font-bold">DOUBLE</p>
                  </div>
                </div>
          `
  }
}
