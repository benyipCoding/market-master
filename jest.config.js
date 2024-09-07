// jest.config.mjs
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "mjs"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"], // 告诉 Jest 把 .ts 和 .tsx 当作 ESM 模块
};
