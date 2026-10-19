// Ambiente de publicação. Só PUBLISH_ENV=production libera indexação e exige conteúdo aprovado.
declare const process: { env: Record<string, string | undefined> };
export const isProd = process.env.PUBLISH_ENV === 'production';
