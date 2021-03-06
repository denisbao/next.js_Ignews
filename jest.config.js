module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],                  // pastas que devem ser ignoradas
  setupFilesAfterEnv: [                                                   // arquivos que o jest deve executar antes de rodar os testes
    "<rootDir>/src/tests/setupTests.ts"
  ],
  transform: {                                                            // definição dos arquivos que devem ser convertidos pelo babel-jest
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  moduleNameMapper: {                                                     // define a biblioteca que deve ser usada para conversão dos arquivos de estilo
    "\\.(scss|css|sass)$": "identity-obj-proxy"
  },
  testEnvironment: 'jsdom'                                                // ambiente a ser utilizado para rodar os testes
}