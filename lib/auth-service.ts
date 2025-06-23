import { API_CONFIG } from './api-config'

class AuthService {
  private baseURL: string;
  private directURL: string; // URL direta para OAuth
  private tokenKey: string;
  private userKey: string;
  constructor() {
    // Usar configurações centralizadas
    this.directURL = API_CONFIG.DIRECT_URL;
    this.baseURL = API_CONFIG.FETCH_URL;
    this.tokenKey = 'zefruta_auth_token';
    this.userKey = 'zefruta_user_data';
  }/**
   * Inicia o processo de login OAuth Google
   */
  async loginWithGoogle(userType = 'comprador') {
    try {
      // Definir a URL de callback do frontend baseado no ambiente atual
      const callbackUrl = `${window.location.origin}/auth/google/callback`;
      
      // Usar URL direta para OAuth (não proxy)
      const authUrl = `${this.directURL}/auth/user/google?callback_url=${encodeURIComponent(callbackUrl)}&user_type=${userType}`;

      // Salvar o tipo de usuário antes do redirect
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('zefruta_login_type', userType);
        
        console.log(`🌐 Ambiente atual: ${window.location.origin}`);
        console.log(`📍 Callback URL: ${callbackUrl}`);
        console.log(`🚀 Redirecionando para: ${authUrl}`);
        
        // Redirecionar para o OAuth do Google
        window.location.href = authUrl;
      }
      
    } catch (error) {
      console.error('Erro ao iniciar login:', error);
      throw new Error('Falha ao iniciar processo de login');
    }
  }
  /**
   * Processa o retorno do OAuth na página de callback
   */
  handleOAuthCallback() {
    try {
      if (typeof window === 'undefined') return { success: false, error: 'Window not available' };

      console.log('🔄 Processando callback OAuth...');
      console.log('URL atual:', window.location.href);

      // Extrair parâmetros da URL atual
      const urlParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      
      console.log('Parâmetros da URL:', Object.fromEntries(urlParams.entries()));
      console.log('Hash:', hash);

      let token = null;
      let userType = null;

      // Verificar se o token está nos parâmetros da URL
      if (urlParams.has('token')) {
        token = urlParams.get('token');
        userType = urlParams.get('type') || urlParams.get('userType');
        console.log('✅ Token encontrado nos parâmetros da URL');
      }
      // Verificar se está no hash (formato: #token=xxx&type=yyy)
      else if (hash) {
        const hashParams = new URLSearchParams(hash.substring(1));
        token = hashParams.get('token');
        userType = hashParams.get('type') || hashParams.get('userType');
        console.log('✅ Token encontrado no hash da URL');
      }

      // Verificar se está no sessionStorage (fallback)
      if (!userType) {
        userType = sessionStorage.getItem('zefruta_login_type') || 'comprador';
        console.log('📦 Tipo de usuário recuperado do sessionStorage:', userType);
      }

      if (token) {
        console.log('🔑 Token obtido, processando...');
        
        // Limpar a URL removendo os parâmetros sensíveis
        this.cleanURL();
        
        // Salvar token e dados do usuário
        this.saveAuthData(token, userType);
        
        console.log('✅ Callback processado com sucesso');
        return { success: true, token, userType };
      } else {
        console.error('❌ Token não encontrado na URL de retorno');
        console.log('Parâmetros disponíveis:', Object.fromEntries(urlParams.entries()));
        throw new Error('Token não encontrado na URL de retorno');
      }
      
    } catch (error) {
      console.error('❌ Erro ao processar callback OAuth:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
  /**
   * Salva os dados de autenticação
   */
  async saveAuthData(token: string, userType: string | null) {
    try {
      if (typeof window === 'undefined') return;

      console.log('💾 Salvando dados de autenticação...');

      // Salvar token no localStorage
      localStorage.setItem(this.tokenKey, token);
      console.log('✅ Token salvo no localStorage');
      
      // Decodificar o JWT para extrair dados do usuário
      const userData = this.decodeJWT(token);
      console.log('📋 Dados decodificados do JWT:', userData);
      
      if (!userData) {
        throw new Error('Falha ao decodificar token JWT');
      }      // Enriquecer dados com tipo de usuário
      const mappedUserType = this.mapUserType(userType || 'comprador')
      const enrichedUserData = {
        ...userData,
        userType: mappedUserType,
        originalType: userType, // Manter o tipo original do backend
        loginTime: new Date().toISOString()
      };
      
      // Salvar dados do usuário
      localStorage.setItem(this.userKey, JSON.stringify(enrichedUserData));
      console.log('✅ Dados do usuário salvos:', enrichedUserData);
      
      // Buscar dados completos do perfil
      try {
        console.log('🔍 Buscando perfil completo...');
        await this.fetchUserProfile();
        console.log('✅ Perfil atualizado com sucesso');
      } catch (profileError) {
        console.warn('⚠️ Erro ao buscar perfil (não crítico):', profileError);
      }
      
      console.log('✅ Login realizado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao salvar dados de auth:', error);
      throw error;
    }
  }

  /**
   * Busca dados completos do perfil do usuário
   */
  async fetchUserProfile() {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await fetch(`${this.baseURL}/account/profile/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const profileData = await response.json();
        
        // Atualizar dados salvos com informações do perfil
        const currentUserData = this.getUserData();
        const updatedUserData = {
          ...currentUserData,
          profile: profileData
        };
        
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.userKey, JSON.stringify(updatedUserData));
        }
        return profileData;
      }
      
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  }
  /**
   * Decodifica JWT token
   */
  decodeJWT(token: string) {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      
      // Mapear 'usuario' para 'comprador' (compatibilidade com backend)
      let userType = decoded.type || 'comprador';
      if (userType === 'usuario') {
        userType = 'comprador';
      }
      
      return {
        id: decoded.sub || decoded.id,
        email: decoded.email,
        name: decoded.nome || decoded.name, // Backend usa 'nome'
        exp: decoded.exp,
        roles: decoded.roles || [],
        type: userType,
        originalType: decoded.type // Manter tipo original para referência
      };
    } catch (error) {
      console.error('Erro ao decodificar JWT:', error);
      return null;
    }
  }
  /**
   * Limpa a URL removendo parâmetros sensíveis
   */
  cleanURL() {
    if (typeof window === 'undefined') return;

    console.log('🧹 Limpando URL...');
    const originalUrl = window.location.href;

    // Remover parâmetros de token da URL
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    url.searchParams.delete('type');
    url.searchParams.delete('userType');
    url.searchParams.delete('error');
    url.searchParams.delete('code'); // OAuth code parameter
    url.searchParams.delete('state'); // OAuth state parameter
    url.hash = '';
    
    const cleanedUrl = url.pathname + url.search;
    console.log('URL original:', originalUrl);
    console.log('URL limpa:', cleanedUrl);
    
    // Atualizar URL sem recarregar a página
    window.history.replaceState({}, document.title, cleanedUrl);
  }

  /**
   * Verifica se usuário está logado
   */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    // Verificar se token ainda é válido
    const userData = this.getUserData();
    if (userData && userData.exp) {
      const now = Math.floor(Date.now() / 1000);
      return userData.exp > now;
    }

    return true;
  }

  /**
   * Obtém o token salvo
   */
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Obtém dados do usuário
   */
  getUserData() {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(this.userKey);
    return data ? JSON.parse(data) : null;
  }
  /**
   * Obtém tipo do usuário logado
   */
  getUserType() {
    const userData = this.getUserData();
    const userType = userData?.userType || userData?.type || 'comprador';
    return this.mapUserType(userType);
  }

  /**
   * Faz logout removendo dados salvos
   */
  logout() {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    sessionStorage.removeItem('zefruta_login_type');
    
    // Redirecionar para página inicial
    window.location.href = '/';
  }

  /**
   * Faz requisições autenticadas
   */
  async authenticatedRequest(url: string, options: RequestInit = {}) {
    const token = this.getToken();
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const finalOptions: RequestInit = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    const response = await fetch(`${this.baseURL}${url}`, finalOptions);
    
    // Se token expirou, fazer logout
    if (response.status === 401) {
      this.logout();
      throw new Error('Sessão expirada');
    }

    return response;
  }

  /**
   * Mapeia tipos de usuário do backend para o frontend
   */
  private mapUserType(backendType: string): string {
    const typeMapping = {
      'usuario': 'comprador',
      'user': 'comprador',
      'comprador': 'comprador',
      'vendedor': 'vendedor',
      'entregador': 'entregador',
      'admin': 'admin'
    }
    
    return typeMapping[backendType as keyof typeof typeMapping] || 'comprador'
  }
}

// Exportar instância singleton
export const authService = new AuthService();
export default authService;
