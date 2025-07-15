// Code mostly copied from aerinon

class SoundEffect {
    /** @type {number} */
    #set;
    /** @type {number} */
    #id;
    /** @type {number} */
    #addr;
    /** @type {number[]} */
    #chain;
    /** @type {boolean} */
    #accomp;
    /** @type {SoundTransfer} */
    #target = {
        set: undefined,
        id: undefined,
        chain: undefined,
    };

    /**
     * @param {number} set
     * @param {number} id
     * @param {number} addr
     * @param {number[]} chain
     * @param {boolean} accomp
     */
    constructor(set, id, addr, chain = [], accomp = false) {
        this.#set = set;
        this.#id = id;
        this.#addr = addr;
        this.#chain = chain;
        this.#accomp = accomp;
    }

    get set() { return this.#set; }
    get id() { return this.#id; }
    get address() { return this.#addr; }
    get chain() { return this.#chain; }
    get accomp() { return this.#accomp; }
    get target() { return this.#target; }

    /** @param {number} a */
    set addr(a) { this.#addr = a; }
}

const initSfxDefs = () => [
    new SoundEffect(0x02, 0x01, 0x2614),            // Slash1
    new SoundEffect(0x02, 0x02, 0x2625),            // Slash2
    new SoundEffect(0x02, 0x03, 0x2634),            // Slash3
    new SoundEffect(0x02, 0x04, 0x2643),            // Slash4
    new SoundEffect(0x02, 0x05, 0x25dd),            // Wall Clink
    new SoundEffect(0x02, 0x06, 0x25d7),            // Bombable door clink
    new SoundEffect(0x02, 0x07, 0x25b7),            // Fwoosh shooting
    new SoundEffect(0x02, 0x08, 0x25e3),            // Arrow hitting wall
    new SoundEffect(0x02, 0x09, 0x25ad),            // Boomerand whoosh
    new SoundEffect(0x02, 0x0a, 0x25c7),            // Hookshot
    new SoundEffect(0x02, 0x0b, 0x2478),            // Place bomb
    new SoundEffect(0x02, 0x0c, 0x269c),            // Bomb explosion
    new SoundEffect(0x02, 0x0d, 0x2414, [0x3f]),    // Magic powder
    new SoundEffect(0x02, 0x0e, 0x2404),            // Fire rod shot
    new SoundEffect(0x02, 0x0f, 0x24c3),            // Ice rod shot
    new SoundEffect(0x02, 0x10, 0x23fa),            // Hammer pound
    new SoundEffect(0x02, 0x11, 0x23f0),            // hammer peg
    new SoundEffect(0x02, 0x12, 0x23cd),            // Digging
    new SoundEffect(0x02, 0x13, 0x23a0, [0x3e]),    // Play flute
    new SoundEffect(0x02, 0x14, 0x2380),            // Cape on
    new SoundEffect(0x02, 0x15, 0x2390),            // Cape off/wallmaster grab
    new SoundEffect(0x02, 0x16, 0x232c),            // Staircase
    new SoundEffect(0x02, 0x17, 0x2344),            // Staircase
    new SoundEffect(0x02, 0x18, 0x2356),            // Staircase
    new SoundEffect(0x02, 0x19, 0x236e),            // Staircase
    new SoundEffect(0x02, 0x1a, 0x2316),            // Tall grass
    new SoundEffect(0x02, 0x1b, 0x2307),            // Mire shallow water
    new SoundEffect(0x02, 0x1c, 0x2301),            // Shallow water
    new SoundEffect(0x02, 0x1d, 0x22bb),            // Lifting object
    new SoundEffect(0x02, 0x1e, 0x2577),            // Cut grass
    new SoundEffect(0x02, 0x1f, 0x22e9),            // Item break
    new SoundEffect(0x02, 0x20, 0x22da),            // Item fall in pit
    new SoundEffect(0x02, 0x21, 0x22cf),            // Bomb hit ground
    new SoundEffect(0x02, 0x22, 0x2107),            // Push obj/Armos bounce
    new SoundEffect(0x02, 0x23, 0x22b1),            // Boots dust
    new SoundEffect(0x02, 0x24, 0x22a5, [0x3d]),    // Splash
    new SoundEffect(0x02, 0x25, 0x2296),            // Mire shallow water 2
    new SoundEffect(0x02, 0x26, 0x2844),            // Link damaged
    new SoundEffect(0x02, 0x27, 0x2252),            // Faint
    new SoundEffect(0x02, 0x28, 0x2287),            // Item splash
    new SoundEffect(0x02, 0x29, 0x243f, [0x3b]),    // Rupee refill
    new SoundEffect(0x02, 0x2a, 0x2033),            // Fire rod shot hitting wall/Bombos spell
    new SoundEffect(0x02, 0x2b, 0x1ff2),            // Heart beep
    new SoundEffect(0x02, 0x2c, 0x1fd9, [0x3a]),    // Sword up
    new SoundEffect(0x02, 0x2d, 0x20a6),            // Magic drain
    new SoundEffect(0x02, 0x2e, 0x1fca, [0x39]),    // GT open
    new SoundEffect(0x02, 0x2f, 0x1f47, [0x38]),    // GT open/water drain
    new SoundEffect(0x02, 0x30, 0x1ef1),            // Cucco
    new SoundEffect(0x02, 0x31, 0x20ce),            // Fairy
    new SoundEffect(0x02, 0x32, 0x1d47),            // Bug net
    new SoundEffect(0x02, 0x33, 0x1cdc, [], true),  // Teleport2
    new SoundEffect(0x02, 0x34, 0x1f6f, [0x33]),    // Teleport1
    new SoundEffect(0x02, 0x35, 0x1c67, [0x36]),    // Quake/Vitreous/Zora king/Armos/Pyramid/Lanmo
    new SoundEffect(0x02, 0x36, 0x1c64, [], true),  // Mire open
    new SoundEffect(0x02, 0x37, 0x1a43),            // Spin charged
    new SoundEffect(0x02, 0x38, 0x1f6f, [], true),  // Water sound
    new SoundEffect(0x02, 0x39, 0x1f9c, [], true),  // GT open thunder
    new SoundEffect(0x02, 0x3a, 0x1fe7, [], true),  // Sword up
    new SoundEffect(0x02, 0x3b, 0x2462, [], true),  // Quiet rupees
    new SoundEffect(0x02, 0x3c, 0x1a37),            // Error beep
    new SoundEffect(0x02, 0x3d, 0x22ab, [], true),  // Big splash
    new SoundEffect(0x02, 0x3e, 0x23b5, [], true),  // Flute again
    new SoundEffect(0x02, 0x3f, 0x2435, [], true),  // Powder paired

    new SoundEffect(0x03, 0x01, 0x1a18),            // Sword beam
    new SoundEffect(0x03, 0x02, 0x254e),            // TR open
    new SoundEffect(0x03, 0x03, 0x224a),            // Pyramid hole
    new SoundEffect(0x03, 0x04, 0x220e),            // Angry solider
    new SoundEffect(0x03, 0x05, 0x25b7),            // Lynel shot/javelin toss
    new SoundEffect(0x03, 0x06, 0x21f5),            // BNC swing/Phantom ganon/Helma tail/Arrghus swoosh
    new SoundEffect(0x03, 0x07, 0x223d),            // Cannon fire
    new SoundEffect(0x03, 0x08, 0x21e6),            // Damage to enemy; $0BEX.4=1
    new SoundEffect(0x03, 0x09, 0x21c1),            // Kill enemy
    new SoundEffect(0x03, 0x0a, 0x21a9),            // Collect rupee
    new SoundEffect(0x03, 0x0b, 0x2198),            // Collect heart
    new SoundEffect(0x03, 0x0c, 0x218e),            // Non-blank text character
    new SoundEffect(0x03, 0x0d, 0x21b5),            // HUD heart (used explicitly by sanc heart?)
    new SoundEffect(0x03, 0x0e, 0x2182),            // Open chest
    new SoundEffect(0x03, 0x0f, 0x24b9, [0x3c, 0x3d, 0x3e, 0x3f]),  // Open chest jingle
    new SoundEffect(0x03, 0x10, 0x216d, [0x3b]),        // Map screen
    new SoundEffect(0x03, 0x11, 0x214f),                // Open item menu
    new SoundEffect(0x03, 0x12, 0x215e),                // Close item menu
    new SoundEffect(0x03, 0x13, 0x213b),                // Throwing object (sprites use it as well)/Stalfos jump
    new SoundEffect(0x03, 0x14, 0x246c),                // Key door/Trinexx/Dash key landing/Stalfos Knight collapse
    new SoundEffect(0x03, 0x15, 0x212f),                // Door closing/OW door opening/Chest opening (w/ $29 in $012E)
    new SoundEffect(0x03, 0x16, 0x2123),                // Armos thud
    new SoundEffect(0x03, 0x17, 0x25a6),                // Rat squeak
    new SoundEffect(0x03, 0x18, 0x20dd),                // Dragging/Mantle moving
    new SoundEffect(0x03, 0x19, 0x250a),                // Fireball/Laser shot; Somehow used by Trinexx???
    new SoundEffect(0x03, 0x1a, 0x1e8a, [0x38]),        // Chest reveal jingle
    new SoundEffect(0x03, 0x1b, 0x20b6, [0x3a]),        // Puzzle jingle
    new SoundEffect(0x03, 0x1c, 0x1a62),                // damage to enemy
    new SoundEffect(0x03, 0x1d, 0x20a6),                // Potion refill/Magic drain
    new SoundEffect(0x03, 0x1e, 0x2091),                // Flapping (Duck/Cucco swarm/Ganon bats/Keese/Raven/Vulture)
    new SoundEffect(0x03, 0x1f, 0x204b),                // Link fall
    new SoundEffect(0x03, 0x20, 0x276c),                // Menu/Text cursor moved
    new SoundEffect(0x03, 0x21, 0x27e2),                // Boss hit
    new SoundEffect(0x03, 0x22, 0x26cf),                // Boss death/delete file
    new SoundEffect(0x03, 0x23, 0x2001, [0x39]),        // Spin attack/Medallion swoosh
    new SoundEffect(0x03, 0x24, 0x2043),                // OW map perspective change
    new SoundEffect(0x03, 0x25, 0x1e9d),                // Pressure switch
    new SoundEffect(0x03, 0x26, 0x1e7b),                // Lightning/Game over/Laser/Ganon bat/Trinexx lunge
    new SoundEffect(0x03, 0x27, 0x1e40),                // Aga charge
    new SoundEffect(0x03, 0x28, 0x26f7),                // Aga/Ganon Teleport
    new SoundEffect(0x03, 0x29, 0x1e21),                // Aga shot
    new SoundEffect(0x03, 0x2a, 0x1e12),                // Somaria/Byrna/Ether spell/Helma fire ball
    new SoundEffect(0x03, 0x2b, 0x1df3),                // Shocked
    new SoundEffect(0x03, 0x2c, 0x1dc0),                // Bees
    new SoundEffect(0x03, 0x2d, 0x1da9, [0x37]),        // Milestone, also via text
    new SoundEffect(0x03, 0x2e, 0x1d5d, [0x35, 0x34]),  // Collecting heart container
    new SoundEffect(0x03, 0x2f, 0x1d80, [0x33]),        // Collect freestanding/pot key
    new SoundEffect(0x03, 0x30, 0x1b53),                // Byrna spark/Item plop/Magic bat zap/Blob emerge
    new SoundEffect(0x03, 0x31, 0x1aca),                // Sprite falling/Moldorm shuffle
    new SoundEffect(0x03, 0x32, 0x1a78),                // Bumper boing/Somaria punt/Blob transmutation/Sprite boings
    new SoundEffect(0x03, 0x33, 0x1d93, [], true),      // Jingle (paired $2F→$33)
    new SoundEffect(0x03, 0x34, 0x1d66, [], true),      // Depressing jingle (paired $2E→$35→$34)
    new SoundEffect(0x03, 0x35, 0x1d73, [], true),      // Ugly jingle (paired $2E→$35→$34)
    new SoundEffect(0x03, 0x36, 0x1aa7),                // Wizzrobe shot/Helma fireball split/Mothula beam/Blue balls
    new SoundEffect(0x03, 0x37, 0x1db4, [], true),      // Dinky jingle (paired $2D→$37)
    new SoundEffect(0x03, 0x38, 0x1e93, [], true),      // Apathetic jingle (paired $1A→$38)
    new SoundEffect(0x03, 0x39, 0x2017, [], true),      // Quiet swish (paired $23→$39)
    new SoundEffect(0x03, 0x3a, 0x20c0, [], true),      // Defective jingle (paired $1B→$3A)
    new SoundEffect(0x03, 0x3b, 0x2176, [], true),      // Petulant jingle (paired $10→$3B)
    new SoundEffect(0x03, 0x3c, 0x248a, [], true),      // Triumphant jingle (paired $0F→$3C→$3D→$3E→$3F)
    new SoundEffect(0x03, 0x3d, 0x2494, [], true),      // Less triumphant jingle ($0F→$3C→$3D→$3E→$3F)
    new SoundEffect(0x03, 0x3e, 0x249e, [], true),      // "You tried, I guess" jingle (paired $0F→$3C→$3D→$3E→$3F)
    new SoundEffect(0x03, 0x3f, 0x2480, [], true),      // "You didn't really try" jingle (paired $0F→$3C→$3D→$3E→$3F)
];

/**
 * @param {T[]} array
 * @template T
 */
const fyRand = array => {
    const res = Array.from(array);
    for (let i = res.length - 1; i >= 0; --i) {
        const sel = Math.floor(Math.random() * (i + 1));
        [res[i], res[sel]] = [res[sel], res[i]];
    }
    return res;
};

export default function shuffleSfx() {
    let sfxPool = initSfxDefs();
    /** @type {Record<number,Record<number,SoundEffect>>} */
    const sfxMap = {
        2: {},
        3: {},
    };
    /** @type {Record<number,number[]>} */
    const accompMap = {
        2: [],
        3: [],
    };
    /** @type {{set:number,id:number}[]} */
    let candids = [];

    for (const sfx of sfxPool) {
        sfxMap[sfx.set][sfx.id] = sfx;
        if (sfx.accomp) {
            accompMap[sfx.set].push(sfx.id);
        } else {
            candids.push({
                set: sfx.set,
                id: sfx.id,
            });
        }
    }

    candids = fyRand(candids);

    const chainedSfx = fyRand(sfxPool.filter(s => s.chain.length > 0))
        .sort((a, b) => b.chain.length - a.chain.length);
    for (const chained of chainedSfx) {
        const chosen = candids.find(c => accompMap[c.set].length - chained.chain.length >= 0);
        if (!chosen) {
            throw new Error("SFX chain error");
        }
        chained.target.set = chosen.set;
        chained.target.id = chosen.id;
        chained.target.chain = [];

        chained.chain.forEach(dstream => {
            const next = accompMap[chosen.set].pop();
            const dsAcc = sfxMap[chained.set][dstream];
            dsAcc.target.set = chosen.set;
            dsAcc.target.id = chosen.id;
            chained.target.chain.push(next);
        });

        let ind = candids.indexOf(chosen);
        candids.splice(ind, 1);
        ind = sfxPool.indexOf(chained);
        sfxPool.splice(ind, 1);
    }

    const unchainedSfx = sfxPool.filter(s => !s.accomp);
    for (const s of unchainedSfx) {
        const chosen = candids.pop();
        s.target.set = chosen.set;
        s.target.id = chosen.id;
    }

    return sfxMap;
}

/**
 * @typedef SoundTransfer
 * @prop {number} set
 * @prop {number} id
 * @prop {number[]} chain
 */