import { useState, useEffect } from "react";
import { toast } from "sonner@2.0.3";
import { SplashScreen } from "./components/SplashScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { AuthScreen } from "./components/AuthScreen";
import { PropertyOnboardingScreen } from "./components/PropertyOnboardingScreen";
import { HomeScreen } from "./components/HomeScreen";
import { SearchScreen } from "./components/SearchScreen";
import { MatchingScreen } from "./components/MatchingScreen";
import { MessagesScreen } from "./components/MessagesScreen";
import { ChatScreen } from "./components/ChatScreen";
import { MatchesListScreen } from "./components/MatchesListScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { EditProfileScreen } from "./components/EditProfileScreen";
import { EditPropertyScreen } from "./components/EditPropertyScreen";
import { SearchPreferencesScreen } from "./components/SearchPreferencesScreen";
import { OtherUserProfileScreen } from "./components/OtherUserProfileScreen";
import { FavoritesScreen } from "./components/FavoritesScreen";
import { AddPropertyScreen } from "./components/AddPropertyScreen";
import { PropertyDetailScreen } from "./components/PropertyDetailScreen";
import { SwitchPassScreen } from "./components/SwitchPassScreen";
import { BottomNavigation } from "./components/BottomNavigation";
import { Toaster } from "./components/ui/sonner";
import { cn } from "./components/ui/utils";
import { 
  authApi, 
  profileApi, 
  switchPassApi, 
  favoritesApi, 
  conversationApi,
  searchHistoryApi 
} from "./utils/api";

type AppScreen = "splash" | "onboarding" | "auth" | "propertyOnboarding" | "home" | "search" | "matches" | "messages" | "profile" | "property" | "editProfile" | "editProperty" | "searchPreferences" | "otherUserProfile" | "favorites" | "addProperty" | "chat" | "matchesList" | "switchPass";
type NavigationTab = "home" | "search" | "matches" | "messages" | "profile";

interface Match {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  propertyId: string;
  propertyTitle: string;
  compatibility: number;
  timestamp: Date;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  property: string;
  matchId?: string;
}

interface UserData {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  profession?: string;
  bio?: string;
  avatar?: string;
  hasCompletedPropertySetup: boolean;
  switchPassBalance?: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("splash");
  const [activeTab, setActiveTab] = useState<NavigationTab>("home");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userCompatibilityScore, setUserCompatibilityScore] = useState<number | undefined>(undefined);
  const [isDark, setIsDark] = useState(true); // Mode sombre par défaut pour style SwitchAppart néon
  const [likedProperties, setLikedProperties] = useState<string[]>([]); // Global liked properties state
  const [matches, setMatches] = useState<Match[]>([]); // Global matches state
  const [conversations, setConversations] = useState<Conversation[]>([]); // Global conversations state
  
  // État global pour la recherche
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>(""); // État global de recherche
  const [searchHistory, setSearchHistory] = useState<string[]>([]); // Historique des recherches

  // États utilisateur
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Vérifier si c'est la première fois au démarrage
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('switchappart_has_seen_onboarding');
    if (hasSeenOnboarding === 'true') {
      setIsFirstTime(false);
    }
  }, []);

  // Initialize with some sample conversations and matches only for demo
  useEffect(() => {
    // Les conversations seront chargées depuis le backend pour les vrais utilisateurs
    // Initialize some sample matches
    const initialMatches: Match[] = [
      {
        id: "match-1",
        userId: "user-1",
        userName: "Marie Dubois",
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjIwODI0MXww&ixlib=rb-4.1.0&q=80&w=1080",
        propertyId: "prop-marie-1",
        propertyTitle: "Penthouse Invalides",
        compatibility: 94,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      },
      {
        id: "match-2",
        userId: "user-2",
        userName: "Thomas Martin",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTYyMDgyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
        propertyId: "prop-thomas-1",
        propertyTitle: "Loft République",
        compatibility: 87,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
      }
    ];
    setMatches(initialMatches);
    
    // Charger l'historique de recherche depuis le localStorage
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Apply theme to document - Force dark mode by default
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [isDark]);

  // Force dark mode initially for SwitchAppart neon style
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
  }, []);

  // Sauvegarder l'historique de recherche
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Use global dark mode setting for all screens
  const shouldBeDark = () => {
    return isDark;
  };

  // Helper pour vérifier si un token ressemble à un JWT valide
  const isValidJWTFormat = (token: string): boolean => {
    // Un JWT valide a 3 parties séparées par des points
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  };

  // Nettoyer les données de session
  const clearSession = () => {
    console.log('🧹 Nettoyage de la session');
    localStorage.removeItem('switchappart_token');
    localStorage.removeItem('switchappart_user');
    localStorage.removeItem('switchappart_users');
    setIsAuthenticated(false);
    setUserData(null);
    setAccessToken(null);
    setLikedProperties([]);
    setConversations([]);
    setSearchHistory([]);
  };

  // Charger les données depuis le backend au démarrage si authentifié
  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem('switchappart_token');
      const userStr = localStorage.getItem('switchappart_user');
      
      if (!token || !userStr) {
        // Pas de session, rien à charger
        return;
      }

      // Vérifier d'abord si le token a un format JWT valide
      if (!isValidJWTFormat(token)) {
        console.log('❌ Token invalide (mauvais format), nettoyage...');
        clearSession();
        setTimeout(() => {
          toast.error("Session invalide, veuillez vous reconnecter");
        }, 500);
        return;
      }
      
      try {
        const user = JSON.parse(userStr);
        
        // Vérifier d'abord si le token est valide en appelant l'API de profil
        try {
          const profileData = await profileApi.get(token);
          
          if (profileData.success && profileData.profile) {
            // Token valide, charger les données
            console.log('Token valide, chargement des données utilisateur');
            
            // Créer l'objet utilisateur complet avec les données du profil
            const completeUser: UserData = {
              id: user.id,
              email: profileData.profile.email,
              full_name: profileData.profile.full_name,
              phone: profileData.profile.phone,
              date_of_birth: profileData.profile.date_of_birth,
              profession: profileData.profile.profession,
              bio: profileData.profile.bio,
              avatar: profileData.profile.avatar_url,
              hasCompletedPropertySetup: profileData.profile.hasCompletedPropertySetup || false,
              switchPassBalance: profileData.profile.switchPassBalance || 0
            };
            
            setUserData(completeUser);
            setAccessToken(token);
            setIsAuthenticated(true);
            setIsFirstTime(false);
            localStorage.setItem('switchappart_user', JSON.stringify(completeUser));
            
            // Charger toutes les données en parallèle
            const [favoritesData, conversationsData, historyData] = await Promise.allSettled([
              favoritesApi.getAll(token),
              conversationApi.getAll(token),
              searchHistoryApi.getAll(token)
            ]);
            
            if (favoritesData.status === 'fulfilled' && favoritesData.value.success) {
              setLikedProperties(favoritesData.value.favorites);
            } else if (favoritesData.status === 'rejected') {
              console.error('Erreur chargement favoris:', favoritesData.reason);
            }
            
            if (conversationsData.status === 'fulfilled' && conversationsData.value.success) {
              setConversations(conversationsData.value.conversations);
            } else if (conversationsData.status === 'rejected') {
              console.error('Erreur chargement conversations:', conversationsData.reason);
            }
            
            if (historyData.status === 'fulfilled' && historyData.value.success) {
              setSearchHistory(historyData.value.history);
            } else if (historyData.status === 'rejected') {
              console.error('Erreur chargement historique:', historyData.reason);
            }
            
          } else {
            // Token invalide, nettoyer et forcer reconnexion
            console.log('❌ Token invalide détecté (échec validation profil)');
            clearSession();
            setTimeout(() => {
              toast.error("Votre session a expiré, veuillez vous reconnecter");
            }, 500);
          }
        } catch (error: any) {
          // Erreur lors de la validation du token
          console.log('❌ Erreur validation token:', error.message);
          
          // Nettoyer dans tous les cas d'erreur
          clearSession();
          setTimeout(() => {
            toast.error("Votre session a expiré, veuillez vous reconnecter");
          }, 500);
        }
        
      } catch (error) {
        console.error('Erreur lors de la lecture des données utilisateur:', error);
        localStorage.removeItem('switchappart_token');
        localStorage.removeItem('switchappart_user');
        localStorage.removeItem('switchappart_users');
      }
    };
    
    loadUserData();
  }, []);

  const handleSplashComplete = () => {
    if (isFirstTime && !isAuthenticated) {
      setCurrentScreen("onboarding");
    } else if (!isAuthenticated) {
      setCurrentScreen("auth");
    } else if (userData && !userData.hasCompletedPropertySetup) {
      setCurrentScreen("propertyOnboarding");
    } else {
      setCurrentScreen("home");
    }
  };

  const handleOnboardingComplete = () => {
    setIsFirstTime(false);
    localStorage.setItem('switchappart_has_seen_onboarding', 'true');
    setCurrentScreen("auth");
  };

  const handleAuthComplete = async (user: UserData, token: string) => {
    setIsAuthenticated(true);
    setUserData(user);
    setAccessToken(token);
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('switchappart_token', token);
    localStorage.setItem('switchappart_user', JSON.stringify(user));
    
    // Charger les données utilisateur depuis le backend
    try {
      const [favoritesData, conversationsData, historyData, switchPassData] = await Promise.allSettled([
        favoritesApi.getAll(token),
        conversationApi.getAll(token),
        searchHistoryApi.getAll(token),
        switchPassApi.get(token)
      ]);
      
      if (favoritesData.status === 'fulfilled' && favoritesData.value.success) {
        setLikedProperties(favoritesData.value.favorites);
      } else if (favoritesData.status === 'rejected') {
        console.error('Erreur chargement favoris:', favoritesData.reason);
      }
      
      if (conversationsData.status === 'fulfilled' && conversationsData.value.success) {
        setConversations(conversationsData.value.conversations);
      } else if (conversationsData.status === 'rejected') {
        console.error('Erreur chargement conversations:', conversationsData.reason);
      }
      
      if (historyData.status === 'fulfilled' && historyData.value.success) {
        setSearchHistory(historyData.value.history);
      } else if (historyData.status === 'rejected') {
        console.error('Erreur chargement historique:', historyData.reason);
      }
      
      if (switchPassData.status === 'fulfilled' && switchPassData.value.success) {
        const updatedUser = {...user, switchPassBalance: switchPassData.value.balance};
        setUserData(updatedUser);
        localStorage.setItem('switchappart_user', JSON.stringify(updatedUser));
      } else if (switchPassData.status === 'rejected') {
        console.error('Erreur chargement SwitchPass:', switchPassData.reason);
      }
    } catch (error) {
      console.error('Erreur chargement données utilisateur:', error);
    }
    
    // Vérifier si l'utilisateur a configuré sa propriété (avec valeur par défaut si non défini)
    if (!user?.hasCompletedPropertySetup) {
      setCurrentScreen("propertyOnboarding");
    } else {
      setCurrentScreen("home");
    }
  };

  const handlePropertyOnboardingComplete = () => {
    // Marquer la configuration comme terminée
    if (userData) {
      const updatedUser = { ...userData, hasCompletedPropertySetup: true };
      setUserData(updatedUser);
      localStorage.setItem('switchappart_user', JSON.stringify(updatedUser));
    }
    setCurrentScreen("home");
  };

  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setCurrentScreen("property");
  };

  const handleThemeToggle = () => {
    setIsDark(prev => !prev);
  };

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    // For matches tab, go to swipe screen, not matches list
    setCurrentScreen(tab);
  };

  const handlePropertyBack = () => {
    setCurrentScreen(activeTab);
    setSelectedPropertyId(null);
  };

  const handlePropertyContact = () => {
    // Switch to messages screen when contact is initiated
    setActiveTab("messages");
    setCurrentScreen("messages");
    setSelectedPropertyId(null);
  };

  const handleEditProfile = () => {
    setCurrentScreen("editProfile");
  };

  const handleEditProfileBack = () => {
    setCurrentScreen("profile");
  };

  const handleEditProfileSave = async (profileData: any) => {
    if (!accessToken || !userData) return;
    
    try {
      // Transformer les données du formulaire en format backend
      const updatedData = {
        full_name: `${profileData.personal.firstName} ${profileData.personal.lastName}`,
        email: profileData.personal.email,
        phone: profileData.personal.phone,
        profession: profileData.personal.profession,
        bio: profileData.personal.bio,
        avatar_url: profileData.personal.avatar
      };
      
      // Appel API pour mettre à jour le profil
      const response = await profileApi.update(accessToken, updatedData);
      
      if (response.success) {
        // Mettre à jour les données locales
        const updatedUser = {
          ...userData,
          full_name: updatedData.full_name,
          email: updatedData.email,
          phone: updatedData.phone,
          profession: updatedData.profession,
          bio: updatedData.bio,
          avatar: updatedData.avatar_url
        };
        
        setUserData(updatedUser);
        localStorage.setItem('switchappart_user', JSON.stringify(updatedUser));
        
        toast.success("Profil mis à jour avec succès !");
        setCurrentScreen("profile");
      } else {
        toast.error("Erreur lors de la mise à jour du profil");
      }
    } catch (error) {
      console.error("Erreur mise à jour profil:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  const handleEditProperty = () => {
    setCurrentScreen("editProperty");
  };

  const handleEditPropertyBack = () => {
    setCurrentScreen("profile");
  };

  const handleEditPropertySave = (propertyData: any) => {
    // Save property data (normally would call API here)
    console.log("Saving property data:", propertyData);
    
    // Show success feedback and return to profile
    setCurrentScreen("profile");
    
    // Optional: Show toast notification for successful save
    // toast.success("Logement mis à jour avec succès !");
  };

  // Handle viewing other user profile
  const handleViewUserProfile = (userId: string, compatibilityScore?: number) => {
    setSelectedUserId(userId);
    setUserCompatibilityScore(compatibilityScore);
    setCurrentScreen("otherUserProfile");
  };

  const handleOtherUserProfileBack = () => {
    setSelectedUserId(null);
    setUserCompatibilityScore(undefined);
    setCurrentScreen(activeTab);
  };

  const handleStartConversationFromProfile = (userId: string) => {
    // Check if conversation already exists for this user
    const existingConversation = conversations.find(conv => 
      conv.name === getUserNameById(userId)
    );
    
    if (existingConversation) {
      // Open existing conversation
      setSelectedConversationId(existingConversation.id);
      setCurrentScreen("chat");
    } else {
      // Create new conversation
      const userData = getUserDataById(userId);
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        name: userData.name,
        avatar: userData.avatar,
        lastMessage: "Conversation créée",
        timestamp: "Maintenant",
        unread: 0,
        online: Math.random() > 0.5,
        property: userData.properties?.[0]?.title || "Logement",
      };

      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversationId(newConversation.id);
      setSelectedUserId(null);
      setUserCompatibilityScore(undefined);
      setCurrentScreen("chat");
    }
  };

  // Helper functions to get user data
  const getUserNameById = (userId: string): string => {
    const userData = getUserDataById(userId);
    return userData.name;
  };

  const getUserDataById = (userId: string) => {
    const profiles = {
      "user-1": {
        name: "Marie Dubois",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjIwODI0MXww&ixlib=rb-4.1.0&q=80&w=1080",
        properties: [{ title: "Penthouse Invalides" }]
      },
      "user-2": {
        name: "Thomas Martin",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTYyMDgyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
        properties: [{ title: "Loft République" }]
      }
    };
    return profiles[userId as keyof typeof profiles] || profiles["user-1"];
  };

  // Global function to handle favorites
  const handleToggleLike = async (propertyId: string) => {
    if (!accessToken) {
      toast.error("Vous devez être connecté pour ajouter des favoris");
      return;
    }

    const isLiked = likedProperties.includes(propertyId);
    
    // Optimistic update
    setLikedProperties(prev =>
      isLiked
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );

    try {
      if (isLiked) {
        await favoritesApi.remove(accessToken, propertyId);
      } else {
        await favoritesApi.add(accessToken, propertyId);
      }
    } catch (error) {
      console.error('Erreur synchronisation favori:', error);
      // Revert on error
      setLikedProperties(prev =>
        isLiked
          ? [...prev, propertyId]
          : prev.filter(id => id !== propertyId)
      );
      toast.error("Erreur lors de la synchronisation");
    }
  };

  // Navigation to favorites
  const handleShowFavorites = () => {
    setCurrentScreen("favorites");
  };

  const handleFavoritesBack = () => {
    setCurrentScreen("home");
  };

  // Navigation to add property
  const handleAddProperty = () => {
    setCurrentScreen("addProperty");
  };

  const handleAddPropertyBack = () => {
    setCurrentScreen("home");
  };

  const handleAddPropertySubmit = (propertyData: any) => {
    // Handle property submission (normally would call API here)
    console.log("Submitting property:", propertyData);
    
    // Show success feedback and return to home
    setCurrentScreen("home");
    
    // Optional: Show toast notification for successful submission
    // toast.success("Votre logement a été ajouté avec succès !");
  };

  // Navigate to matches screen
  const handleShowMatches = () => {
    setCurrentScreen("matchesList");
  };

  // Navigate to search screen - NOUVELLE FONCTION avec requête optionnelle
  const handleSearchClick = async (searchQuery?: string) => {
    if (searchQuery && searchQuery.trim()) {
      setGlobalSearchQuery(searchQuery);
      // Ajouter à l'historique si ce n'est pas déjà présent
      if (!searchHistory.includes(searchQuery)) {
        setSearchHistory(prev => [searchQuery, ...prev.slice(0, 9)]); // Garder max 10 entrées
        
        // Synchroniser avec le backend si authentifié
        if (accessToken) {
          try {
            await searchHistoryApi.add(accessToken, searchQuery);
          } catch (error) {
            console.error('Erreur ajout historique:', error);
          }
        }
      }
    }
    setActiveTab("search");
    setCurrentScreen("search");
  };

  // Fonction pour effectuer une recherche depuis n'importe où
  const handlePerformSearch = async (query: string) => {
    if (query.trim()) {
      setGlobalSearchQuery(query);
      // Ajouter à l'historique
      if (!searchHistory.includes(query)) {
        setSearchHistory(prev => [query, ...prev.slice(0, 9)]);
        
        // Synchroniser avec le backend si authentifié
        if (accessToken) {
          try {
            await searchHistoryApi.add(accessToken, query);
          } catch (error) {
            console.error('Erreur ajout historique:', error);
          }
        }
      }
      // Naviguer vers la page de recherche
      setActiveTab("search");
      setCurrentScreen("search");
    }
  };

  // Effacer l'historique de recherche
  const handleClearSearchHistory = () => {
    setSearchHistory([]);
  };

  // Navigate to matches swipe screen from tab
  const handleMatchesTabClick = () => {
    setActiveTab("matches");
    setCurrentScreen("matches");
  };

  // Handle new match creation - automatically creates a conversation
  const handleNewMatch = (matchData: {
    userId: string;
    userName: string;
    userAvatar: string;
    propertyId: string;
    propertyTitle: string;
    compatibility: number;
  }) => {
    const newMatch: Match = {
      id: `match-${Date.now()}`,
      ...matchData,
      timestamp: new Date()
    };

    // Add to matches
    setMatches(prev => [newMatch, ...prev]);

    // Automatically create a conversation
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      name: matchData.userName,
      avatar: matchData.userAvatar,
      lastMessage: `Nouveau match ! Compatibilité ${matchData.compatibility}% 🎉`,
      timestamp: "Maintenant",
      unread: 1,
      online: Math.random() > 0.5, // Random online status
      property: matchData.propertyTitle,
      matchId: newMatch.id
    };

    setConversations(prev => [newConversation, ...prev]);

    // Show notification badge on messages tab
    // This could trigger a toast notification in a real app
    console.log(`Nouveau match avec ${matchData.userName} !`);
  };

  // Handle conversation selection
  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setCurrentScreen("chat");
  };

  // Handle chat back
  const handleChatBack = () => {
    setSelectedConversationId(null);
    setActiveTab("messages");
    setCurrentScreen("messages");
  };

  // Handle matches list back
  const handleMatchesListBack = () => {
    setCurrentScreen(activeTab);
  };

  // Handle start conversation from match
  const handleStartConversation = (match: Match) => {
    // Check if conversation already exists for this match
    const existingConversation = conversations.find(conv => conv.matchId === match.id);
    
    if (existingConversation) {
      // Open existing conversation
      setSelectedConversationId(existingConversation.id);
      setCurrentScreen("chat");
    } else {
      // Create new conversation
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        name: match.userName,
        avatar: match.userAvatar,
        lastMessage: "Conversation créée",
        timestamp: "Maintenant",
        unread: 0,
        online: Math.random() > 0.5,
        property: match.propertyTitle,
        matchId: match.id
      };

      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversationId(newConversation.id);
      setCurrentScreen("chat");
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear session data
    clearSession();
    
    // Navigate to auth screen
    setCurrentScreen("auth");
    setActiveTab("home");
    setMatches([]);
    
    // Optional: Reset other states
    setMatches([]);
    setConversations([]);
    setLikedProperties([]);
  };

  // Handle SwitchPass navigation
  const handleOpenSwitchPass = () => {
    setCurrentScreen("switchPass");
  };

  const handleSwitchPassBack = () => {
    setCurrentScreen("profile");
  };

  const handleSwitchPassPurchase = () => {
    // Simulate purchase and add SwitchPass to user balance
    if (userData) {
      const currentBalance = userData.switchPassBalance || 0;
      const updatedUser = { ...userData, switchPassBalance: currentBalance + 1 };
      setUserData(updatedUser);
      localStorage.setItem('switchappart_user', JSON.stringify(updatedUser));
      
      // Show success notification and go back
      toast.success("SwitchPass acheté avec succès !", {
        description: "Vous pouvez maintenant débloquer un logement avec votre nouveau Pass.",
        duration: 4000,
      });
      setCurrentScreen("profile");
    }
  };

  const handleUseSwitchPass = () => {
    if (userData && (userData.switchPassBalance || 0) > 0) {
      // Deduct one SwitchPass
      const updatedUser = { ...userData, switchPassBalance: (userData.switchPassBalance || 0) - 1 };
      setUserData(updatedUser);
      localStorage.setItem('switchappart_user', JSON.stringify(updatedUser));
      
      toast.success("SwitchPass utilisé avec succès !", {
        description: "Ce logement est maintenant déverrouillé. Vous pouvez finaliser l'échange.",
        duration: 4000,
      });
      handlePropertyContact();
    } else {
      toast.error("Aucun SwitchPass disponible", {
        description: "Achetez un SwitchPass ou cédez votre logement pour en obtenir un.",
        duration: 4000,
      });
    }
  };

  const handleDirectExchange = () => {
    toast.success("Échange direct initié !", {
      description: "Vous serez contacté pour finaliser l'échange mutuel de logements.",
      duration: 4000,
    });
    handlePropertyContact();
  };

  // Show bottom navigation on ALL pages except splash, onboarding, auth, propertyOnboarding, chat, switchPass and edit screens
  const showBottomNavigation = !["splash", "onboarding", "auth", "propertyOnboarding", "chat", "editProfile", "editProperty", "otherUserProfile", "switchPass"].includes(currentScreen);

  const renderScreen = () => {
    const screenIsDark = shouldBeDark();
    
    switch (currentScreen) {
      case "splash":
        return <SplashScreen onComplete={handleSplashComplete} />;
      
      case "onboarding":
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      
      case "auth":
        return <AuthScreen onComplete={handleAuthComplete} isDark={isDark} />;
      
      case "propertyOnboarding":
        return <PropertyOnboardingScreen onComplete={handlePropertyOnboardingComplete} isDark={isDark} />;
      
      case "home":
        return (
          <HomeScreen 
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
            onPropertySelect={handlePropertySelect}
            likedProperties={likedProperties}
            onToggleLike={handleToggleLike}
            onShowFavorites={handleShowFavorites}
            onAddProperty={handleAddProperty}
            onShowMatches={handleShowMatches}
            onSearchClick={handleSearchClick}
            onPerformSearch={handlePerformSearch}
            searchHistory={searchHistory}
            matchesCount={matches.length}
            userData={userData}
          />
        );
      
      case "search":
        return (
          <SearchScreen 
            onPropertySelect={handlePropertySelect}
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
            likedProperties={likedProperties}
            onToggleLike={handleToggleLike}
            onShowMatches={handleShowMatches}
            onSearchClick={handleSearchClick}
            initialSearchQuery={globalSearchQuery}
            searchHistory={searchHistory}
            onClearSearchHistory={handleClearSearchHistory}
            matchesCount={matches.length}
          />
        );

      case "matches":
        return (
          <MatchingScreen
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
            onPropertySelect={handlePropertySelect}
            onNewMatch={handleNewMatch}
            onShowMatches={handleShowMatches}
            matchesCount={matches.length}
          />
        );

      case "messages":
        return (
          <MessagesScreen
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
            conversations={conversations}
            onShowMatches={handleShowMatches}
            matchesCount={matches.length}
            onConversationSelect={handleConversationSelect}
            onViewUserProfile={handleViewUserProfile}
          />
        );

      case "chat":
        const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);
        if (!selectedConversation) {
          // Fallback to messages if conversation not found
          setCurrentScreen("messages");
          return null;
        }
        return (
          <ChatScreen
            conversationId={selectedConversationId!}
            conversation={selectedConversation}
            isDark={isDark}
            onBack={handleChatBack}
            onThemeToggle={handleThemeToggle}
            onShowMatches={handleShowMatches}
            matchesCount={matches.length}
          />
        );

      case "matchesList":
        return (
          <MatchesListScreen
            matches={matches}
            isDark={isDark}
            onBack={handleMatchesListBack}
            onThemeToggle={handleThemeToggle}
            onPropertySelect={handlePropertySelect}
            onStartConversation={handleStartConversation}
            onViewUserProfile={handleViewUserProfile}
            onShowMatches={handleShowMatches}
            matchesCount={matches.length}
          />
        );

      case "profile":
        return (
          <ProfileScreen
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
            onEditProfile={handleEditProfile}
            onEditProperty={handleEditProperty}
            onShowMatches={handleShowMatches}
            matchesCount={matches.length}
            onLogout={handleLogout}
            userData={userData}
            onOpenSwitchPass={handleOpenSwitchPass}
          />
        );

      case "editProfile":
        return (
          <EditProfileScreen
            isDark={isDark}
            onBack={handleEditProfileBack}
            onSave={handleEditProfileSave}
            onThemeToggle={handleThemeToggle}
            onShowMatches={handleShowMatches}
            matchesCount={matches.length}
            userData={userData}
          />
        );

      case "editProperty":
        return (
          <EditPropertyScreen
            isDark={isDark}
            onBack={handleEditPropertyBack}
            onSave={handleEditPropertySave}
            onThemeToggle={handleThemeToggle}
            onShowMatches={handleShowMatches}
            matchesCount={matches.length}
          />
        );

      case "otherUserProfile":
        if (!selectedUserId) {
          // Fallback if no user selected
          setCurrentScreen("home");
          return null;
        }
        return (
          <OtherUserProfileScreen
            userId={selectedUserId}
            isDark={isDark}
            onBack={handleOtherUserProfileBack}
            onStartConversation={handleStartConversationFromProfile}
            onThemeToggle={handleThemeToggle}
            onShowMatches={handleShowMatches}
            onPropertySelect={handlePropertySelect}
            matchesCount={matches.length}
            compatibilityScore={userCompatibilityScore}
          />
        );

      case "favorites":
        return (
          <FavoritesScreen
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
            onPropertySelect={handlePropertySelect}
            onBack={handleFavoritesBack}
            likedProperties={likedProperties}
            onToggleLike={handleToggleLike}
            onShowMatches={handleShowMatches}
            matchesCount={matches.length}
          />
        );

      case "addProperty":
        return (
          <AddPropertyScreen
            isDark={isDark}
            onBack={handleAddPropertyBack}
            onSubmit={handleAddPropertySubmit}
            onThemeToggle={handleThemeToggle}
            onShowMatches={handleShowMatches}
            matchesCount={matches.length}
          />
        );
      
      case "property":
        return (
          <PropertyDetailScreen
            propertyId={selectedPropertyId || "featured-1"}
            isDark={screenIsDark}
            onBack={handlePropertyBack}
            onContact={handlePropertyContact}
            liked={likedProperties.includes(selectedPropertyId || "featured-1")}
            onToggleLike={() => handleToggleLike(selectedPropertyId || "featured-1")}
            onThemeToggle={handleThemeToggle}
            onViewUserProfile={handleViewUserProfile}
            switchPassBalance={userData?.switchPassBalance || 0}
            onUseSwitchPass={handleUseSwitchPass}
            onDirectExchange={handleDirectExchange}
          />
        );
      
      case "switchPass":
        return (
          <SwitchPassScreen
            isDark={isDark}
            onBack={handleSwitchPassBack}
            onThemeToggle={handleThemeToggle}
            onPurchase={handleSwitchPassPurchase}
            currentBalance={userData?.switchPassBalance || 0}
          />
        );
      
      default:
        return (
          <HomeScreen 
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
            onPropertySelect={handlePropertySelect}
            likedProperties={likedProperties}
            onToggleLike={handleToggleLike}
            onShowFavorites={handleShowFavorites}
            onAddProperty={handleAddProperty}
            onShowMatches={handleShowMatches}
            onSearchClick={handleSearchClick}
            onPerformSearch={handlePerformSearch}
            searchHistory={searchHistory}
            matchesCount={matches.length}
          />
        );
    }
  };

  const getBackgroundClass = () => {
    // Mode sombre : fond dégradé SwitchAppart avec effets néon
    if (currentScreen === "editProfile") {
      return isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20"
        : "bg-gray-50"; // Fond légèrement gris pour l'édition
    }
    if (currentScreen === "editProperty") {
      return isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-orange-900/20"
        : "bg-gray-50"; // Fond légèrement gris pour l'édition
    }
    if (currentScreen === "otherUserProfile") {
      return isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20"
        : "bg-white";
    }
    if (currentScreen === "matches") {
      return isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20"
        : "bg-white";
    }
    if (currentScreen === "profile") {
      return isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-blue-900/20"
        : "bg-white";
    }
    if (currentScreen === "favorites") {
      return isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-red-900/20"
        : "bg-white";
    }
    if (currentScreen === "addProperty") {
      return isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-green-900/20"
        : "bg-gray-50"; // Fond légèrement gris pour les formulaires
    }
    if (currentScreen === "auth") {
      return "bg-dark-bg"; // Toujours sombre pour l'authentification
    }
    if (currentScreen === "property") {
      return shouldBeDark() 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20"
        : "bg-white";
    }
    if (currentScreen === "chat") {
      return isDark ? "bg-dark-bg" : "bg-gray-50";
    }
    if (currentScreen === "matchesList") {
      return isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20"
        : "bg-white";
    }
    // Par défaut : mode sombre avec dégradé SwitchAppart
    return isDark ? "bg-gradient-to-br from-dark-bg via-dark-bg to-blue-900/20" : "bg-white";
  };

  return (
    <>
      <Toaster 
        theme={isDark ? "dark" : "light"}
        position="top-center"
        richColors
      />
      <div className={cn(
        "min-h-screen transition-all duration-500",
        getBackgroundClass()
      )}>
        {renderScreen()}
        
        {/* Bottom Navigation - Now shown on ALL pages except splash, onboarding and chat */}
        {showBottomNavigation && (
          <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isDark={shouldBeDark()}
        />
      )}
    </div>
    </>
  );
}