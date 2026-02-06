import { Component, computed, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
@Component({
  imports :[RouterModule],
  standalone: true,
  selector:'planEstudios',
  templateUrl: './PlanEstudio-page.component.html',
  styleUrls: ['./PlanEstudio-page.component.css']
})
export class PlanEstudiosPageComponent{}
