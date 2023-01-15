import typescript from "@rollup/plugin-typescript";
import fse from "fs-extra";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.cjs",
      format: "cjs",
    },
    plugins: [
      typescript(),
      {
        name: "include-static-files",
        generateBundle: async () => {
          await Promise.all([
            fse.copy("src/views", "dist/views"),
            fse.copy("src/assets", "dist/assets"),
            fse.copyFile("src/install_fonts.sh", "dist/install_fonts.sh"),
          ]);
        },
      },
    ],
  },
];
