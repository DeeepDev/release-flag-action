import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import fse from "fs-extra";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.cjs",
      format: "cjs",
      compact: true,
    },
    plugins: [
      typescript(),
      terser(),
      {
        name: "include-static-files",
        generateBundle: async () => {
          await Promise.all([fse.copy("src/views", "dist/views"), fse.copy("src/assets", "dist/assets")]).then(() =>
            fse.copyFile("src/install_fonts.sh", "dist/install_fonts.sh")
          );
        },
      },
    ],
  },
];
