import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';

import mapboxgl from 'mapbox-gl';

import { environment } from '../../../../environments/environment';

mapboxgl.accessToken = environment.mapboxkey;

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniMapComponent implements AfterViewInit {
  divElement = viewChild<ElementRef<HTMLDivElement>>('map');
  coordinates = input.required<{ lng: number; lat: number }>();
  zoom = input<number>(14);

  async ngAfterViewInit() {
    if (!this.divElement()) return;
    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement()!.nativeElement;
    const { lat, lng } = this.coordinates();

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/standard',
      center: [lng, lat],
      zoom: this.zoom(),
      interactive: false,
      pitch: 30,
    });

    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    new mapboxgl.Marker({
      color,
    })
      .setLngLat(this.coordinates())
      .addTo(map);
  }
}
