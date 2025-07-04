import * as fs from "node:fs/promises";
import * as bps from "bps";
import center from "center-align";
import {
    charBytes,
    heartColorBytes,
    heartSpeedBytes,
    menuSpeedBytes,
} from "./records.js";

const URL = "https://alttpr.com";

/**
 * Applies a randomizer seed patch to a JP 1.0 LTTP ROM.
 * @param {string} base File path to a JP 1.0 LTTP ROM.
 * @param {object} seed Seed object generated by alttpr.com.
 * @param {object} [options] Post-generation options to be applied during patching.
 */
export default async function(base, seed, options) {
    const { buffer } = await fs.readFile(base);
    let rom = new Uint8Array(buffer);

    // Apply base patch first
    if (!("current_rom_hash" in seed)) {
        const res = await fetch(`${URL}/api/h/${seed.hash}`);
        const json = await res.json();
        seed.current_rom_hash = json.md5;
    }

    const bpsFile = await fetch(`${URL}/bps/${seed.current_rom_hash}.bps`)
        .then(res => res.arrayBuffer());
    const patch = new Uint8Array(bpsFile);
    const { instructions } = bps.parse(patch);

    rom = bps.apply(instructions, rom);

    // Expand ROM size if necessary
    if (seed.size > 2) {
        const newSize = seed.size * (1024 ** 2);
        const resizeSize = Math.min(newSize, rom.buffer.byteLength);
        const replacement = new Uint8Array(resizeSize);
        replacement.set(rom);
        rom = replacement;
    }

    // Seed-specific patches
    for (const rec of seed.patch) {
        let [[key, values]] = Object.entries(rec);
        key = parseInt(key);
        write(key, values);
    }

    // Custom sprite
    if (options?.sprite instanceof ArrayBuffer) {
        options.sprite = new Uint8Array(options.sprite);
        if (isZSPR(options.sprite)) {
            parseZSPR(options.sprite);
        } else { // Legacy handler
            for (let i = 0; i < 0x7000; ++i) {
                write(0x80000 + i, options.sprite[i]);
            }
            for (let i = 0; i < 120; ++i) {
                write(0xdd308 + i, options.sprite[0x7000 + i]);
            }
            write(0xdedf5, options.sprite[0x7036]);
            write(0xdedf6, options.sprite[0x7037]);
            write(0xdedf7, options.sprite[0x7054]);
            write(0xdedf8, options.sprite[0x7055]);
        }
    }

    // Background music (default: true)
    write(0x18021a, (options?.backgroundMusic ?? true) ? 0x00 : 0x01);

    // Heart color (default: red)
    write(0x187020, heartColorBytes[options?.heartColor] ?? heartColorBytes.red);

    // Heart speed (default: normal)
    write(0x180033, heartSpeedBytes[options?.heartSpeed] ?? heartSpeedBytes.normal);

    // Menu speed (default: normal)
    const isInstant = menuSpeedBytes[options?.menuSpeed] === menuSpeedBytes.instant;
    write(0x180048, menuSpeedBytes[options?.menuSpeed] ?? menuSpeedBytes.normal);
    write(0x6dd9a, isInstant ? 0x20 : 0x11);
    write(0x6df2a, isInstant ? 0x20 : 0x12);
    write(0x6e0e9, isInstant ? 0x20 : 0x12);

    // MSU-1 resume (default: true)
    if (options?.msu1Resume === false) {
        write(0x18021D, 0x00);
        write(0x18021E, 0x00);
    }

    // Quickswap (default: trur)
    write(0x18004b, (options?.quickswap ?? true) ? 0x01 : 0x00);

    // Reduce flashing (default: false)
    write(0x18017f, (options?.reduceFlash ?? false) ? 0x01 : 0x00);

    // Checksum fix done last
    const total = rom.reduce((p, c, i) => i >= 0x7fdc && i < 0x7fe0 ? p : p + c);
    const checksum = (total + 0x1fe) & 0xffff;
    const inverse = checksum ^ 0xffff;
    write(0x7fdc, [
        inverse & 0xff,
        inverse >> 8,
        checksum & 0xff,
        checksum >> 8,
    ]);

    return rom;

    function write(offset, bytes) {
        if (typeof bytes === "number") {
            rom[offset] = bytes;
        } else for (let i = 0; i < bytes.length; ++i) {
            rom[offset + i] = bytes[i];
        }
    }

    /** @param {Uint8Array} data */
    function isZSPR(data) {
        const { fromCharCode } = String;
        return data.subarray(0, 4).reduce((p, c) => p + fromCharCode(c), "") === "ZSPR";
    }

    /** @param {Uint8Array} data */
    function parseZSPR(data) {
        const gfxOffset = data[12] << 24 | data[11] << 16 | data[10] << 8 | data[9];
        const palOffset = data[18] << 24 | data[17] << 16 | data[16] << 8 | data[15];
        let metaIndex = 0x1D;
        let junk = 2;

        while (metaIndex < gfxOffset && junk > 0) {
            if (!data[metaIndex + 1] && !data[metaIndex]) {
                --junk;
            }
            metaIndex += 2;
        }

        let shortAuth = "";
        while (metaIndex < gfxOffset && data[metaIndex] !== 0x00) {
            shortAuth += String.fromCharCode(data[metaIndex]);
            ++metaIndex;
        }

        if (canWriteAuthor()) {
            shortAuth = center(shortAuth.substring(0, 28), 28).toUpperCase();

            for (let i = 0; i < shortAuth.length; ++i) {
                const char = shortAuth.charAt(i);
                const [up, lo] = charBytes[char in charBytes ? char : " "];
                write(0x118002 + i, up);
                write(0x118020 + i, lo);
            }
        }

        // GFX
        if (gfxOffset !== 0xFFFFFFFF) {
            for (let i = 0; i < 0x7000; ++i) {
                write(0x80000 + i, data[gfxOffset + i]);
            }
        }

        // Palettes
        for (let i = 0; i < 120; ++i) {
            write(0xdd308 + i, data[palOffset + i]);
        }

        // Gloves
        for (let i = 0; i < 4; ++i) {
            write(0xdedf5 + i, data[palOffset + 120 + i]);
        }

        function canWriteAuthor() {
            return rom[0x118000] === 0x02 && rom[0x118001] === 0x37 &&
                   rom[0x11801E] === 0x02 && rom[0x11801F] === 0x37;
        }
    }
}