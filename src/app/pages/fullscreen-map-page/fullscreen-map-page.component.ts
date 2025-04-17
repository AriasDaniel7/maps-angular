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
import { DecimalPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxkey;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styleUrl: './fullscreen-map-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef<HTMLDivElement>>('map');
  map = signal<mapboxgl.Map | null>(null);
  zoom = signal<number>(14);

  zoomEffect = effect(() => {
    if (!this.map()) return;

    this.map()?.zoomTo(this.zoom());
  });

  async ngAfterViewInit() {
    if (!this.divElement()) return;
    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement()!.nativeElement;

    console.log(element);

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
    });

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });

    this.map.set(map);
  }
}
