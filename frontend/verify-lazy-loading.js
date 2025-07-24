/**
 * 🔍 Verificador de Implementação de Lazy Loading
 * 
 * Este script analisa o código fonte para verificar se o lazy loading
 * está implementado corretamente nos componentes React.
 */

// Função para verificar se React.lazy está sendo usado
function checkReactLazyImplementation() {
    console.log('🔍 Verificando implementação do React.lazy...');
    
    // Verifica se React.lazy está disponível
    if (typeof React !== 'undefined' && React.lazy) {
        console.log('✅ React.lazy está disponível');
        return true;
    } else {
        console.log('❌ React.lazy não está disponível');
        return false;
    }
}

// Função para verificar Suspense
function checkSuspenseImplementation() {
    console.log('🔍 Verificando implementação do Suspense...');
    
    if (typeof React !== 'undefined' && React.Suspense) {
        console.log('✅ React.Suspense está disponível');
        return true;
    } else {
        console.log('❌ React.Suspense não está disponível');
        return false;
    }
}

// Função para verificar chunks do webpack
function checkWebpackChunks() {
    console.log('🔍 Verificando chunks do webpack...');
    
    if (typeof __webpack_require__ !== 'undefined') {
        console.log('✅ Webpack detectado');
        
        if (__webpack_require__.cache) {
            const chunks = Object.keys(__webpack_require__.cache);
            console.log(`📦 Total de chunks carregados: ${chunks.length}`);
            
            // Procura por chunks relacionados aos modais
            const modalChunks = chunks.filter(chunk => 
                chunk.includes('Modal') || 
                chunk.includes('modal') ||
                chunk.includes('Login') ||
                chunk.includes('Register')
            );
            
            console.log(`🎯 Chunks de modais encontrados: ${modalChunks.length}`);
            modalChunks.forEach(chunk => console.log(`   - ${chunk}`));
            
            return { total: chunks.length, modalChunks: modalChunks.length };
        }
    } else {
        console.log('❌ Webpack não detectado');
        return null;
    }
}

// Função para verificar imports dinâmicos no código
function checkDynamicImports() {
    console.log('🔍 Verificando imports dinâmicos...');
    
    // Verifica se há elementos script com imports dinâmicos
    const scripts = Array.from(document.querySelectorAll('script'));
    let dynamicImportsFound = 0;
    
    scripts.forEach(script => {
        if (script.textContent) {
            // Procura por padrões de import dinâmico
            const patterns = [
                /import\s*\(/g,
                /React\.lazy\s*\(/g,
                /__webpack_require__\.e\s*\(/g,
                /dynamic\s*\(/g
            ];
            
            patterns.forEach(pattern => {
                const matches = script.textContent.match(pattern);
                if (matches) {
                    dynamicImportsFound += matches.length;
                }
            });
        }
    });
    
    console.log(`📊 Imports dinâmicos encontrados: ${dynamicImportsFound}`);
    return dynamicImportsFound;
}

// Função para verificar loading states
function checkLoadingStates() {
    console.log('🔍 Verificando estados de loading...');
    
    const loadingSelectors = [
        '[class*="loading"]',
        '[class*="spinner"]',
        '[class*="Loading"]',
        '[class*="Spinner"]',
        '.animate-spin',
        '[data-testid*="loading"]'
    ];
    
    let loadingElements = 0;
    loadingSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        loadingElements += elements.length;
    });
    
    console.log(`⏳ Elementos de loading encontrados: ${loadingElements}`);
    return loadingElements;
}

// Função para verificar modais no DOM
function checkModalsInDOM() {
    console.log('🔍 Verificando modais no DOM...');
    
    const modalSelectors = [
        '[role="dialog"]',
        '.modal',
        '[class*="Modal"]',
        '[class*="modal"]',
        '[data-testid*="modal"]'
    ];
    
    let modalsFound = 0;
    const foundModals = [];
    
    modalSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        modalsFound += elements.length;
        
        elements.forEach(el => {
            foundModals.push({
                selector,
                className: el.className,
                visible: el.offsetParent !== null
            });
        });
    });
    
    console.log(`🎭 Modais encontrados no DOM: ${modalsFound}`);
    foundModals.forEach(modal => {
        console.log(`   - ${modal.selector}: ${modal.className} (visível: ${modal.visible})`);
    });
    
    return { count: modalsFound, details: foundModals };
}

// Função para monitorar network requests
function setupNetworkMonitoring() {
    console.log('🔍 Configurando monitoramento de rede...');
    
    const originalFetch = window.fetch;
    const requests = [];
    
    window.fetch = function(...args) {
        const url = args[0];
        const timestamp = new Date().toISOString();
        
        console.log(`🌐 Fetch request: ${url}`);
        requests.push({ url, timestamp, type: 'fetch' });
        
        return originalFetch.apply(this, args);
    };
    
    // Monitora criação de elementos script
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'SCRIPT' && node.src) {
                    console.log(`📜 Script carregado: ${node.src}`);
                    requests.push({ 
                        url: node.src, 
                        timestamp: new Date().toISOString(), 
                        type: 'script' 
                    });
                }
            });
        });
    });
    
    observer.observe(document.head, { childList: true });
    
    return { requests, observer };
}

// Função principal de verificação
function runLazyLoadingVerification() {
    console.log('🚀 Iniciando verificação completa de Lazy Loading...');
    console.log('================================================');
    
    const results = {
        reactLazy: checkReactLazyImplementation(),
        suspense: checkSuspenseImplementation(),
        webpackChunks: checkWebpackChunks(),
        dynamicImports: checkDynamicImports(),
        loadingStates: checkLoadingStates(),
        modalsInDOM: checkModalsInDOM(),
        timestamp: new Date().toISOString()
    };
    
    console.log('\n📊 RESUMO DOS RESULTADOS:');
    console.log('========================');
    console.log(`✅ React.lazy disponível: ${results.reactLazy}`);
    console.log(`✅ Suspense disponível: ${results.suspense}`);
    console.log(`📦 Chunks webpack: ${results.webpackChunks ? results.webpackChunks.total : 'N/A'}`);
    console.log(`🎯 Chunks de modais: ${results.webpackChunks ? results.webpackChunks.modalChunks : 'N/A'}`);
    console.log(`📥 Imports dinâmicos: ${results.dynamicImports}`);
    console.log(`⏳ Estados de loading: ${results.loadingStates}`);
    console.log(`🎭 Modais no DOM: ${results.modalsInDOM.count}`);
    
    // Análise final
    console.log('\n🔍 ANÁLISE:');
    console.log('==========');
    
    if (results.reactLazy && results.suspense) {
        console.log('✅ Infraestrutura de lazy loading está presente');
    } else {
        console.log('❌ Infraestrutura de lazy loading está incompleta');
    }
    
    if (results.dynamicImports > 0) {
        console.log('✅ Imports dinâmicos detectados no código');
    } else {
        console.log('⚠️ Nenhum import dinâmico detectado');
    }
    
    if (results.modalsInDOM.count === 0) {
        console.log('✅ Modais não estão pré-carregados no DOM (bom para lazy loading)');
    } else {
        console.log('⚠️ Modais encontrados no DOM (podem estar pré-carregados)');
    }
    
    // Configurar monitoramento para próximos testes
    const monitoring = setupNetworkMonitoring();
    
    console.log('\n💡 PRÓXIMOS PASSOS:');
    console.log('==================');
    console.log('1. Clique nos botões de login/registro');
    console.log('2. Observe os logs de rede no console');
    console.log('3. Execute lazyTest.report() para ver o relatório completo');
    
    return { results, monitoring };
}

// Executa a verificação automaticamente
const verification = runLazyLoadingVerification();

// Disponibiliza globalmente
window.lazyVerification = verification;
window.runLazyVerification = runLazyLoadingVerification;

console.log('\n🎉 Verificação concluída! Use window.lazyVerification para acessar os resultados.');