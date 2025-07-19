# z3r-patch

## About
z3r-patch is a lightweight JavaScript module for patching randomizer seeds generated on alttpr.com.

**Note:** z3r-patch is NOT approved for use in official races at this time. This may be subject to change in the future.

## Installation
You can install z3r-patch in your Node.js project with the following command:
```bash
npm install z3r-patch
```
If you are using Deno, you can import the module in your source code:
```js
import patch from "npm:z3r-patch";
```

## Usage
To use z3r-patch in your project, use ES6 import syntax. You cannot import z3r-patch with `require`.
```js
import patch from "z3r-patch"; // OK!
const { default: patch } = await import("z3r-patch"); // OK!
const patch = require("z3r-patch"); // WRONG!
```

After generating your seed on alttpr.com, you can apply it to your legally obtained JP 1.0 ALTTP ROM:
```js
import * as fs from "node:fs/promises";
import patch from "z3r-patch";

// Generate seed with open 7/7 settings:
const seed = await fetch("https://alttpr.com/api/randomizer", {
    method: "post",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        accessibility: "items",
        crystals: {
            ganon: "7",
            tower: "7"
        },
        dungeon_items: "standard",
        enemizer: {
            boss_shuffle: "none",
            enemy_damage: "default",
            enemy_health: "default",
            enemy_shuffle: "none"
        },
        entrances: "none",
        glitches: "none",
        goal: "ganon",
        hints: "off",
        item: {
            functionality: "normal",
            pool: "normal"
        },
        item_placement: "advanced",
        lang: "en",
        mode: "open",
        spoilers: "on",
        tournament: false,
        weapons: "randomized"
    })
}).then(res => res.json());

// Fetch a custom sprite's .zspr file:
const angel = await fetch("https://alttpr-assets.s3.us-east-2.amazonaws.com/angel.1.zspr")
    .then(res => res.arrayBuffer());

// Apply the seed patches and post-generation options:
const rom = await patch(pathToJp10Rom, seed, {
    heartColor: "blue",
    heartSpeed: "half",
    quickswap: true,
    reduceFlash: true,
    sfxShuffle: true,
    sprite: angel
});

// Write the patched ROM to a new file:
await fs.writeFile(`./${seed.hash}.sfc`, rom);
```

z3r-patch supports the following post-generation settings:
* Changing your heart color
* Changing the heart beep speed
* Item quickswap
* Toggling background music
* Toggling MSU-1 resume
* Toggling reduced flashing
* Changing your sprite, including using custom sprites
* Extended palette shuffling options
* Changing your menu speed **(NOT RACE LEGAL)**
* Randomizing sound effects **(NOT RACE LEGAL)**

### API
```ts
export default function(base: string, seed: VTSeed, options: PatchOptions): Promise<Uint8Array>;

interface VTSeed {
    generated: string;
    hash: string;
    logic: string;
    patch: Record<number, number[]>[];
    size: number;
    spoiler: object;
    current_rom_hash?: string;
}

interface PatchOptions {
    heartSpeed?: "off" | "quarter" | "half" | "normal" | "double";
    heartColor?: "red" | "blue" | "green" | "yellow";
    menuSpeed?: "slow" | "normal" | "fast" | "instant";
    quickswap?: boolean;
    backgroundMusic?: boolean;
    msu1Resume?: boolean;
    reduceFlash?: boolean;
    paletteShuffle?: boolean | PaletteMode | PaletteRandomizerOptions<SeedValue>;
    sfxShuffle?: boolean;
    sprite?: ArrayBuffer;
}

/* From @maseya/z3pr-js:1.0.2 */
interface PaletteRandomizerOptions<T extends SeedValue> {
    mode?: PaletteMode
    randomize_overworld?: boolean
    randomize_dungeon?: boolean
    randomize_link_sprite?: boolean
    randomize_sword?: boolean
    randomize_shield?: boolean
    randomize_hud?: boolean
    seed?: T
}

type SeedValue = number | [number, number] | [number, number, number];
type PaletteMode = "none" | "maseya" | "grayscale" | "negative" | "blackout" | "classic" | "dizzy" | "sick" | "puke";
```