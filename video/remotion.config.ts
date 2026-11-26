import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setEntryPoint('src/index.ts');
Config.setBrowserExecutable('/opt/pw-browsers/chromium_headless_shell');
