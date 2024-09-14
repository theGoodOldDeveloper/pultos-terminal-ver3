// keyboard.js

// Globális objektumot használunk a függvény exportálására
window.KeyboardModule = {
  keyboardTemplateRender: function () {
    return `
    <div class="vKeyboard-container d-flex row">

        <div class=" vKeyboard-letters " id="vKeyboard-letters ">
            <div class="row vKeyboardRow vKeyboard-offsetRow1 justify-content-center m-1">
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-Q" value="Q">Q</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-W" value="W">W</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-E" value="E">E</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-R" value="R">R</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-T" value="T">T</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-Z" value="Z">Z</button>

                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-U" value="U">U</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-I" value="I">I</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-O" value="O">O</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-P" value="P">P</button>
            </div>
            <div class="row vKeyboardRow vKeyboard-offsetRow2 justify-content-center">
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-A" value="A">A</button>

                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-S" value="S">S</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-D" value="D">D</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-F" value="F">F</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-G" value="G">G</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-H" value="H">H</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-J" value="J">J</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-K" value="K">K</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-L" value="L">L</button>

            </div>
            <div class="row vKeyboardRow vKeyboard-offsetRow3 justify-content-center">
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-Y" value="Y">Y</button>

                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-X" value="X">X</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-C" value="C">C</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-V" value="V">V</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-B" value="B">B</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-N" value="N">N</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-M" value="M">M</button>
                <span class="vKeyboard-spacer"></span>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-symbol m-1"
                    id="keyboard-tiret" value="-">-</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-symbol m-1"
                    id="keyboard-underscore" value="_">_</button>
                <button type="button col" class="btn-lg keyboard btn-primary vKeyboard-symbol m-1"
                    id="keyboard-@" value="@">@</button>
            </div>
            <div class="row vKeyboardRow justify-content-center">

                <button type="button col"
                    class="btn-lg keyboard btn-primary vKeyboard-symbol vKeyboard-space"
                    id="keyboard-space" value=".">
                    <span class="vKeyboard-space-character">┗━━━━━━━━━━━┛</span>
                </button>
                <button type="button col" class="btn-lg keyboard btn-danger vKeyboard-symbol ml-3"
                    id="keyboard-torol>" value="">⌫</button>
            </div>
        </div>

    </div>
    `;
  },
};
