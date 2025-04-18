import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';

import mapboxgl, { LngLatLike, MapMouseEvent } from 'mapbox-gl';
import { v4 as UUIDv4 } from 'uuid';

import { environment } from '../../../environments/environment';
import { JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxkey;

interface Marker {
  id: string;
  mapboxMarker: mapboxgl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef<HTMLDivElement>>('map');
  map = signal<mapboxgl.Map | null>(null);
  markers = signal<Marker[]>([]);

  async ngAfterViewInit() {
    if (!this.divElement()) return;
    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement()!.nativeElement;

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/standard',
      center: [-72.648528, 7.37773],
      zoom: 14,
    });

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('click', (event) => this.mapClick(event));
    this.map.set(map);
  }

  mapClick(event: MapMouseEvent) {
    if (!this.map()) return;
    const map = this.map()!;
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const coords = event.lngLat;

    const mapboxMarker = new mapboxgl.Marker({
      color,
    })
      .setLngLat(coords)
      .addTo(map);

    const newMarker: Marker = {
      id: UUIDv4(),
      mapboxMarker,
    };

    this.markers.set([newMarker, ...this.markers()]);
  }

  flyToMarker(lngLat: LngLatLike) {
    if (!this.map()) return;

    this.map()?.flyTo({
      center: lngLat,
    });
  }
}
