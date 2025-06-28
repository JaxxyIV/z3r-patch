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
To use z3r-patch in your project, use ES6 import syntax. You cannot import z3r-patch with `require`:
```js
import patch from "z3r-patch"; // OK!
const { default: patch } = await import("z3r-patch"); // OK!
const patch = require("z3r-patch"); // WRONG!
```

After generating your seed on alttpr.com, you can apply it to your legally obtained JP 1.0 ALTTP ROM:
```js
import * as fs from "node:fs/promises";
import patchZ3R from "z3r-patch";

const angelUrl = "https://alttpr-assets.s3.us-east-2.amazonaws.com/angel.1.zspr";

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
const angel = await fetch(angelUrl)
    .then(res => res.arrayBuffer());

// Apply the seed patches and post-generation options:
const rom = await patchZ3R(pathToJp10Rom, seed, {
    heartColor: "blue",
    heartSpeed: "half",
    quickswap: true,
    reduceFlash: true,
    sprite: angel
});

// Write the patched ROM to a new file:
await fs.writeFile(`./${seed.hash}.sfc`, rom);
```

### API
```ts
export default function(base: string, seed: SeedAPIData, options: PatchOptions): Promise<Uint8Array>;

interface SeedAPIData {
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
    sprite?: ArrayBuffer;
}
```