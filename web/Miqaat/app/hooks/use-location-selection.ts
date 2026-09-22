import { useState, useEffect, useCallback } from "react";
import type { Wilaya, Location } from "~/data/prayer-data";
import { fetchWilayas, findNearestLocation } from "~/services/api";

export interface LocationSelectionState {
  wilayas: Wilaya[];
  selectedWilaya: Wilaya | null;
  isLoadingWilayas: boolean;
  isDetectingGPS: boolean;
  gpsError: string | null;
  fetchError: string | null;
  selectWilaya: (wilaya: Wilaya | null) => void;
  clearSelection: () => void;
  detectGPSLocation: () => void;
  clearGpsError: () => void;
  retryFetch: () => void;
  getSelectedLocation: () => Location | null;
}

export function useLocationSelection(): LocationSelectionState {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState<Wilaya | null>(null);
  const [isLoadingWilayas, setIsLoadingWilayas] = useState(true);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadWilayas = useCallback(async (cancelled = false) => {
    setIsLoadingWilayas(true);
    setFetchError(null);
    try {
      const data = await fetchWilayas();
      if (!cancelled) setWilayas(data);
    } catch {
      if (!cancelled) setFetchError("Failed to load cities. Please check your connection and try again.");
    } finally {
      if (!cancelled) setIsLoadingWilayas(false);
    }
  }, []);

  // Fetch wilayas on mount
  useEffect(() => {
    let cancelled = false;
    loadWilayas(cancelled);
    return () => { cancelled = true; };
  }, [loadWilayas]);

  const retryFetch = useCallback(() => {
    loadWilayas();
  }, [loadWilayas]);

  const selectWilaya = useCallback((wilaya: Wilaya | null) => {
    setSelectedWilaya(wilaya);
    setGpsError(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedWilaya(null);
    setGpsError(null);
  }, []);

  const clearGpsError = useCallback(() => {
    setGpsError(null);
  }, []);

  const detectGPSLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("GPS is not available on this device. Please select your Wilaya manually.");
      return;
    }
    setIsDetectingGPS(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const result = await findNearestLocation(pos.coords.latitude, pos.coords.longitude);
          if (result) {
            setSelectedWilaya(result.wilaya);
          }
        } catch {
          setGpsError("Could not determine your location. Please select your Wilaya manually.");
        } finally {
          setIsDetectingGPS(false);
        }
      },
      () => {
        setIsDetectingGPS(false);
        setGpsError("Location access was denied. Please select your Wilaya from the dropdown below.");
      },
    );
  }, []);

  const getSelectedLocation = useCallback((): Location | null => {
    if (!selectedWilaya) return null;
    return {
      city: selectedWilaya.name,
      cityAr: selectedWilaya.nameAr,
      country: "Algeria",
      countryAr: "الجزائر",
      timezone: "Africa/Algiers",
      latitude: selectedWilaya.latitude,
      longitude: selectedWilaya.longitude,
      cityId: selectedWilaya.cityId,
    };
  }, [selectedWilaya]);

  return {
    wilayas,
    selectedWilaya,
    isLoadingWilayas,
    isDetectingGPS,
    gpsError,
    fetchError,
    selectWilaya,
    clearSelection,
    detectGPSLocation,
    clearGpsError,
    retryFetch,
    getSelectedLocation,
  };
}
