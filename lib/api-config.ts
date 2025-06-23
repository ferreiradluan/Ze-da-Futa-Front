// Configurações centralizadas da API
export const API_CONFIG = {
  // URL direta do backend (para OAuth e redirecionamentos)
  DIRECT_URL: process.env.NEXT_PUBLIC_API_URL || "https://meu-ze-da-fruta-backend-8c4976f28553.herokuapp.com",
  
  // URL para requisições fetch (usando proxy em produção para evitar CORS)
  FETCH_URL: typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? '/api/proxy'  // Usar proxy em produção
    : process.env.NEXT_PUBLIC_API_URL || "https://meu-ze-da-fruta-backend-8c4976f28553.herokuapp.com",
    
  // Verificar se estamos em produção
  IS_PRODUCTION: typeof window !== 'undefined' && window.location.hostname !== 'localhost',
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  }
}

export default API_CONFIG
