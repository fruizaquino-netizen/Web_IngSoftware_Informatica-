import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-header-institucional',
  standalone: true,
  imports: [],
  templateUrl:'./header-shared.component.html',
  styleUrl: './header-shared.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderSharedComponent {

}
