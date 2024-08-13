import { createDir, exists } from "@tauri-apps/api/fs";
import { AppLocalData, dataDir } from "~/constants";

export const handleDirCreation = async () => {
  const makeDir = async (dirPath: string) => {
    const doesDirExist = await exists(dirPath, {
      dir: AppLocalData
    })
    if (!doesDirExist)
      await createDir(dirPath, {
        dir: AppLocalData,
        recursive: true
      });
  };
  const dirsToMake = [dataDir, `${dataDir}/AppIcons`] as const;
  for await (const dir of dirsToMake) {
    makeDir(dir)
  }
}
