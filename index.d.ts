import { PaletteMode, PaletteRandomizerOptions, SeedValue } from "@jaxxy/z3pr";

/**
 * Applies a randomizer seed patch to a JP 1.0 LTTP ROM.
 * @param base The file path to the JP 1.0 ROM.
 * @param seed The seed object generated by alttpr.com.
 * @param options Post-generation options.
 * @returns The patched ROM.
 */
export default function(base: string, seed: VTSeed, options?: PatchOptions): Promise<Uint8Array>;

interface VTSeed {
    generated: string
    hash: string
    logic: string
    patch: Record<number, number[]>[]
    size: number
    spoiler: object
    current_rom_hash?: string
}

interface PatchOptions {
    heartSpeed?: HeartSpeed
    heartColor?: HeartColor
    menuSpeed?: MenuSpeed
    quickswap?: boolean
    backgroundMusic?: boolean
    msu1Resume?: boolean
    reduceFlash?: boolean
    paletteShuffle?: boolean | PaletteMode | PaletteRandomizerOptions<SeedValue>
    sfxShuffle?: boolean
    sprite?: ArrayBuffer
}

/* String Types */
type HeartSpeed = "off" | "quarter" | "half" | "normal" | "double";
type HeartColor = "red" | "blue" | "green" | "yellow";
type MenuSpeed = "slow" | "normal" | "fast" | "instant";