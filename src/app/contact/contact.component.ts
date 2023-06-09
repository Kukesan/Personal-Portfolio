import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private http: HttpClient, private elementRef: ElementRef, private appService: AppService) { }

  form: any = {};

  currentScrollElementId: string | null = null;
  observer: any = IntersectionObserver;

  contactForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    contactNo: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
    isRead: new FormControl(false)
  });

  ngOnInit(): void {
  }
  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      var leftContent = document.getElementById('left-content') as HTMLElement;
      var rightContent = document.getElementById('right-content') as HTMLElement;

      var contactInformation = document.getElementById('contact-information') as HTMLElement;
      var contactInformationTitleUnderline = document.getElementById('contact-information-title-underline') as HTMLElement;

      if (entry.isIntersecting) {
        this.currentScrollElementId = entry.target.id;
        if (this.currentScrollElementId == 'contact') {
          if (!this.appService.contactInitialLoad) {
            leftContent.style.transitionDuration = '1s';

            rightContent.style.transitionDelay = '1s';
            rightContent.style.transitionDuration = '2s';

            contactInformation.style.transitionDelay = '1s';

            contactInformationTitleUnderline.style.transitionDelay = '5s';
            contactInformationTitleUnderline.style.transitionDuration = '2s';

            this.appService.contactInitialLoad = true;
          }
          leftContent.style.opacity = '1';
          rightContent.style.marginBottom = '0px';
          contactInformation.style.display = 'block';
          contactInformationTitleUnderline.style.marginRight = '10px';
        }

      }
    });
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

  addContactDetails() {
    console.log(this.contactForm.value)
    this.http.post('https://portfolio-924c8-default-rtdb.firebaseio.com/contact.json', this.contactForm.value).subscribe(
      (response: any) => {
        console.log(response)
      }
    )
  }
}
