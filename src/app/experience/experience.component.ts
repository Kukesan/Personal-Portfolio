import { Component, HostListener, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {

  constructor(private elementRef: ElementRef) { }

  currentScrollElementId: string | null = null;
  observer: any = IntersectionObserver;

  ngOnInit() {
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.currentScrollElementId = entry.target.id;
        if (this.currentScrollElementId == 'experience-left') {
          var experienceLeft = document.getElementById('experience-left') as HTMLElement;
          var experienceRight = document.getElementById('experience-right') as HTMLElement;

          experienceLeft.style.opacity = '1';
          experienceLeft.style.transitionDuration = '1s';

          experienceRight.style.opacity = '1';
          experienceRight.style.transitionDuration = '1s';
          experienceRight.style.transitionDelay = '0.3s';

        }
      }
    }
    );
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const elements = this.elementRef.nativeElement.querySelectorAll('[id]');
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), options);
    elements.forEach((element: any) => this.observer.observe(element));
  }
}
