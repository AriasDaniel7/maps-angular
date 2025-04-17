import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { filter, map } from 'rxjs';

import { routes } from '../../../app.routes';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  router = inject(Router);

  routes = routes
    .map((route) => ({
      path: route.path,
      title: `${route.title ?? 'Maps en Angular'}`,
    }))
    .filter((route) => route.path !== '**');

  pageTitle$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event) => event.url),
    map((url) => routes.find((route) => `/${route.path}` === url)?.title)
  );

  pageTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.url),
      map((url) => routes.find((route) => `/${route.path}` === url)?.title)
    )
  );
}
