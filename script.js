// ===== FIREBASE CONFIGURATION =====
const firebaseConfig = {
    enabled: true,
    apiKey: "AIzaSyDsSxb9bS_RCslV_9dllI2SwtPtViDe1V0",
    authDomain: "wallpapers-hub-130f9.firebaseapp.com",
    projectId: "wallpapers-hub-130f9",
    storageBucket: "wallpapers-hub-130f9.firebasestorage.app",
    messagingSenderId: "332079114333",
    appId: "1:332079114333:web:cd8e02d63f4337babf45b4",
};
const EMAILJS_CONFIG = {
    serviceId: "service_4pe3q7q",
    templateId: "template_c5oz0ho",
    toEmail: "defaultcontato@gmail.com",
};
if (typeof firebase !== "undefined") {
    firebase.initializeApp(firebaseConfig);
    var auth = firebase.auth();
    var db = firebase.firestore();
    var storage = firebase.storage();
}
if (typeof firebase === 'undefined') {
    console.error('Firebase SDK não carregado!');
    showNotification('Erro: Firebase não inicializado', 'error');
} else {
    console.log('Firebase inicializado com sucesso');
}

// ===== GLOBAL VARIABLES =====
let galleryData = [];
let musicData = [];
let displayedCount = 21;
let currentLightboxImg = "";
let currentLightboxTitle = "";
let currentLightboxId = null;
let currentSlide = 1;
let sliderImages = [];
let autoSlideInterval = null;
let currentTrackIndex = 0;
let isPlaying = false;
let audioPlayer = null;
let isMuted = false;
let previousVolume = 0.2;
let comments = [];
let currentUser = null;
let failedAttempts = 0;
let lastFailedAttempt = 0;
let firestoreWallpapersCount = 0;

// Filtros
let currentCategoryFilter = 'all';
let currentOrientationFilter = 'all';

// ===== PERSISTÊNCIA LOCAL DE MÉTRICAS (fallback) =====
const MetricsStore = {
    getDownloads() {
        return parseInt(localStorage.getItem('wh_downloads') || '0');
    },
    incrementDownloads() {
        const current = this.getDownloads();
        const next = current + 1;
        localStorage.setItem('wh_downloads', String(next));
        return next;
    },
    getActiveUsers() {
        const stored = JSON.parse(localStorage.getItem('wh_active_users') || '{}');
        const sessionId = 'session_' + Date.now();
        stored[sessionId] = Date.now();
        const now = Date.now();
        const day = 24 * 60 * 60 * 1000;
        Object.keys(stored).forEach(key => {
            if (now - stored[key] > day) delete stored[key];
        });
        localStorage.setItem('wh_active_users', JSON.stringify(stored));
        return 342 + Object.keys(stored).length;
    }
};

// ===== SISTEMA DE INTERNACIONALIZAÇÃO (i18n) =====
const translations = {
    'pt-BR': {
        nav_home: 'Home',
        nav_gallery: 'Galeria',
        nav_contact: 'Contato',
        btn_login: 'Login',
        btn_signup: 'Criar conta',
        hero_title: 'Wallpapers Hub',
        hero_subtitle: 'Explore Papéis de Parede Premium em 4K e 8K',
        hero_button: 'Explorar Coleção',
        gallery_title: 'Galeria Completa',
        gallery_subtitle: 'Navegue por toda a nossa coleção',
        filter_all: 'Todos',
        filter_nature: 'Natureza',
        filter_abstract: 'Abstrato',
        filter_tech: 'Tecnologia',
        filter_minimal: 'Minimalista',
        filter_urban: 'Urbano',
        filter_space: 'Espaço',
        filter_anime: 'Anime',
        filter_games: 'Games',
        filter_movies: 'Filmes',
        filter_cars: '️Carros',
        filter_orientation_all: '🔄 Todos',
        filter_portrait: '📱 Retrato',
        filter_landscape: '🖥️ Paisagem',
        load_more: 'Carregar Mais Wallpapers',
        all_loaded: 'Todos carregados',
        stat_wallpapers: 'Wallpapers',
        stat_downloads: 'Downloads',
        stat_categories: 'Categorias',
        stat_users: 'Usuários Ativos',
        footer_navigation: 'Navegação',
        footer_categories: 'Categorias',
        footer_contact: 'Contato',
        footer_description: 'A maior coleção de papéis de parede premium. Encontre o wallpaper perfeito para o seu dispositivo com qualidade 4K e Full HD.',
        footer_rights: '© 2026 Wallpapers Hub by NickDev. Todos os direitos reservados.',
        login_title: 'Entrar na sua conta',
        login_subtitle: 'Acesse seus favoritos e configurações',
        signup_title: 'Criar sua conta',
        signup_subtitle: 'Junte-se à comunidade Wallpapers Hub',
        email: 'Email',
        password: 'Senha',
        remember_me: 'Lembrar de mim',
        forgot_password: 'Esqueci a senha',
        btn_enter: 'Entrar',
        btn_creating: 'Criando conta...',
        btn_entering: 'Entrando...',
        no_account: 'Não tem conta?',
        create_account: 'Criar conta',
        has_account: 'Já tem conta?',
        do_login: 'Fazer login',
        full_name: 'Nome completo',
        confirm_password: 'Confirmar senha',
        accept_terms: 'Aceito os termos de uso e política de privacidade',
        profile_tab: 'Perfil',
        favorites_tab: 'Favoritos',
        settings_tab: 'Config',
        member_since: 'Membro desde:',
        favorites_count: 'Favoritos',
        downloads_count: 'Downloads',
        edit_profile: 'Editar perfil',
        change_password: 'Alterar senha',
        danger_zone: 'Zona de perigo',
        delete_account: 'Excluir conta',
        your_favorites: 'Seus Wallpapers Favoritos',
        no_favorites: 'Você ainda não tem favoritos.',
        click_to_favorite: 'Clique no ♡ em qualquer wallpaper para adicionar.',
        wallpaper_name: 'Nome do Wallpaper',
        category: 'Categoria',
        resolution: 'Resolução',
        select_category: 'Selecione uma categoria',
        select_resolution: 'Selecione a resolução',
        wallpaper_image: 'Imagem do Wallpaper',
        click_or_drag: 'Clique ou arraste a imagem aqui',
        jpg_png_max: 'JPG, PNG até 25MB',
        sending: 'Enviando...',
        btn_download: 'Download',
        btn_favorite: 'Favoritar',
        btn_favorited: 'Favoritado',
        comments_title: 'Comentários',
        no_comments: 'Nenhum comentário ainda.',
        be_first: 'Seja o primeiro a comentar!',
        your_name: 'Seu nome',
        your_email: 'Seu email',
        write_comment: 'Escreva seu comentário...',
        btn_send_comment: 'Enviar comentário',
        sending_comment: 'Enviando...',
        comment_sent: 'Enviado com sucesso!',
        comment_error: 'Erro ao enviar. Tente novamente.',
        notif_login_success: 'Login realizado com sucesso!',
        notif_logout: 'Sair',
        notif_logout_error: 'Erro ao sair da conta',
        notif_logout_success: 'Você saiu da sua conta',
        notif_account_created: 'Conta criada! Verifique seu email.',
        notif_verify_email: 'Por favor, verifique seu email',
        notif_verify_before_login: 'Verifique seu email antes de entrar',
        notif_favorites_added: 'Adicionado aos favoritos!',
        notif_favorites_removed: 'Removido dos favoritos',
        notif_login_required: 'Faça login para adicionar favoritos',
        notif_download_login: 'Faça login para baixar wallpapers',
        notif_download_started: 'Download iniciado:',
        notif_comment_sent: 'Comentário enviado!',
        notif_invalid_email: 'Email inválido',
        notif_password_min: 'Senha deve ter pelo menos 8 caracteres',
        notif_accept_terms: 'Aceite os termos de uso',
        notif_name_length: 'Nome deve ter entre 2 e 100 caracteres',
        notif_password_weak: 'Senha muito fraca. Use pelo menos 8 caracteres com maiúsculas, minúsculas e números',
        notif_passwords_no_match: 'As senhas não coincidem',
        notif_passwords_match: 'Senhas coincidem',
        notif_passwords_no_match2: 'Senhas não coincidem',
        notif_error_loading: 'Erro ao carregar dados',
        notif_error_logout: 'Erro ao sair',
        notif_error_favorites: 'Erro ao atualizar favoritos',
        notif_error_comment: 'Erro ao enviar comentário',
        notif_error_connection: 'Erro de conexão',
        notif_too_many_attempts: 'Muitas tentativas. Aguarde',
        notif_user_not_found: 'Usuário não encontrado',
        notif_wrong_password: 'Senha incorreta',
        notif_account_disabled: 'Conta desativada',
        notif_invalid_credentials: 'Credenciais inválidas',
        notif_email_registered: 'Email já cadastrado',
        notif_error_updating: 'Erro ao atualizar',
        notif_profile_updated: 'Perfil atualizado!',
        notif_password_changed: 'Senha alterada com sucesso!',
        notif_account_deleted: 'Conta excluída com sucesso',
        notif_error_deleting: 'Erro ao excluir conta',
        notif_wallpaper_excluded: 'Wallpaper excluído',
        notif_error_excluding: 'Erro ao excluir wallpaper',
        notif_name_min_3: 'Nome deve ter pelo menos 3 caracteres',
        notif_password_incorrect: 'Senha incorreta',
        notif_sure_delete: 'TEM CERTEZA? Esta ação é IRREVERSÍVEL.',
        notif_sure_exclude: 'Tem certeza que deseja excluir este wallpaper?',
        notif_new_password: 'Nova senha (mínimo 8 caracteres):',
        notif_invalid_password: 'Senha inválida',
        notif_password_too_weak: 'Senha muito fraca',
        notif_new_name: 'Novo nome:',
        notif_invalid_name: 'Nome inválido',
        notif_error_connecting: 'Erro ao conectar',
        notif_connected: 'Conectado com',
        notif_connecting: 'Conectando com',
        notif_login_cancelled: 'Login cancelado',
        notif_popup_blocked: 'Popup bloqueado. Permita popups deste site.',
        notif_unauthorized_domain: 'Domínio não autorizado. Configure no Firebase Console.',
        notif_check_internet: 'Erro de conexão. Verifique sua internet.',
        notif_too_many_requests: 'Muitas tentativas. Tente depois',
        strength_weak: 'Fraca',
        strength_medium: 'Média',
        strength_strong: 'Forte',
        strength_label: 'Força:',
        cat_nature: 'Natureza',
        cat_abstract: 'Abstrato',
        cat_tech: 'Tecnologia',
        cat_minimal: 'Minimalista',
        cat_urban: 'Urbano',
        cat_space: 'Espaço',
        cat_anime: 'Anime',
        cat_games: 'Games',
        cat_movies: 'Filmes',
        cat_cars: 'Carros',
        cat_effects: 'Efeitos Visuais',
        cat_landscapes: 'Paisagens'
    },
    'en-US': {
        nav_home: 'Home',
        nav_gallery: 'Gallery',
        nav_contact: 'Contact',
        btn_login: 'Login',
        btn_signup: 'Sign up',
        hero_title: 'Wallpapers Hub',
        hero_subtitle: 'Explore Premium Wallpapers in 4K and 8K',
        hero_button: 'Explore Collection',
        gallery_title: 'Complete Gallery',
        gallery_subtitle: 'Browse our entire collection',
        filter_all: 'All',
        filter_nature: 'Nature',
        filter_abstract: 'Abstract',
        filter_tech: 'Technology',
        filter_minimal: 'Minimalist',
        filter_urban: 'Urban',
        filter_space: 'Space',
        filter_anime: 'Anime',
        filter_games: 'Games',
        filter_movies: 'Movies',
        filter_cars: 'Cars',
        filter_orientation_all: '🔄 All',
        filter_portrait: '📱 Portrait',
        filter_landscape: '🖥️ Landscape',
        load_more: 'Load More Wallpapers',
        all_loaded: 'All loaded',
        stat_wallpapers: 'Wallpapers',
        stat_downloads: 'Downloads',
        stat_categories: 'Categories',
        stat_users: 'Active Users',
        footer_navigation: 'Navigation',
        footer_categories: 'Categories',
        footer_contact: 'Contact',
        footer_description: 'The largest collection of premium wallpapers. Find the perfect wallpaper for your device in 4K and Full HD quality.',
        footer_rights: '© 2026 Wallpapers Hub by NickDev. All rights reserved.',
        login_title: 'Sign in to your account',
        login_subtitle: 'Access your favorites and settings',
        signup_title: 'Create your account',
        signup_subtitle: 'Join the Wallpapers Hub community',
        email: 'Email',
        password: 'Password',
        remember_me: 'Remember me',
        forgot_password: 'Forgot password',
        btn_enter: 'Sign in',
        btn_creating: 'Creating account...',
        btn_entering: 'Signing in...',
        no_account: "Don't have an account? ",
        create_account: 'Sign up',
        has_account: 'Already have an account?',
        do_login: 'Sign in',
        full_name: 'Full name',
        confirm_password: 'Confirm password',
        accept_terms: 'I accept the terms of use and privacy policy',
        profile_tab: 'Profile',
        favorites_tab: 'Favorites',
        settings_tab: 'Settings',
        member_since: 'Member since:',
        favorites_count: 'Favorites',
        downloads_count: 'Downloads',
        edit_profile: 'Edit profile',
        change_password: 'Change password',
        danger_zone: 'Danger zone',
        delete_account: 'Delete account',
        your_favorites: 'Your Favorite Wallpapers',
        no_favorites: "You don't have any favorites yet. ",
        click_to_favorite: 'Click ♡ on any wallpaper to add it.',
        wallpaper_name: 'Wallpaper Name',
        category: 'Category',
        resolution: 'Resolution',
        select_category: 'Select a category',
        select_resolution: 'Select resolution',
        wallpaper_image: 'Wallpaper Image',
        click_or_drag: 'Click or drag image here',
        jpg_png_max: 'JPG, PNG up to 25MB',
        sending: 'Sending...',
        btn_download: 'Download',
        btn_favorite: 'Favorite',
        btn_favorited: 'Favorited',
        comments_title: 'Comments',
        no_comments: 'No comments yet.',
        be_first: 'Be the first to comment!',
        your_name: 'Your name',
        your_email: 'Your email',
        write_comment: 'Write your comment...',
        btn_send_comment: 'Send comment',
        sending_comment: 'Sending...',
        comment_sent: 'Sent successfully!',
        comment_error: 'Error sending. Try again.',
        notif_login_success: 'Login successful!',
        notif_logout: 'Logout',
        notif_logout_error: 'Error when logging out of account',
        notif_logout_success: 'You have been logged out',
        notif_account_created: 'Account created! Check your email.',
        notif_verify_email: 'Please verify your email',
        notif_verify_before_login: 'Verify your email before signing in',
        notif_favorites_added: 'Added to favorites!',
        notif_favorites_removed: 'Removed from favorites',
        notif_login_required: 'Sign in to add favorites',
        notif_download_login: 'Sign in to download wallpapers',
        notif_download_started: 'Download started:',
        notif_comment_sent: 'Comment sent!',
        notif_invalid_email: 'Invalid email',
        notif_password_min: 'Password must be at least 8 characters',
        notif_accept_terms: 'Accept the terms of use',
        notif_name_length: 'Name must be between 2 and 100 characters',
        notif_password_weak: 'Password too weak. Use at least 8 characters with uppercase, lowercase and numbers',
        notif_passwords_no_match: 'Passwords do not match',
        notif_passwords_match: 'Passwords match',
        notif_passwords_no_match2: 'Passwords do not match',
        notif_error_loading: 'Error loading data',
        notif_error_logout: 'Error logging out',
        notif_error_favorites: 'Error updating favorites',
        notif_error_comment: 'Error sending comment',
        notif_error_connection: 'Connection error',
        notif_too_many_attempts: 'Too many attempts. Wait',
        notif_user_not_found: 'User not found',
        notif_wrong_password: 'Incorrect password',
        notif_account_disabled: 'Account disabled',
        notif_invalid_credentials: 'Invalid credentials',
        notif_email_registered: 'Email already registered',
        notif_error_updating: 'Error updating',
        notif_profile_updated: 'Profile updated!',
        notif_password_changed: 'Password changed successfully!',
        notif_account_deleted: 'Account deleted successfully',
        notif_error_deleting: 'Error deleting account',
        notif_wallpaper_excluded: 'Wallpaper deleted',
        notif_error_excluding: 'Error deleting wallpaper',
        notif_password_incorrect: 'Incorrect password',
        notif_sure_delete: 'ARE YOU SURE? This action is IRREVERSIBLE.',
        notif_sure_exclude: 'Are you sure you want to delete this wallpaper?',
        notif_new_password: 'New password (minimum 8 characters):',
        notif_invalid_password: 'Invalid password',
        notif_password_too_weak: 'Password too weak',
        notif_new_name: 'New name:',
        notif_invalid_name: 'Invalid name',
        notif_error_connecting: 'Error connecting',
        notif_connected: 'Connected with',
        notif_connecting: 'Connecting with',
        notif_login_cancelled: 'Login cancelled',
        notif_popup_blocked: 'Popup blocked. Allow popups from this site.',
        notif_unauthorized_domain: 'Unauthorized domain. Configure in Firebase Console.',
        notif_check_internet: 'Connection error. Check your internet.',
        notif_too_many_requests: 'Too many attempts. Try later',
        strength_weak: 'Weak',
        strength_medium: 'Medium',
        strength_strong: 'Strong',
        strength_label: 'Strength:',
        cat_nature: 'Nature',
        cat_abstract: 'Abstract',
        cat_tech: 'Technology',
        cat_minimal: 'Minimalist',
        cat_urban: 'Urban',
        cat_space: 'Space',
        cat_anime: 'Anime',
        cat_games: 'Games',
        cat_movies: 'Movies',
        cat_cars: 'Cars',
        cat_effects: 'Visual Effects',
        cat_landscapes: 'Landscapes'
    },
    'es-ES': {
        nav_home: 'Inicio',
        nav_gallery: 'Galería',
        nav_contact: 'Contacto',
        btn_login: 'Iniciar sesión',
        btn_signup: 'Crear cuenta',
        hero_title: 'Wallpapers Hub',
        hero_subtitle: 'Explora Fondos de Pantalla Premium en 4K y 8K',
        hero_button: 'Explorar Colección',
        gallery_title: 'Galería Completa',
        gallery_subtitle: 'Navega por toda nuestra colección',
        filter_all: 'Todos',
        filter_nature: 'Naturaleza',
        filter_abstract: 'Abstracto',
        filter_tech: 'Tecnología',
        filter_minimal: 'Minimalista',
        filter_urban: 'Urbano',
        filter_space: 'Espacio',
        filter_anime: 'Anime',
        filter_games: 'Juegos',
        filter_movies: 'Películas',
        filter_cars: 'Coches',
        filter_orientation_all: '🔄 Todos',
        filter_portrait: '📱 Retrato',
        filter_landscape: '🖥️ Paisaje',
        load_more: 'Cargar Más Fondos',
        all_loaded: 'Todos cargados',
        stat_wallpapers: 'Fondos',
        stat_downloads: 'Descargas',
        stat_categories: 'Categorías',
        stat_users: 'Usuarios Activos',
        footer_navigation: 'Navegación',
        footer_categories: 'Categorías',
        footer_contact: 'Contacto',
        footer_description: 'La mayor colección de fondos de pantalla premium. Encuentra el fondo perfecto para tu dispositivo en calidad 4K y Full HD.',
        footer_rights: '© 2026 Wallpapers Hub by NickDev. Todos los derechos reservados.',
        login_title: 'Iniciar sesión en tu cuenta',
        login_subtitle: 'Accede a tus favoritos y configuraciones',
        signup_title: 'Crear tu cuenta',
        signup_subtitle: 'Únete a la comunidad Wallpapers Hub',
        email: 'Correo electrónico',
        password: 'Contraseña',
        remember_me: 'Recuérdame',
        forgot_password: 'Olvidé mi contraseña',
        btn_enter: 'Entrar',
        btn_creating: 'Creando cuenta...',
        btn_entering: 'Entrando...',
        no_account: '¿No tienes cuenta?',
        create_account: 'Crear cuenta',
        has_account: '¿Ya tienes cuenta?',
        do_login: 'Iniciar sesión',
        full_name: 'Nombre completo',
        confirm_password: 'Confirmar contraseña',
        accept_terms: 'Acepto los términos de uso y política de privacidad',
        profile_tab: 'Perfil',
        favorites_tab: 'Favoritos',
        settings_tab: '️Config',
        member_since: 'Miembro desde:',
        favorites_count: 'Favoritos',
        downloads_count: 'Descargas',
        edit_profile: 'Editar perfil',
        change_password: 'Cambiar contraseña',
        danger_zone: 'Zona peligrosa',
        delete_account: 'Eliminar cuenta',
        your_favorites: 'Tus Fondos Favoritos',
        no_favorites: 'Aún no tienes favoritos.',
        click_to_favorite: 'Haz clic en ♡ en cualquier fondo para añadirlo.',
        btn_download: 'Descargar',
        btn_favorite: 'Favorito',
        btn_favorited: 'Favoritado',
        comments_title: 'Comentarios',
        no_comments: 'Aún no hay comentarios.',
        be_first: '¡Sé el primero en comentar!',
        your_name: 'Tu nombre',
        your_email: 'Tu correo',
        write_comment: 'Escribe tu comentario...',
        btn_send_comment: 'Enviar comentario',
        sending_comment: 'Enviando...',
        comment_sent: '¡Enviado con éxito!',
        comment_error: 'Error al enviar. Intenta de nuevo.',
        notif_login_success: '¡Inicio de sesión exitoso!',
        notif_logout: 'Salir',
        notif_logout_error: 'Error al cerrar sesión en la cuenta',
        notif_logout_success: '¡Cierre de sesión exitoso!',
        notif_account_created: '¡Cuenta creada! Verifica tu correo.',
        notif_verify_email: 'Por favor, verifica tu correo',
        notif_verify_before_login: 'Verifica tu correo antes de entrar',
        notif_favorites_added: '¡Añadido a favoritos!',
        notif_favorites_removed: 'Eliminado de favoritos',
        notif_login_required: 'Inicia sesión para añadir favoritos',
        notif_download_login: 'Inicia sesión para descargar fondos',
        notif_download_started: '⬇ Descarga iniciada:',
        notif_comment_sent: '¡Comentário enviado!',
        notif_invalid_email: 'Correo inválido',
        notif_password_min: 'La contraseña debe tener al menos 8 caracteres',
        notif_accept_terms: 'Acepta los términos de uso',
        notif_name_length: 'El nombre debe tener entre 2 y 100 caracteres',
        notif_password_weak: 'Contraseña muy débil. Usa al menos 8 caracteres con mayúsculas, minúsculas y números',
        notif_passwords_no_match: 'Las contraseñas no coinciden',
        notif_passwords_match: 'Las contraseñas coinciden',
        notif_passwords_no_match2: 'Las contraseñas no coinciden',
        notif_error_loading: 'Error al cargar datos',
        notif_error_logout: 'Error al cerrar sesión',
        notif_error_favorites: 'Error al actualizar favoritos',
        notif_error_comment: 'Error al enviar comentario',
        notif_error_connection: 'Error de conexión',
        notif_too_many_attempts: 'Demasiados intentos. Espera',
        notif_user_not_found: 'Usuario no encontrado',
        notif_wrong_password: 'Contraseña incorrecta',
        notif_account_disabled: 'Cuenta desactivada',
        notif_invalid_credentials: 'Credenciales inválidas',
        notif_email_registered: 'Correo ya registrado',
        notif_error_updating: 'Error al actualizar',
        notif_profile_updated: '¡Perfil actualizado!',
        notif_password_changed: '¡Contraseña cambiada con éxito!',
        notif_account_deleted: 'Cuenta eliminada con éxito',
        notif_error_deleting: 'Error al eliminar cuenta',
        notif_name_min_3: 'El nombre debe tener al menos 3 caracteres',
        notif_password_incorrect: 'Contraseña incorrecta',
        notif_sure_delete: '¿ESTÁS SEGURO? Esta acción es IRREVERSIBLE.',
        notif_sure_exclude: '¿Estás seguro de que deseas eliminar este fondo?',
        notif_new_password: 'Nueva contraseña (mínimo 8 caracteres):',
        notif_invalid_password: 'Contraseña inválida',
        notif_password_too_weak: 'Contraseña muy débil',
        notif_new_name: 'Nuevo nombre:',
        notif_invalid_name: 'Nombre inválido',
        notif_error_connecting: 'Error al conectar',
        notif_connected: 'Conectado con',
        notif_connecting: 'Conectando con',
        notif_login_cancelled: 'Inicio de sesión cancelado',
        notif_popup_blocked: 'Popup bloqueado. Permite popups de este sitio.',
        notif_unauthorized_domain: 'Dominio no autorizado. Configura en Firebase Console.',
        notif_check_internet: 'Error de conexión. Verifica tu internet.',
        notif_too_many_requests: 'Demasiados intentos. Intenta más tarde',
        strength_weak: 'Débil',
        strength_medium: 'Media',
        strength_strong: 'Fuerte',
        strength_label: 'Fuerza:',
        cat_nature: 'Naturaleza',
        cat_abstract: 'Abstracto',
        cat_tech: 'Tecnología',
        cat_minimal: 'Minimalista',
        cat_urban: 'Urbano',
        cat_space: 'Espacio',
        cat_anime: 'Anime',
        cat_games: 'Juegos',
        cat_movies: 'Películas',
        cat_cars: 'Coches',
        cat_effects: 'Efectos Visuales',
        cat_landscapes: 'Paisajes'
    }
};
let currentLanguage = localStorage.getItem('language') || 'pt-BR';

function toggleLanguageMenu() {
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) dropdown.classList.toggle('active');
}

function changeLanguage(lang) {
    if (!translations[lang]) return;
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    const langNames = { 'pt-BR': 'PT-BR', 'en-US': 'EN-US', 'es-ES': 'ES-ES' };
    const currentLangEl = document.getElementById('languageCurrent');
    if (currentLangEl) currentLangEl.textContent = langNames[lang];
    document.querySelectorAll('.language-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.textContent = translations[lang][key];
    });
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) dropdown.classList.remove('active');
    showNotification(`Language changed to ${lang}`, 'success');
}

function t(key) {
    return translations[currentLanguage][key] || translations['pt-BR'][key] || key;
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.language-selector')) {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) dropdown.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    changeLanguage(currentLanguage);
});

// ===== SEGURANÇA: VALIDAÇÕES =====
function sanitizeInput(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML.trim();
}

function isValidEmail(email) {
    if (!email || email.length > 254) return false;
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return re.test(email);
}

function checkPasswordStrength(password) {
    if (!password) return { score: 0, valid: false };
    let score = 0;
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    Object.values(checks).forEach((v) => { if (v) score++; });
    return { score, valid: score >= 4 && password.length >= 8, checks };
}

function checkRateLimit() {
    const now = Date.now();
    const lockoutTime = 60000;
    const maxAttempts = 5;
    if (now - lastFailedAttempt > lockoutTime) failedAttempts = 0;
    if (failedAttempts >= maxAttempts) {
        const remaining = Math.ceil((lockoutTime - (now - lastFailedAttempt)) / 1000);
        showNotification(`Muitas tentativas. Aguarde ${remaining}s`, "error");
        return false;
    }
    return true;
}

function recordFailedAttempt() {
    failedAttempts++;
    lastFailedAttempt = Date.now();
}

function resetFailedAttempts() {
    failedAttempts = 0;
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === "password") {
        input.type = "text";
        if (btn) btn.textContent = "🙈";
    } else {
        input.type = "password";
        if (btn) btn.textContent = "️";
    }
}

function displayPasswordStrength(password) {
    const strengthEl = document.getElementById("passwordStrength");
    if (!strengthEl || !password) return;
    const strength = checkPasswordStrength(password);
    let label, color, width;
    if (strength.score <= 2) {
        label = t('strength_weak');
        color = "#f5576c";
        width = "33%";
    } else if (strength.score <= 3) {
        label = t('strength_medium');
        color = "#ffa726";
        width = "66%";
    } else {
        label = t('strength_strong');
        color = "#4ade80";
        width = "100%";
    }
    strengthEl.innerHTML = `<div style="background:rgba(255,255,255,0.1);border-radius:2px;margin:5px 0;overflow:hidden;height:4px;"><div style="width:${width};background:${color};height:100%;transition:all 0.3s ease;"></div></div><span style="color:${color};font-size:0.8rem;font-weight:600;">${t('strength_label')} ${label}</span>`;
    checkPasswordMatch();
}

function checkPasswordMatch() {
    const pass = document.getElementById("signupPassword")?.value;
    const confirm = document.getElementById("signupConfirmPassword")?.value;
    const matchEl = document.getElementById("passwordMatch");
    if (!matchEl || !confirm) return;
    if (confirm.length === 0) {
        matchEl.textContent = "";
        return;
    }
    if (pass === confirm) {
        matchEl.textContent = t('notif_passwords_match');
        matchEl.style.color = "#4ade80";
    } else {
        matchEl.textContent = t('notif_passwords_no_match2');
        matchEl.style.color = "#f5576c";
    }
}

// ===== AUTH STATE OBSERVER =====
if (typeof auth !== "undefined") {
    auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
            try {
                if (!firebaseUser.emailVerified && firebaseUser.providerData[0]?.providerId === "password") {
                    showNotification(t('notif_verify_email'), "warning");
                    await auth.signOut();
                    currentUser = null;
                    updateAuthUI();
                    return;
                }
                const userDoc = await db.collection("users").doc(firebaseUser.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    currentUser = {
                        uid: firebaseUser.uid,
                        name: userData.name || firebaseUser.displayName || "Usuário",
                        email: firebaseUser.email,
                        avatar: firebaseUser.photoURL || generateAvatar(userData.name || firebaseUser.email),
                        provider: firebaseUser.providerData[0]?.providerId || "local",
                        linkedAccounts: userData.linkedAccounts || { google: false, github: false },
                        favorites: userData.favorites || [],
                        downloads: userData.downloads || 0,
                        createdAt: userData.createdAt || firebase.firestore.FieldValue.serverTimestamp(),
                    };
                } else {
                    const newUser = {
                        name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
                        email: firebaseUser.email,
                        avatar: firebaseUser.photoURL || generateAvatar(firebaseUser.displayName || firebaseUser.email),
                        provider: firebaseUser.providerData[0]?.providerId || "local",
                        linkedAccounts: {
                            google: firebaseUser.providerData.some((p) => p.providerId === "google.com"),
                            github: firebaseUser.providerData.some((p) => p.providerId === "github.com"),
                        },
                        favorites: [],
                        downloads: 0,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    };
                    await db.collection("users").doc(firebaseUser.uid).set(newUser);
                    currentUser = { uid: firebaseUser.uid, ...newUser };
                    // Incrementar contador de usuários
                    await incrementGlobalUsers();
                }
                updateAuthUI();
                resetFailedAttempts();
                updateGalleryFavoriteButtons();
                // Atualizar favoritos no modal se aberto
                if (document.getElementById('tab-favorites')?.classList.contains('active')) {
                    renderFavorites();
                }
            } catch (error) {
                console.error("Error loading user data:", error);
                showNotification(t('notif_error_loading'), "error");
            }
        } else {
            currentUser = null;
            updateAuthUI();
            updateGalleryFavoriteButtons();
            renderFavorites();
        }
    });
}

// ===== AUTH FUNCTIONS =====
async function handleLogin(event) {
    event.preventDefault();
    if (!checkRateLimit()) return;
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const submitBtn = document.getElementById("loginSubmitBtn");
    if (!isValidEmail(email)) {
        showNotification(t('notif_invalid_email'), "error");
        return;
    }
    if (password.length < 8) {
        showNotification(t('notif_password_min'), "error");
        return;
    }
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = t('btn_entering');
    }
    try {
        const rememberMe = document.getElementById("rememberMe")?.checked;
        await auth.setPersistence(rememberMe ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION);
        await auth.signInWithEmailAndPassword(email, password);
        if (!auth.currentUser.emailVerified && auth.currentUser.providerData[0]?.providerId === "password") {
            await auth.signOut();
            showNotification(t('notif_verify_before_login'), "error");
            recordFailedAttempt();
            return;
        }
        closeAuthModal("login");
        resetFailedAttempts();
    } catch (error) {
        console.error(error);
        recordFailedAttempt();
        let msg = t('notif_error_connecting');
        switch (error.code) {
            case "auth/user-not-found": msg = t('notif_user_not_found'); break;
            case "auth/wrong-password": msg = t('notif_wrong_password'); break;
            case "auth/invalid-email": msg = t('notif_invalid_email'); break;
            case "auth/user-disabled": msg = t('notif_account_disabled'); break;
            case "auth/too-many-requests": msg = t('notif_too_many_requests'); break;
            case "auth/invalid-credential": msg = t('notif_invalid_credentials'); break;
            case "auth/network-request-failed": msg = t('notif_check_internet'); break;
        }
        showNotification(msg, "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = t('btn_enter');
        }
    }
}

async function handleSignup(event) {
    event.preventDefault();
    if (!checkRateLimit()) return;
    const name = sanitizeInput(document.getElementById("signupName").value.trim());
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;
    const acceptTerms = document.getElementById("acceptTerms")?.checked;
    if (!acceptTerms) {
        showNotification(t('notif_accept_terms'), "error");
        return;
    }
    if (name.length < 2 || name.length > 100) {
        showNotification(t('notif_name_length'), "error");
        return;
    }
    if (!isValidEmail(email)) {
        showNotification(t('notif_invalid_email'), "error");
        return;
    }
    const strength = checkPasswordStrength(password);
    if (!strength.valid) {
        showNotification(t('notif_password_weak'), "error");
        return;
    }
    if (password !== confirmPassword) {
        showNotification(t('notif_passwords_no_match'), "error");
        return;
    }
    const submitBtn = event.target.querySelector(".auth-submit-btn");
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = t('btn_creating');
    }
    try {
        const credential = await auth.createUserWithEmailAndPassword(email, password);
        await credential.user.updateProfile({ displayName: name });
        await credential.user.sendEmailVerification();
        await db.collection("users").doc(credential.user.uid).set({
            name: name,
            email: email,
            avatar: generateAvatar(name),
            provider: "local",
            linkedAccounts: { google: false, github: false },
            favorites: [],
            downloads: 0,
            emailVerified: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        closeAuthModal("signup");
        showNotification(t('notif_account_created'), "success");
        resetFailedAttempts();
        // Incrementar contador de usuários
        await incrementGlobalUsers();
    } catch (error) {
        console.error(error);
        recordFailedAttempt();
        let msg = t('notif_error_connecting');
        switch (error.code) {
            case "auth/email-already-in-use": msg = t('notif_email_registered'); break;
            case "auth/invalid-email": msg = t('notif_invalid_email'); break;
            case "auth/weak-password": msg = t('notif_password_too_weak'); break;
            case "auth/network-request-failed": msg = t('notif_check_internet'); break;
        }
        showNotification(msg, "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = t('btn_signup');
        }
    }
}

async function socialLogin(provider) {
    const providerNames = { google: 'Google', github: 'GitHub' };
    showNotification(`${t('notif_connecting')} ${providerNames[provider]}...`, 'info');
    let authProvider;
    if (provider === 'google') {
        authProvider = new firebase.auth.GoogleAuthProvider();
        authProvider.addScope('profile');
        authProvider.addScope('email');
    } else if (provider === 'github') {
        authProvider = new firebase.auth.GithubAuthProvider();
    }
    try {
        const result = await auth.signInWithPopup(authProvider);
        const user = result.user;
        const userRef = db.collection('users').doc(user.uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            await userRef.set({
                name: user.displayName || user.email.split('@')[0],
                email: user.email,
                avatar: user.photoURL || generateAvatar(user.displayName || user.email),
                provider: provider,
                linkedAccounts: { google: provider === 'google', github: provider === 'github' },
                favorites: [],
                downloads: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            await incrementGlobalUsers();
        }
        closeAuthModal('login');
        closeAuthModal('signup');
        showNotification(`${t('notif_connected')} ${providerNames[provider]}!`, 'success');
    } catch (error) {
        console.error('Erro no login social:', error);
        let msg = t('notif_error_connecting');
        switch(error.code) {
            case 'auth/popup-closed-by-user': msg = t('notif_login_cancelled'); break;
            case 'auth/popup-blocked': msg = t('notif_popup_blocked'); break;
            case 'auth/unauthorized-domain': msg = t('notif_unauthorized_domain'); break;
            case 'auth/network-request-failed': msg = t('notif_check_internet'); break;
            default: msg = error.message || t('notif_error_connecting');
        }
        showNotification(msg, 'error');
    }
}

async function logout() {
    try {
        await auth.signOut();
        currentUser = null;
        closeProfileModal();
        showNotification(t('notif_logout_success'), "info");
        updateGalleryFavoriteButtons();
        renderFavorites();
    } catch (error) {
        showNotification(t('notif_error_logout'), "error");
    }
}

// ===== REAUTENTICAÇÃO (suporte a Google/GitHub) =====
async function reauthenticateUser() {
    const user = auth.currentUser;
    if (!user) return false;
    const providerId = user.providerData[0].providerId;
    if (providerId === 'password') {
        const password = prompt("Para continuar, digite sua senha:");
        if (!password) return false;
        try {
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
            await user.reauthenticateWithCredential(credential);
            return true;
        } catch (error) {
            showNotification(t('notif_password_incorrect'), "error");
            return false;
        }
    } else if (providerId === 'google.com') {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await user.reauthenticateWithPopup(provider);
            return true;
        } catch (error) {
            showNotification("Erro ao reautenticar com Google: " + error.message, "error");
            return false;
        }
    } else if (providerId === 'github.com') {
        const provider = new firebase.auth.GithubAuthProvider();
        try {
            await user.reauthenticateWithPopup(provider);
            return true;
        } catch (error) {
            showNotification("Erro ao reautenticar com GitHub: " + error.message, "error");
            return false;
        }
    } else {
        showNotification("Provedor não suportado para reautenticação.", "error");
        return false;
    }
}

async function deleteAccount() {
    if (!currentUser) return;
    const authenticated = await reauthenticateUser();
    if (!authenticated) return;
    if (!confirm(t('notif_sure_delete'))) return;
    try {
        await db.collection("users").doc(currentUser.uid).delete();
        await auth.currentUser.delete();
        showNotification(t('notif_account_deleted'), "success");
    } catch (error) {
        console.error(error);
        showNotification(t('notif_error_deleting'), "error");
    }
}

async function changePassword() {
    if (!currentUser) return;
    const authenticated = await reauthenticateUser();
    if (!authenticated) return;
    const newPass = prompt(t('notif_new_password'));
    if (!newPass || newPass.length < 8) {
        showNotification(t('notif_invalid_password'), "error");
        return;
    }
    const strength = checkPasswordStrength(newPass);
    if (!strength.valid) {
        showNotification(t('notif_password_too_weak'), "error");
        return;
    }
    try {
        await auth.currentUser.updatePassword(newPass);
        showNotification(t('notif_password_changed'), "success");
    } catch (error) {
        showNotification("Erro: " + error.message, "error");
    }
}

async function openEditProfile() {
    const newName = prompt(t('notif_new_name'), currentUser.name);
    if (!newName || newName.trim().length < 2) {
        showNotification(t('notif_invalid_name'), "error");
        return;
    }
    try {
        await auth.currentUser.updateProfile({ displayName: sanitizeInput(newName.trim()) });
        await db.collection("users").doc(currentUser.uid).update({ name: sanitizeInput(newName.trim()) });
        currentUser.name = sanitizeInput(newName.trim());
        updateAuthUI();
        updateProfileModal();
        showNotification(t('notif_profile_updated'), "success");
    } catch (error) {
        showNotification(t('notif_error_updating'), "error");
    }
}

// ===== FAVORITES SYSTEM =====
async function toggleFavorite(wallpaperId) {
    if (!currentUser) {
        showNotification(t('notif_login_required'), "error");
        openAuthModal("login");
        return;
    }
    try {
        const userRef = db.collection("users").doc(currentUser.uid);
        const userDoc = await userRef.get();
        let favorites = userDoc.data().favorites || [];
        const idx = favorites.indexOf(wallpaperId);
        if (idx > -1) {
            favorites.splice(idx, 1);
            showNotification(t('notif_favorites_removed'), "info");
        } else {
            favorites.push(wallpaperId);
            showNotification(t('notif_favorites_added'), "success");
        }
        await userRef.update({ favorites: favorites });
        currentUser.favorites = favorites;
        updateAuthUI();
        renderFavorites();
        updateFavoriteButtonState();
        updateGalleryFavoriteButtons();
        // Atualiza badge do perfil
        document.getElementById("favBadge").textContent = favorites.length;
    } catch (error) {
        console.error(error);
        showNotification(t('notif_error_favorites'), "error");
    }
}

async function toggleFavoriteFromLightbox() {
    if (currentLightboxId) await toggleFavorite(currentLightboxId);
}

function updateGalleryFavoriteButtons() {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
        const onclickAttr = item.getAttribute('onclick') || '';
        const match = onclickAttr.match(/openLightbox\([^,]+,\s*[^,]+,\s*['"]([^'"]+)['"]\)/);
        if (!match) return;
        const itemId = match[1];
        const favBtn = item.querySelector('.btn-fav');
        if (!favBtn) return;
        const isFav = isFavorite(itemId);
        favBtn.classList.toggle('favorited', isFav);
        favBtn.innerHTML = isFav ? '♥' : '♡';
    });
}

async function updateDownloads() {
    if (!currentUser) return;
    try {
        const userRef = db.collection("users").doc(currentUser.uid);
        await userRef.update({ downloads: firebase.firestore.FieldValue.increment(1) });
        currentUser.downloads = (currentUser.downloads || 0) + 1;
    } catch (error) {
        console.error(error);
    }
}

function isFavorite(wallpaperId) {
    if (!currentUser) return false;
    return currentUser.favorites.includes(wallpaperId);
}

function updateFavoriteButtonState() {
    const btn = document.getElementById("lightboxFavorite");
    if (!btn) return;
    if (currentLightboxId && isFavorite(currentLightboxId)) {
        btn.innerHTML = t('btn_favorited');
        btn.classList.add("favorited");
    } else {
        btn.innerHTML = t('btn_favorite');
        btn.classList.remove("favorited");
    }
}

// ===== DOWNLOAD SYSTEM =====
async function downloadWall(name, wallpaperId) {
    if (!currentUser) {
        showNotification(t('notif_download_login'), "error");
        openAuthModal("login");
        return;
    }
    await updateDownloads();
    // Incrementar downloads globais no Firestore
    await incrementGlobalDownloads();
    // Fallback local
    MetricsStore.incrementDownloads();
    updateMetricsOnDownload();
    let imageUrl = "";
    const wallpaper = galleryData.find((w) => String(w.id) === String(wallpaperId));
    if (wallpaper) {
        imageUrl = wallpaper.image;
    }
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${sanitizeInput(name)}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`${t('notif_download_started')} ${sanitizeInput(name)}`, "success");
}

// ===== STATS GLOBAIS (Firestore) =====
async function updateGlobalStats() {
    try {
        const statsRef = db.collection('stats').doc('global');
        const doc = await statsRef.get();
        if (!doc.exists) {
            // Inicializar com valores base
            const totalWallpapers = galleryData.length;
            const categories = new Set(galleryData.map(w => w.category));
            const totalCategories = categories.size;
            // Contar usuários existentes
            const usersSnapshot = await db.collection('users').get();
            const totalUsers = usersSnapshot.size;
            await statsRef.set({
                totalDownloads: 0,
                totalUsers: totalUsers,
                totalWallpapers: totalWallpapers,
                totalCategories: totalCategories,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        // Atualizar estatísticas na UI
        const statsDoc = await statsRef.get();
        const stats = statsDoc.data();
        // Combine com dados atuais de wallpapers (que podem ter mudado)
        const currentWallpapers = galleryData.length;
        const currentCategories = new Set(galleryData.map(w => w.category)).size;
        // Usar o que for maior (ou sincronizar)
        const finalStats = {
            totalWallpapers: Math.max(stats.totalWallpapers || 0, currentWallpapers),
            totalDownloads: stats.totalDownloads || 0,
            totalCategories: Math.max(stats.totalCategories || 0, currentCategories),
            activeUsers: stats.totalUsers || 0
        };
        updateStats(finalStats);
        // Armazenar para uso futuro
        window.globalStats = finalStats;
    } catch (error) {
        console.error('Error updating global stats:', error);
        // Fallback para stats locais
        const localStats = {
            totalWallpapers: galleryData.length,
            totalDownloads: MetricsStore.getDownloads() + 15420,
            totalCategories: new Set(galleryData.map(w => w.category)).size,
            activeUsers: MetricsStore.getActiveUsers()
        };
        updateStats(localStats);
    }
}

async function incrementGlobalDownloads() {
    try {
        const statsRef = db.collection('stats').doc('global');
        await statsRef.update({
            totalDownloads: firebase.firestore.FieldValue.increment(1)
        });
        // Atualizar UI
        if (window.globalStats) {
            window.globalStats.totalDownloads += 1;
            updateStats(window.globalStats);
        }
    } catch (error) {
        console.error('Error incrementing downloads:', error);
    }
}

async function incrementGlobalUsers() {
    try {
        const statsRef = db.collection('stats').doc('global');
        await statsRef.update({
            totalUsers: firebase.firestore.FieldValue.increment(1)
        });
        if (window.globalStats) {
            window.globalStats.activeUsers += 1;
            updateStats(window.globalStats);
        }
    } catch (error) {
        console.error('Error incrementing users:', error);
    }
}

function updateMetricsOnDownload() {
    const stat2 = document.getElementById('stat2');
    if (stat2 && window.globalStats) {
        stat2.textContent = window.globalStats.totalDownloads.toLocaleString('pt-BR') + '+';
    }
}

// ===== UI FUNCTIONS =====
function updateAuthUI() {
    const authButtons = document.getElementById("authButtons");
    const profileContainer = document.getElementById("profileContainer");
    if (currentUser) {
        if (authButtons) authButtons.style.display = "none";
        if (profileContainer) {
            profileContainer.style.display = "block";
            document.getElementById("profileAvatar").src = currentUser.avatar;
            document.getElementById("profileName").textContent = currentUser.name.split(" ")[0];
            document.getElementById("profileDropdownAvatar").src = currentUser.avatar;
            document.getElementById("profileDropdownName").textContent = currentUser.name;
            document.getElementById("profileDropdownEmail").textContent = currentUser.email;
            document.getElementById("favBadge").textContent = currentUser.favorites.length;
        }
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (profileContainer) profileContainer.style.display = "none";
    }
}

function generateAvatar(name) {
    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().substr(0, 2);
    const colors = ["#1a6dd4", "#f5576c", "#2196F3", "#4CAF50", "#FF9800", "#9C27B0"];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='${encodeURIComponent(bgColor)}' width='100' height='100' rx='50'/%3E%3Ctext fill='white' font-family='Arial' font-size='40' font-weight='bold' x='50' y='50' text-anchor='middle' dy='.35em'%3E${initials}%3C/text%3E%3C/svg%3E`;
}

// ===== MODAL FUNCTIONS =====
function openAuthModal(type) {
    requestAnimationFrame(() => {
        const modal = document.getElementById(type + 'Modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.offsetHeight;
            requestAnimationFrame(() => {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    });
}

function closeAuthModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 250);
    }
}

function switchAuthModal(from, to) {
    const fromModal = document.getElementById(from + "Modal");
    const toModal = document.getElementById(to + "Modal");
    if (!fromModal || !toModal) return;
    fromModal.classList.remove("active");
    setTimeout(() => {
        fromModal.style.display = "none";
        requestAnimationFrame(() => {
            toModal.style.display = "flex";
            toModal.offsetHeight;
            requestAnimationFrame(() => {
                toModal.classList.add("active");
            });
        });
    }, 250);
}

function openProfileModal() {
    if (!currentUser) return;
    requestAnimationFrame(() => {
        const modal = document.getElementById('profileModal');
        if (modal) {
            updateProfileModal();
            modal.style.display = 'flex';
            modal.offsetHeight;
            requestAnimationFrame(() => {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    });
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 250);
    }
}

function updateProfileModal() {
    if (!currentUser) return;
    const avatarImg = document.querySelector("#profileModalAvatar img");
    if (avatarImg) avatarImg.src = currentUser.avatar;
    const nameEl = document.getElementById("profileModalName");
    if (nameEl) nameEl.textContent = currentUser.name;
    const emailEl = document.getElementById("profileModalEmail");
    if (emailEl) emailEl.textContent = currentUser.email;
    const sinceEl = document.getElementById("profileModalSince");
    if (sinceEl && currentUser.createdAt) {
        const date = currentUser.createdAt.toDate ? currentUser.createdAt.toDate() : new Date(currentUser.createdAt);
        sinceEl.textContent = `${t('member_since')} ${date.toLocaleDateString("pt-BR")}`;
    }
    const statFavs = document.getElementById("profileStatFavs");
    if (statFavs) statFavs.textContent = currentUser.favorites.length;
    const statDownloads = document.getElementById("profileStatDownloads");
    if (statDownloads) statDownloads.textContent = currentUser.downloads || 0;
}

function switchProfileTab(tab) {
    document.querySelectorAll(".profile-tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".profile-tab-content").forEach((c) => c.classList.remove("active"));
    const activeTab = document.querySelector(`.profile-tab[data-tab="${tab}"]`);
    if (activeTab) activeTab.classList.add("active");
    const content = document.getElementById("tab-" + tab);
    if (content) content.classList.add("active");
    if (tab === "favorites") renderFavorites();
}

function renderFavorites() {
    const grid = document.getElementById("favoritesGrid");
    const count = document.getElementById("favoritesCount");
    if (!grid) return;
    if (!currentUser || !currentUser.favorites || currentUser.favorites.length === 0) {
        grid.innerHTML = `<div class="no-favorites"><p>${t('no_favorites')}</p><small>${t('click_to_favorite')}</small></div>`;
        if (count) count.textContent = "0 itens";
        return;
    }
    const favWallpapers = galleryData.filter((w) => currentUser.favorites.includes(String(w.id)));
    if (favWallpapers.length === 0) {
        grid.innerHTML = `<div class="no-favorites"><p>${t('no_favorites')}</p><small>${t('click_to_favorite')}</small></div>`;
        if (count) count.textContent = "0 itens";
        return;
    }
    if (count) count.textContent = `${favWallpapers.length} ${favWallpapers.length === 1 ? "item" : "itens"}`;
    grid.innerHTML = favWallpapers.map((w) => `
        <div class="favorite-item" onclick="openLightbox('${w.image}', '${w.name}', '${w.id}')">
            <img src="${w.image}" alt="${w.name}" loading="lazy">
            <div class="favorite-overlay">
                <h4>${w.name}</h4>
                <span>${w.resolution} • ${w.category}</span>
                <button class="favorite-remove" onclick="event.stopPropagation(); toggleFavorite('${w.id}')">♥ Remover</button>
            </div>
        </div>
    `).join("");
}

// ===== LOAD DATA & DYNAMIC STATS =====
async function loadWallpaperData() {
    try {
        const response = await fetch("data.json");
        const data = await response.json();
        galleryData = data.wallpapers || [];
        musicData = data.music || [];
        sliderImages = galleryData.slice(0, 20);
        renderGallery(displayedCount);
        renderSlider();
        // Carregar wallpapers do Firestore e depois atualizar stats
        await loadFirestoreWallpapers();
        await updateGlobalStats();
        if (musicData.length > 0) initMusicPlayer();
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

async function loadFirestoreWallpapers() {
    try {
        if (typeof db === 'undefined') {
            firestoreWallpapersCount = 0;
            return;
        }
        const snapshot = await db.collection('wallpapers').get();
        firestoreWallpapersCount = snapshot.size;
        snapshot.forEach(doc => {
            const wallpaper = { id: doc.id, ...doc.data() };
            if (!galleryData.find(w => String(w.id) === String(doc.id))) {
                galleryData.unshift(wallpaper);
            }
        });
        renderGallery(displayedCount);
        renderSlider();
    } catch (error) {
        console.error('Error loading Firestore wallpapers:', error);
        firestoreWallpapersCount = 0;
    }
}

// ===== STATS UI =====
function updateStats(stats) {
    if (!stats) return;
    const targets = [
        { el: document.getElementById("stat1"), target: stats.totalWallpapers, suffix: "+", format: false },
        { el: document.getElementById("stat2"), target: stats.totalDownloads, suffix: "+", format: true },
        { el: document.getElementById("stat3"), target: stats.totalCategories, suffix: "", format: false },
        { el: document.getElementById("stat4"), target: stats.activeUsers, suffix: "+", format: true },
    ];
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                targets.forEach((t) => {
                    if (!t.el) return;
                    let current = 0;
                    const step = Math.max(1, t.target / 60);
                    const interval = setInterval(() => {
                        current += step;
                        if (current >= t.target) {
                            current = t.target;
                            clearInterval(interval);
                        }
                        t.el.textContent = (t.format ? Math.floor(current).toLocaleString("pt-BR") : Math.floor(current)) + t.suffix;
                    }, 25);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    const statsSection = document.querySelector(".stats-section");
    if (statsSection) observer.observe(statsSection);
}

// ===== GALLERY & FILTERS =====
function renderGallery(count) {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;
    grid.innerHTML = "";
    const items = galleryData.slice(0, count);
    items.forEach((item) => {
        const el = document.createElement("div");
        el.className = "gallery-item animate-on-scroll";
        el.setAttribute("data-cat", (item.category || "").toLowerCase());
        el.setAttribute("data-orientation", item.orientation || "portrait");
        el.setAttribute("data-id", item.id);
        el.onclick = () => openLightbox(item.image, item.name, item.id);
        const fav = isFavorite(item.id);
        el.innerHTML = `
            <img src="${item.thumbnail || item.image}" alt="${item.name}" loading="lazy" width="400" height="600">
            <div class="gallery-overlay">
                <h4>${item.name}</h4>
                <span>${item.category} • ${item.resolution}</span>
                <div class="gallery-actions">
                    <button class="btn-download-sm" onclick="event.stopPropagation(); downloadWall('${item.name}', '${item.id}')">⬇ Download</button>
                    <button class="btn-fav ${fav ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('${item.id}')">${fav ? '♥' : '♡'}</button>
                </div>
            </div>
        `;
        grid.appendChild(el);
    });
    observeAnimations();
    applyFilters(); // Aplica filtros atuais
}

function applyFilters() {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;
    const items = grid.querySelectorAll(".gallery-item");
    items.forEach((item) => {
        const itemCat = item.getAttribute("data-cat") || "";
        const itemOrientation = item.getAttribute("data-orientation") || "portrait";
        let show = true;
        if (currentCategoryFilter !== 'all' && itemCat !== currentCategoryFilter.toLowerCase()) {
            show = false;
        }
        if (currentOrientationFilter !== 'all' && itemOrientation !== currentOrientationFilter) {
            show = false;
        }
        item.style.display = show ? "" : "none";
        if (show) {
            item.style.animation = "fadeInUp 0.5s ease";
        }
    });
}

function filterGallery(category, btn) {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    currentCategoryFilter = category;
    applyFilters();
}

function filterByOrientation(orientation, btn) {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    currentOrientationFilter = orientation;
    applyFilters();
}

function loadMore() {
    displayedCount = Math.min(displayedCount + 10, galleryData.length);
    renderGallery(displayedCount);
    if (displayedCount >= galleryData.length) {
        const btn = document.getElementById("loadMoreBtn");
        if (btn) {
            btn.textContent = t('all_loaded');
            btn.disabled = true;
            btn.style.opacity = "0.5";
        }
    }
}

// ===== LIGHTBOX =====
function openLightbox(imgSrc, title, id) {
    const lb = document.getElementById("lightbox");
    if (!lb) return;
    currentLightboxImg = imgSrc;
    currentLightboxTitle = title;
    currentLightboxId = id;
    document.getElementById("lightboxImg").src = imgSrc;
    document.getElementById("lightboxTitle").textContent = title;
    updateFavoriteButtonState();
    lb.style.display = "flex";
    requestAnimationFrame(() => {
        lb.classList.add("active");
        document.body.style.overflow = "hidden";
    });
}

function closeLightbox() {
    const lb = document.getElementById("lightbox");
    if (!lb) return;
    lb.classList.remove("active");
    setTimeout(() => {
        lb.style.display = "none";
        document.body.style.overflow = "";
    }, 400);
}

// ===== SLIDER =====
function renderSlider() {
    const track = document.getElementById("sliderTrack");
    const dotsContainer = document.getElementById("sliderDots");
    if (!track || !dotsContainer) return;
    track.innerHTML = "";
    dotsContainer.innerHTML = "";
    if (sliderImages.length === 0) return;
    const slide = sliderImages[currentSlide] || sliderImages[0];
    track.innerHTML = `
        <div class="slide-content">
            <img src="${slide.image}" alt="${slide.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22900%22 height=%22400%22%3E%3Crect fill=%22%230d3a8f%22 width=%22900%22 height=%22400%22/%3E%3Ctext fill=%22white%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3E${slide.name}%3C/text%3E%3C/svg%3E'">
            <div class="slide-info">
                <div>
                    <h3>${slide.name}</h3>
                    <p>${slide.resolution} • ${slide.category}</p>
                </div>
                <div class="slide-actions">
                    <button class="slide-btn-download" onclick="event.stopPropagation(); openLightbox('${slide.image}', '${slide.name}', '${slide.id}')">🖼️ Ver</button>
                    <button class="slide-btn-fav" onclick="event.stopPropagation(); downloadWall('${slide.name}', '${slide.id}')">⬇ Download</button>
                </div>
            </div>
        </div>
    `;
    sliderImages.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.className = `slider-dot ${index === currentSlide ? "active" : ""}`;
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });
    startAutoSlide();
}

function updateSlide() {
    const img = document.querySelector("#sliderTrack img");
    const nameEl = document.querySelector(".slide-info h3");
    const infoEl = document.querySelector(".slide-info p");
    if (!img || !nameEl || !infoEl) return;
    img.style.opacity = "0";
    setTimeout(() => {
        const slide = sliderImages[currentSlide] || sliderImages[0];
        img.src = slide.image;
        nameEl.textContent = slide.name;
        infoEl.textContent = `${slide.resolution} • ${slide.category}`;
        img.style.opacity = "1";
        document.querySelectorAll(".slider-dot").forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
    }, 300);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % sliderImages.length;
    updateSlide();
    resetAutoSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + sliderImages.length) % sliderImages.length;
    updateSlide();
    resetAutoSlide();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlide();
    resetAutoSlide();
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

function resetAutoSlide() {
    startAutoSlide();
}

// ===== MUSIC PLAYER =====
function initMusicPlayer() {
    audioPlayer = document.getElementById("audioPlayer");
    if (audioPlayer) {
        audioPlayer.volume = 0.2;
        previousVolume = 0.2;
        updateVolumeIcon();
        if (musicData.length > 0) loadTrack(currentTrackIndex);
    }
}

function loadTrack(index) {
    if (!musicData || musicData.length === 0) return;
    const track = musicData[index];
    document.getElementById("playerTitle").textContent = track.title;
    document.getElementById("playerArtist").textContent = track.artist;
    document.getElementById("playerCover").src = track.cover;
    if (audioPlayer) {
        audioPlayer.src = track.src;
        audioPlayer.load();
    }
    document.getElementById("progressBar").value = 0;
    document.getElementById("currentTime").textContent = "0:00";
    document.getElementById("duration").textContent = "0:00";
}

function togglePlay() {
    if (!audioPlayer || musicData.length === 0) return;
    const playBtn = document.getElementById("playBtn");
    if (isPlaying) {
        audioPlayer.pause();
        playBtn.textContent = "▶";
    } else {
        audioPlayer.play();
        playBtn.textContent = "⏸";
    }
    isPlaying = !isPlaying;
}

function previousTrack() {
    if (musicData.length === 0) return;
    currentTrackIndex = (currentTrackIndex - 1 + musicData.length) % musicData.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audioPlayer.play();
}

function nextTrack() {
    if (musicData.length === 0) return;
    currentTrackIndex = (currentTrackIndex + 1) % musicData.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audioPlayer.play();
}

function togglePlayer() {
    const player = document.getElementById("miniPlayer");
    const toggleBtn = document.getElementById("togglePlayerBtn");
    if (player) {
        player.classList.toggle("active");
        if (toggleBtn) toggleBtn.style.display = player.classList.contains("active") ? "none" : "flex";
    }
}

function toggleMute() {
    if (!audioPlayer) return;
    if (isMuted) {
        audioPlayer.volume = previousVolume;
        isMuted = false;
    } else {
        previousVolume = audioPlayer.volume;
        audioPlayer.volume = 0;
        isMuted = true;
    }
    updateVolumeIcon();
    const volumeBar = document.getElementById("volumeBar");
    if (volumeBar) volumeBar.value = audioPlayer.volume * 100;
}

function updateVolumeIcon() {
    const volumeIcon = document.getElementById("volumeIcon");
    if (!volumeIcon || !audioPlayer) return;
    if (isMuted || audioPlayer.volume === 0) volumeIcon.textContent = "🔇";
    else if (audioPlayer.volume < 0.5) volumeIcon.textContent = "🔉";
    else volumeIcon.textContent = "🔊";
}

function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ===== COMMENTS =====
function toggleComments() {
    const hub = document.getElementById("commentsHub");
    const toggleBtn = document.getElementById("toggleCommentsBtn");
    if (hub) {
        hub.classList.toggle("active");
        if (hub.classList.contains("active")) {
            if (toggleBtn) toggleBtn.style.display = "none";
            loadComments();
        } else {
            if (toggleBtn) toggleBtn.style.display = "flex";
        }
    }
}

async function submitComment(event) {
    event.preventDefault();
    const form = document.getElementById("commentsForm");
    const submitBtn = document.getElementById("submitBtn");
    const formStatus = document.getElementById("formStatus");
    const name = sanitizeInput(document.getElementById("commentName").value);
    const email = document.getElementById("commentEmail").value;
    const text = sanitizeInput(document.getElementById("commentText").value);
    if (!isValidEmail(email)) {
        showNotification(t('notif_invalid_email'), "error");
        return;
    }
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = t('sending_comment');
    }
    if (formStatus) {
        formStatus.style.display = "block";
        formStatus.textContent = t('sending_comment');
        formStatus.style.color = "rgba(255,255,255,0.7)";
    }
    try {
        const templateParams = {
            to_email: EMAILJS_CONFIG.toEmail,
            from_name: name,
            from_email: email,
            message: text,
        };
        const response = await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams);
        if (response.status === 200) {
            if (formStatus) {
                formStatus.textContent = t('comment_sent');
                formStatus.style.color = "#4ade80";
            }
            const comment = {
                id: Date.now(),
                name: name,
                email: email,
                text: text,
                date: new Date().toLocaleString("pt-BR"),
            };
            comments.unshift(comment);
            form.reset();
            loadComments();
            showNotification(t('notif_comment_sent'), "success");
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = t('btn_send_comment');
                }
                if (formStatus) formStatus.style.display = "none";
            }, 3000);
        }
    } catch (error) {
        console.error("EmailJS Error:", error);
        if (formStatus) {
            formStatus.textContent = t('comment_error');
            formStatus.style.color = "#f87171";
        }
        showNotification(t('notif_error_comment'), "error");
        setTimeout(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = t('btn_send_comment');
            }
        }, 3000);
    }
}

function loadComments() {
    const list = document.getElementById("commentsList");
    if (!list) return;
    if (comments.length === 0) {
        list.innerHTML = `<div class="no-comments"><p>${t('no_comments')}</p><small>${t('be_first')}</small></div>`;
        return;
    }
    list.innerHTML = comments.map((c) => `
        <div class="comment-item">
            <div class="comment-header">
                <span class="comment-name">${c.name}</span>
                <span class="comment-date">${c.date}</span>
            </div>
            <div class="comment-text">${c.text}</div>
        </div>
    `).join("");
}

// ===== DRAWER MENU =====
function toggleMenu() {
    const drawer = document.getElementById("drawerMenu");
    const overlay = document.getElementById("drawerOverlay");
    const hamburger = document.getElementById("hamburger");
    if (drawer && overlay && hamburger) {
        const isActive = drawer.classList.contains('active');
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
        hamburger.classList.toggle('active');
        if (!isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

// ===== NAVBAR & SCROLL =====
window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    const scrollTop = document.getElementById("scrollTop");
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 80);
    if (scrollTop) scrollTop.classList.toggle("visible", window.scrollY > 400);
    const sections = ["home", "gallery", "contact"];
    sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom > 200) {
                document.querySelectorAll(".drawer-link").forEach((a) => a.classList.remove("active"));
                const activeLink = document.querySelector(`.drawer-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add("active");
            }
        }
    });
}, { passive: true });

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function observeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add("animated"), index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
}

function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    const colors = {
        success: "linear-gradient(135deg, #0d3a8f, #1a6dd4)",
        error: "linear-gradient(135deg, #f5576c, #ff6b6b)",
        info: "linear-gradient(135deg, #2196F3, #1a6dd4)",
        warning: "linear-gradient(135deg, #ffa726, #ff9800)",
    };
    notification.style.cssText = `position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); background: ${colors[type] || colors.info}; color: white; padding: 16px 30px; border-radius: 12px; font-size: 0.95rem; font-weight: 600; z-index: 3000; box-shadow: 0 8px 30px rgba(0,0,0,0.3); animation: slideUp 0.4s ease;`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transition = "opacity 0.3s ease";
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    loadWallpaperData();
    observeAnimations();

    const btnLogin = document.getElementById("btnLoginNav");
    const btnSignup = document.getElementById("btnSignupNav");
    if (btnLogin) btnLogin.addEventListener("click", () => openAuthModal("login"));
    if (btnSignup) btnSignup.addEventListener("click", () => openAuthModal("signup"));

    const profileBtn = document.getElementById("profileBtn");
    if (profileBtn) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            document.getElementById("profileDropdown")?.classList.toggle("active");
        });
    }

    document.getElementById("menuProfile")?.addEventListener("click", () => {
        document.getElementById("profileDropdown")?.classList.remove("active");
        openProfileModal();
    });
    document.getElementById("menuFavorites")?.addEventListener("click", () => {
        document.getElementById("profileDropdown")?.classList.remove("active");
        openProfileModal();
        setTimeout(() => switchProfileTab("favorites"), 100);
    });
    document.getElementById("menuSettings")?.addEventListener("click", () => {
        document.getElementById("profileDropdown")?.classList.remove("active");
        openProfileModal();
        setTimeout(() => switchProfileTab("settings"), 100);
    });
    document.getElementById("menuLogout")?.addEventListener("click", () => {
        document.getElementById("profileDropdown")?.classList.remove("active");
        logout();
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".profile-container")) {
            document.getElementById("profileDropdown")?.classList.remove("active");
        }
    });

    const audioPlayerEl = document.getElementById("audioPlayer");
    if (audioPlayerEl) {
        audioPlayerEl.addEventListener("timeupdate", function () {
            if (audioPlayerEl.duration) {
                const progress = (audioPlayerEl.currentTime / audioPlayerEl.duration) * 100;
                document.getElementById("progressBar").value = progress;
                document.getElementById("currentTime").textContent = formatTime(audioPlayerEl.currentTime);
                document.getElementById("duration").textContent = formatTime(audioPlayerEl.duration);
            }
        });
        audioPlayerEl.addEventListener("ended", nextTrack);
    }
    document.getElementById("progressBar")?.addEventListener("input", function () {
        if (audioPlayerEl && audioPlayerEl.duration)
            audioPlayerEl.currentTime = (this.value / 100) * audioPlayerEl.duration;
    });
    document.getElementById("volumeBar")?.addEventListener("input", function () {
        if (audioPlayerEl) {
            audioPlayerEl.volume = this.value / 100;
            isMuted = audioPlayerEl.volume === 0;
            updateVolumeIcon();
        }
    });
    document.getElementById("lightbox")?.addEventListener("click", function (e) {
        if (e.target === this) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeLightbox();
            closeAuthModal("login");
            closeAuthModal("signup");
            closeProfileModal();
            const drawer = document.getElementById("drawerMenu");
            if (drawer && drawer.classList.contains('active')) toggleMenu();
        }
    });

    document.querySelectorAll(".drawer-link").forEach((link) => {
        link.addEventListener("click", () => {
            const drawer = document.getElementById("drawerMenu");
            if (drawer && drawer.classList.contains('active')) toggleMenu();
        });
    });
});