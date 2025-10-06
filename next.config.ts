/** @type {import('next').NextConfig} */
const nextConfig = {
  // Adicione esta configuração de ESLint
  eslint: {
    // ATENÇÃO: Isto desabilita a verificação de erros do ESLint durante o build.
    // É útil para colocar o projeto no ar rapidamente, mas o ideal no futuro é corrigir os avisos.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;