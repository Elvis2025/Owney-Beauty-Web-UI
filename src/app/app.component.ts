import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/ui/ui.components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  template: '<router-outlet /><ob-toast />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
