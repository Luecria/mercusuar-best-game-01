import { cpSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';
const root = fileURLToPath(new URL('.', import.meta.url));
const output = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(output, {recursive:true});
for (const folder of ['game','screenshots']) {
 mkdirSync(join(output,folder), {recursive:true});
 if (existsSync(join(root,folder))) cpSync(join(root,folder),join(output,folder),{recursive:true});
}
const dossier = buildDossier(output, {text_max_bytes:163840,screenshots:{max:4,max_bytes:262144},game_max_files:993,game_max_bytes:50331648,game_path_max_bytes:1000});
writeFileSync(join(output,'dossier.json'),dossier);
