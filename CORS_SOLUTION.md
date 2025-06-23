# Solução para Problemas de CORS

## Problema Identificado
O frontend em produção (`ze-da-futa-frony.vercel.app`) estava enfrentando problemas de CORS ao tentar fazer requisições para o backend (`meu-ze-da-fruta-backend-8c4976f28553.herokuapp.com`).

## Solução Implementada

### 1. Proxy API Routes
Criamos um proxy em `/app/api/proxy/[...path]/route.ts` que:
- Intercepta todas as requisições para `/api/proxy/*`
- Redireciona para o backend real
- Adiciona headers CORS apropriados
- Preserva métodos HTTP (GET, POST, PUT, DELETE)
- Mantém headers de autorização

### 2. Configuração Centralizada
Criamos `/lib/api-config.ts` com:
- `DIRECT_URL`: URL direta para OAuth/redirecionamentos
- `FETCH_URL`: URL para requisições (proxy em produção)
- `IS_PRODUCTION`: Detecção de ambiente
- `DEFAULT_HEADERS`: Headers padrão

### 3. Atualizações nos Arquivos
- `lib/api.ts`: Usa proxy em produção
- `lib/auth-service.ts`: URL direta para OAuth, proxy para outras requisições
- `app/comprador/dashboard/page.tsx`: Usa configuração centralizada
- `app/api-test/page.tsx`: Usa configuração centralizada

### 4. Como Funciona
**Desenvolvimento (localhost):**
- Requisições vão diretamente para o backend
- CORS não é problema no localhost

**Produção (Vercel):**
- Requisições fetch vão para `/api/proxy/*`
- Proxy redireciona para o backend
- OAuth ainda usa URL direta (necessário para redirecionamentos)

## Arquivos Modificados
- `/app/api/proxy/[...path]/route.ts` (novo)
- `/lib/api-config.ts` (novo)
- `/lib/api.ts` (atualizado)
- `/lib/auth-service.ts` (atualizado) 
- `/app/comprador/dashboard/page.tsx` (atualizado)
- `/app/api-test/page.tsx` (atualizado)
- `/.env.local` (documentado)

## Próximos Passos
1. Fazer deploy das alterações
2. Testar em produção
3. Se necessário, configurar CORS no backend como solução permanente

## Observações
- Esta é uma solução temporária que funciona imediatamente
- A solução ideal seria configurar CORS no backend
- O proxy adiciona uma pequena latência, mas resolve o problema de CORS
