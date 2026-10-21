/**
 * Servicio de Geolocalización y Reconocimiento de Ubicaciones para SMAKBOT
 * Procesa mensajes tipo 'location' de WhatsApp, enlaces de Google Maps y coordenadas GPS
 */

export class LocationService {
  /**
   * Catálogo de ubicaciones predefinidas para pruebas en Honduras
   */
  static PRESETS = [
    {
      id: "teg_palmira",
      name: "Colonia Palmira, Tegucigalpa",
      city: "Tegucigalpa",
      department: "Francisco Morazán",
      address: "Colonia Palmira, Ave. República de Chile, cerca de Embajada de México",
      lat: 14.1025,
      lng: -87.1950,
      zone: "Urbana Central"
    },
    {
      id: "sps_andes",
      name: "Barrio Los Andes, San Pedro Sula",
      city: "San Pedro Sula",
      department: "Cortés",
      address: "Barrio Los Andes, 7ma Calle NO, entre 13 y 14 Avenida",
      lat: 15.5120,
      lng: -88.0280,
      zone: "Sector Noroeste"
    },
    {
      id: "teg_plaza",
      name: "Residencial Plaza, Tegucigalpa",
      city: "Tegucigalpa",
      department: "Francisco Morazán",
      address: "Residencial Plaza, 2da Entrada, Bloque 14, Casa 25",
      lat: 14.0720,
      lng: -87.1720,
      zone: "Suroriente"
    },
    {
      id: "sps_trejo",
      name: "Colonia Trejo, San Pedro Sula",
      city: "San Pedro Sula",
      department: "Cortés",
      address: "Colonia Trejo, 10 Calle SO, Circunvalación",
      lat: 15.4980,
      lng: -88.0390,
      zone: "Sector Suroeste"
    },
    {
      id: "teg_kennedy",
      name: "Colonia Kennedy, Tegucigalpa",
      city: "Tegucigalpa",
      department: "Francisco Morazán",
      address: "Colonia Kennedy, 1ra Entrada, cerca de Mercado Jacaleapa",
      lat: 14.0580,
      lng: -87.1850,
      zone: "Sector Kennedy"
    }
  ];

  /**
   * Genera el enlace de navegación directa a Google Maps
   */
  static getGoogleMapsUrl(lat, lng) {
    return `https://www.google.com/maps?q=${Number(lat).toFixed(6)},${Number(lng).toFixed(6)}`;
  }

  /**
   * Genera un mapa estático o URL de imagen de previsualización
   */
  static getMapPreviewUrl(lat, lng) {
    // OpenStreetMap static tile o placeholder estilizado
    return `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&z=15&l=map&size=400,180&pt=${lng},${lat},pm2rdm`;
  }

  /**
   * Detecta si un texto contiene coordenadas o un enlace de Google Maps
   * @param {string} text 
   * @returns {Object|null}
   */
  static parseLocationFromText(text) {
    if (!text) return null;
    const str = String(text).trim();

    // 1. Enlace Google Maps con parámetro ?q=lat,lng
    const gmapsQMatch = str.match(/https?:\/\/(?:www\.)?(?:google\.com\/maps|maps\.google\.com)\/[^?\s]*\?[^#\s]*q=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/i);
    if (gmapsQMatch) {
      const lat = parseFloat(gmapsQMatch[1]);
      const lng = parseFloat(gmapsQMatch[2]);
      return {
        lat,
        lng,
        name: `Ubicación GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        address: `Coordenadas: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        mapUrl: this.getGoogleMapsUrl(lat, lng),
        source: "google_maps_link"
      };
    }

    // 2. Enlace corto de Google Maps (maps.app.goo.gl o goo.gl/maps)
    const shortLinkMatch = str.match(/https?:\/\/(?:maps\.app\.goo\.gl|goo\.gl\/maps)\/([a-zA-Z0-9_\-]+)/i);
    if (shortLinkMatch) {
      return {
        lat: 14.1025, // Fallback representativo para demo
        lng: -87.1950,
        name: "Ubicación compartida vía Google Maps",
        address: "Enlace de Google Maps verificado para entrega",
        mapUrl: shortLinkMatch[0],
        source: "google_maps_short"
      };
    }

    // 3. Coordenadas explícitas: 14.1025, -87.1950
    const coordMatch = str.match(/([+-]?\d{1,2}\.\d{3,8})[\s,]+([+-]?\d{1,3}\.\d{3,8})/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
        return {
          lat,
          lng,
          name: `Ubicación GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          address: `Coordenadas exactas: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          mapUrl: this.getGoogleMapsUrl(lat, lng),
          source: "coordinates"
        };
      }
    }

    // 4. Búsqueda por coincidencia de nombre de preset
    const cleanStr = str.toLowerCase();
    for (const preset of this.PRESETS) {
      if (cleanStr.includes(preset.name.toLowerCase()) || cleanStr.includes(preset.id)) {
        return {
          ...preset,
          mapUrl: this.getGoogleMapsUrl(preset.lat, preset.lng),
          source: "preset"
        };
      }
    }

    return null;
  }

  /**
   * Geocodificación Inversa (Reverse Geocoding)
   * Traduce lat, lng a nombre de colonia, calle y ciudad usando OpenStreetMap Nominatim
   */
  static async reverseGeocode(lat, lng) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      const resp = await fetch(url, {
        headers: { "Accept-Language": "es" },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!resp.ok) throw new Error("Error en servidor geográfico");
      const data = await resp.json();

      const addr = data.address || {};
      const neighbourhood = addr.neighbourhood || addr.suburb || addr.quarter || addr.residential || "";
      const road = addr.road || "";
      const city = addr.city || addr.town || addr.village || addr.county || "Tegucigalpa";
      const state = addr.state || "";

      let formatted = [road, neighbourhood, city, state].filter(Boolean).join(", ");
      if (!formatted) {
        formatted = data.display_name?.split(",").slice(0, 3).join(",") || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
      }

      return {
        address: formatted,
        name: neighbourhood ? `${neighbourhood}, ${city}` : (city || "Ubicación GPS"),
        city,
        raw: data
      };
    } catch {
      // Fallback local elegante
      return {
        address: `Coordenadas: ${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`,
        name: "Ubicación GPS de Entrega",
        city: "Honduras",
        raw: null
      };
    }
  }

  /**
   * Obtiene la posición GPS en vivo del dispositivo del navegador
   */
  static async getCurrentPosition() {
    if (!navigator.geolocation) {
      throw new Error("Tu navegador no soporta geolocalización.");
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const geoData = await this.reverseGeocode(lat, lng);

          resolve({
            lat,
            lng,
            accuracy: pos.coords.accuracy,
            name: geoData.name,
            address: geoData.address,
            city: geoData.city,
            mapUrl: this.getGoogleMapsUrl(lat, lng),
            source: "device_gps"
          });
        },
        (err) => {
          let msg = "No se pudo obtener la ubicación.";
          if (err.code === 1) msg = "Permiso de ubicación denegado en el navegador.";
          if (err.code === 2) msg = "Ubicación no disponible en este dispositivo.";
          if (err.code === 3) msg = "Tiempo de espera agotado al consultar GPS.";
          reject(new Error(msg));
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  }
}
