import { normalize } from "@tauri-apps/api/path";
import { exists, mkdir } from "@tauri-apps/plugin-fs";
import { AppLocalData, dataDir } from "~/constants";


export const handleDirCreation = async () => {
  const makeDir = async (dirPath: string) => {
    const doesDirExist = await exists(await normalize(dirPath), {
      baseDir: AppLocalData,
    })
    if (!doesDirExist)
      await mkdir(dirPath, {
        baseDir: AppLocalData,
        recursive: true
      });
  };
  const dirsToMake = [dataDir, `${dataDir}/AppIcons`] as const;
  for await (const dir of dirsToMake) {
    makeDir(dir)
  }
}
