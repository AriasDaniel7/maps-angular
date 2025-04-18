import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import mapboxgl from 'mapbox-gl';

import { environment } from '../../../environments/environment';
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxkey;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styleUrl: './fullscreen-map-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef<HTMLDivElement>>('map');
  map = signal<mapboxgl.Map | null>(null);
  zoom = signal<number>(13);
  coordinates = signal({
    lng: -74.08175,
    lat: 4.60971,
  });

  zoomEffect = effect(() => {
    if (!this.map()) return;

    this.map()?.zoomTo(this.zoom());
  });

  async ngAfterViewInit() {
    if (!this.divElement()) return;
    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement()!.nativeElement;
    const { lat, lng } = this.coordinates();

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/standard', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
      antialias: true,
      maxZoom: 19,
      minZoom: 4,
    });

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.GeolocateControl());
    map.addControl(new mapboxgl.ScaleControl());

    map.on('style.load', () => {
      map.setConfigProperty('basemap', 'lightPreset', 'dusk');
      map.addSource('eraser', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                coordinates: [
                  [
                    [-0.12573, 51.53222],
                    [-0.12458, 51.53219],
                    [-0.12358, 51.53492],
                    [-0.12701, 51.53391],
                    [-0.12573, 51.53222],
                  ],
                ],
                type: 'Polygon',
              },
            },
          ],
        },
      });
    });

    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });

    map.on('moveend', () => {
      const center = map.getCenter();
      this.coordinates.set(center);
    });

    this.map.set(map);
  }
}
