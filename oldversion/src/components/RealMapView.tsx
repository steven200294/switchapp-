import { useEffect, useRef, useState } from "react";
import { cn } from "./ui/utils";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  lat?: number;
  lng?: number;
  category: string;
  liked?: boolean;
}

interface RealMapViewProps {
  properties: Property[];
  isDark: boolean;
  onPropertySelect?: (propertyId: string) => void;
  selectedCategory?: string | null;
  likedProperties?: string[];
  onToggleLike?: (propertyId: string) => void;
  className?: string;
}

// Données réelles de logements à Paris avec coordonnées GPS précises
const parisProperties: Property[] = [
  {
    id: "paris-1",
    title: "Appartement moderne Châtelet",
    location: "1er arrondissement",
    price: "2800€",
    lat: 48.8566,
    lng: 2.3477,
    category: "new"
  },
  {
    id: "paris-2", 
    title: "Studio République",
    location: "11ème arrondissement",
    price: "1400€",
    lat: 48.8676,
    lng: 2.3639,
    category: "nearby"
  },
  {
    id: "paris-3",
    title: "Loft Bastille",
    location: "12ème arrondissement", 
    price: "2200€",
    lat: 48.8532,
    lng: 2.3691,
    category: "available-now"
  },
  {
    id: "paris-4",
    title: "Penthouse Montparnasse",
    location: "14ème arrondissement",
    price: "3500€",
    lat: 48.8386,
    lng: 2.3266,
    category: "new"
  },
  {
    id: "paris-5",
    title: "Appartement Belleville",
    location: "20ème arrondissement",
    price: "1800€",
    lat: 48.8720,
    lng: 2.3984,
    category: "nearby"
  },
  {
    id: "paris-6",
    title: "Studio Invalides",
    location: "7ème arrondissement",
    price: "2600€",
    lat: 48.8560,
    lng: 2.3126,
    category: "available-now"
  },
  {
    id: "paris-7",
    title: "Duplex Marais",
    location: "4ème arrondissement",
    price: "3200€",
    lat: 48.8566,
    lng: 2.3522,
    category: "new"
  },
  {
    id: "paris-8",
    title: "T2 Pigalle",
    location: "9ème arrondissement",
    price: "1900€",
    lat: 48.8814,
    lng: 2.3372,
    category: "nearby"
  }
];

// Fonction pour obtenir des coordonnées par défaut selon la ville
const getDefaultCoordinates = (location: string): { lat: number; lng: number } => {
  const locationLower = location.toLowerCase();
  
  // Paris par arrondissement
  if (locationLower.includes('1er') || locationLower.includes('châtelet') || locationLower.includes('louvre')) {
    return { lat: 48.8566, lng: 2.3477 };
  }
  if (locationLower.includes('2ème') || locationLower.includes('2e') || locationLower.includes('bourse')) {
    return { lat: 48.8698, lng: 2.3398 };
  }
  if (locationLower.includes('5ème') || locationLower.includes('5e') || locationLower.includes('panthéon') || locationLower.includes('latin')) {
    return { lat: 48.8462, lng: 2.3372 };
  }
  if (locationLower.includes('20ème') || locationLower.includes('20e') || locationLower.includes('belleville')) {
    return { lat: 48.8720, lng: 2.3984 };
  }
  
  // Lyon par quartier
  if (locationLower.includes('lyon') || locationLower.includes('presqu\'île') || locationLower.includes('bellecour')) {
    return { lat: 45.7640, lng: 4.8357 };
  }
  if (locationLower.includes('part-dieu')) {
    return { lat: 45.7606, lng: 4.8626 };
  }
  if (locationLower.includes('vieux lyon')) {
    return { lat: 45.7608, lng: 4.8270 };
  }
  if (locationLower.includes('croix-rousse')) {
    return { lat: 45.7745, lng: 4.8319 };
  }
  if (locationLower.includes('villeurbanne')) {
    return { lat: 45.7663, lng: 4.8795 };
  }
  if (locationLower.includes('confluence')) {
    return { lat: 45.7424, lng: 4.8183 };
  }
  if (locationLower.includes('bron')) {
    return { lat: 45.7361, lng: 4.9111 };
  }
  if (locationLower.includes('guillotière')) {
    return { lat: 45.7539, lng: 4.8433 };
  }
  if (locationLower.includes('caluire')) {
    return { lat: 45.7974, lng: 4.8506 };
  }
  
  // Paris par défaut si contient "paris"
  if (locationLower.includes('paris')) {
    return { lat: 48.8566, lng: 2.3522 };
  }
  
  // Lyon par défaut si contient "lyon"  
  if (locationLower.includes('lyon')) {
    return { lat: 45.7640, lng: 4.8357 };
  }
  
  // Coordonnées par défaut (centre de Paris)
  return { lat: 48.8566, lng: 2.3522 };
};

export function RealMapView({ 
  properties = [], 
  isDark, 
  onPropertySelect, 
  selectedCategory,
  likedProperties = [],
  onToggleLike,
  className 
}: RealMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Enrichir les propriétés avec des coordonnées par défaut si manquantes
  const enrichedProperties = properties.length > 0 
    ? properties.map(property => {
        if (typeof property.lat === 'number' && typeof property.lng === 'number' && 
            !isNaN(property.lat) && !isNaN(property.lng)) {
          return property;
        }
        
        const defaultCoords = getDefaultCoordinates(property.location);
        return {
          ...property,
          lat: defaultCoords.lat,
          lng: defaultCoords.lng
        };
      })
    : parisProperties;

  // Filtrer les propriétés selon la catégorie sélectionnée
  const filteredProperties = selectedCategory 
    ? enrichedProperties.filter(prop => prop.category === selectedCategory)
    : enrichedProperties;

  // Initialiser Leaflet
  useEffect(() => {
    // Charger Leaflet CSS et JS dynamiquement
    const loadLeaflet = async () => {
      // Vérifier si Leaflet est déjà chargé
      if (typeof window !== 'undefined' && !(window as any).L) {
        // Charger CSS Leaflet
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(cssLink);

        // Charger JS Leaflet
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else if ((window as any).L) {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = (window as any).L;
      
      try {
        // Créer la carte centrée sur Paris
        const map = L.map(mapRef.current, {
          center: [48.8566, 2.3522], // Centre de Paris
          zoom: 12,
          zoomControl: false,
          attributionControl: false
        });

        // Ajouter les tuiles OpenStreetMap avec style adaptatif
        const tileLayer = isDark 
          ? L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
              attribution: '© OpenStreetMap contributors'
            })
          : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            });
        
        tileLayer.addTo(map);

        // Ajouter contrôles de zoom personnalisés
        L.control.zoom({
          position: 'topright'
        }).addTo(map);

        mapInstanceRef.current = map;
        updateMarkers();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte:', error);
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          console.error('Erreur lors du nettoyage de la carte:', error);
        }
      }
    };
  }, [isDark]);

  // Mettre à jour les marqueurs
  const updateMarkers = () => {
    if (!mapInstanceRef.current) return;

    const L = (window as any).L;
    
    try {
      // Supprimer les anciens marqueurs
      markersRef.current.forEach(marker => {
        try {
          mapInstanceRef.current.removeLayer(marker);
        } catch (error) {
          console.warn('Erreur lors de la suppression d\'un marqueur:', error);
        }
      });
      markersRef.current = [];

      // Couleurs par catégorie
      const colors = {
        'new': { color: '#3B82F6', bg: '#1E40AF' },
        'nearby': { color: '#10B981', bg: '#047857' }, 
        'available-now': { color: '#F59E0B', bg: '#D97706' }
      };

      // Ajouter les nouveaux marqueurs
      filteredProperties.forEach(property => {
        // Validation stricte des coordonnées
        if (typeof property.lat !== 'number' || typeof property.lng !== 'number' ||
            isNaN(property.lat) || isNaN(property.lng) ||
            property.lat < -90 || property.lat > 90 ||
            property.lng < -180 || property.lng > 180) {
          console.warn(`Coordonnées invalides pour la propriété ${property.id}:`, property.lat, property.lng);
          return;
        }

        const color = colors[property.category as keyof typeof colors] || colors.new;
        const isLiked = likedProperties.includes(property.id);
        
        try {
          // Créer un marqueur personnalisé avec SVG
          const customIcon = L.divIcon({
            html: `
              <div class="relative">
                <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0C7.2 0 0 7.2 0 16C0 24 16 40 16 40S32 24 32 16C32 7.2 24.8 0 16 0Z" 
                        fill="${color.color}" stroke="${color.bg}" stroke-width="2"/>
                  <circle cx="16" cy="16" r="6" fill="white"/>
                  <circle cx="16" cy="16" r="4" fill="${color.color}"/>
                  ${isLiked ? '<path d="M13 14L15 16L17 14L17 18L13 18Z" fill="#EF4444"/>' : ''}
                </svg>
                <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 whitespace-nowrap border border-gray-200 dark:border-gray-700 max-w-xs">
                    <div class="font-semibold text-gray-900 dark:text-white text-sm">${property.title}</div>
                    <div class="text-gray-600 dark:text-gray-300 text-xs">${property.location}</div>
                    <div class="text-blue-600 dark:text-blue-400 font-bold text-sm">${property.price}</div>
                    ${isLiked ? '<div class="text-red-500 text-xs">❤️ Favori</div>' : ''}
                  </div>
                </div>
              </div>
            `,
            className: 'custom-marker',
            iconSize: [32, 40],
            iconAnchor: [16, 40],
            popupAnchor: [0, -40]
          });

          const marker = L.marker([property.lat, property.lng], { 
            icon: customIcon 
          }).addTo(mapInstanceRef.current);

          // Popup au clic
          const popupContent = `
            <div class="p-2 ${isDark ? 'text-white' : 'text-gray-900'}">
              <h3 class="font-semibold text-base mb-1">${property.title}</h3>
              <p class="text-sm opacity-80 mb-1">${property.location}</p>
              <p class="font-bold text-lg" style="color: ${color.color}">${property.price}</p>
              <button 
                onclick="window.selectProperty?.('${property.id}')" 
                class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
              >
                Voir les détails
              </button>
            </div>
          `;

          marker.bindPopup(popupContent, {
            className: isDark ? 'dark-popup' : 'light-popup',
            maxWidth: 250
          });

          // Event au clic du marqueur
          marker.on('click', () => {
            if (onPropertySelect) {
              onPropertySelect(property.id);
            }
          });

          markersRef.current.push(marker);
        } catch (error) {
          console.error(`Erreur lors de la création du marqueur pour ${property.id}:`, error);
        }
      });

      // Ajuster la vue pour inclure tous les marqueurs
      if (markersRef.current.length > 0) {
        try {
          const group = new L.featureGroup(markersRef.current);
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
        } catch (error) {
          console.warn('Erreur lors de l\'ajustement des bounds:', error);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des marqueurs:', error);
    }
  };

  // Mettre à jour les marqueurs quand les propriétés changent
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [filteredProperties, likedProperties, isDark]);

  // Exposer la fonction selectProperty globalement pour les popups
  useEffect(() => {
    (window as any).selectProperty = onPropertySelect;
    return () => {
      delete (window as any).selectProperty;
    };
  }, [onPropertySelect]);

  return (
    <div className={cn(
      "w-full h-96 lg:h-[500px] rounded-xl overflow-hidden border shadow-lg transition-all duration-300 relative",
      isDark 
        ? "border-white/10 bg-dark-secondary/50" 
        : "border-gray-200 bg-white",
      className
    )}>
      {/* Container pour la carte Leaflet */}
      <div 
        ref={mapRef}
        className="w-full h-full z-10"
      />
      
      {/* Légende moderne */}
      <div className={cn(
        "absolute bottom-4 left-4 rounded-lg shadow-lg border p-4 max-w-xs z-20",
        isDark 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-200"
      )}>
        <div className={cn(
          "text-xs font-semibold mb-3",
          isDark ? "text-white" : "text-gray-900"
        )}>
          Légende
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
            <span className={cn(
              "text-xs",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              Nouveautés ({enrichedProperties.filter(p => p.category === 'new').length})
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
            <span className={cn(
              "text-xs",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              À proximité ({enrichedProperties.filter(p => p.category === 'nearby').length})
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-orange-500 rounded-full flex-shrink-0"></div>
            <span className={cn(
              "text-xs",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              Disponible ({enrichedProperties.filter(p => p.category === 'available-now').length})
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
            <span className={cn(
              "text-xs",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              Favoris ({likedProperties.length})
            </span>
          </div>
        </div>
      </div>
      
      {/* Indicateur de localisation */}
      <div className={cn(
        "absolute top-4 left-4 rounded-lg shadow-md border px-3 py-2 z-20",
        isDark 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-200"
      )}>
        <div className={cn(
          "text-sm font-semibold",
          isDark ? "text-white" : "text-gray-900"
        )}>
          {filteredProperties.some(p => p.location.toLowerCase().includes('lyon')) ? 'Lyon, France' : 'Paris, France'}
        </div>
        <div className={cn(
          "text-xs",
          isDark ? "text-gray-400" : "text-gray-500"
        )}>
          {filteredProperties.length} logements
        </div>
      </div>

      {/* Style CSS pour les popups */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .leaflet-popup-content-wrapper {
          background: ${isDark ? '#1F2937' : '#FFFFFF'} !important;
          color: ${isDark ? '#FFFFFF' : '#111827'} !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
        }
        
        .leaflet-popup-tip {
          background: ${isDark ? '#1F2937' : '#FFFFFF'} !important;
        }
        
        .leaflet-control-zoom a {
          background: ${isDark ? '#374151' : '#FFFFFF'} !important;
          color: ${isDark ? '#FFFFFF' : '#374151'} !important;
          border: 1px solid ${isDark ? '#4B5563' : '#D1D5DB'} !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: ${isDark ? '#4B5563' : '#F3F4F6'} !important;
        }
      `}} />
    </div>
  );
}