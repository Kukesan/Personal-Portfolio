import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '../app.service';
import { SharedScrollService } from '../shared/shared-scroll.service';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private http: HttpClient, 
    private elementRef: ElementRef, 
    private appService: AppService,
    private sharedScrollService: SharedScrollService
    ) {
    this.sharedScrollService.scrollTrigger$.subscribe(() => {
      this.scroll();
    });
   }

  form: any = {};

  currentScrollElementId: string | null = null;
  observer: any = IntersectionObserver;

  showSuccessMessage = false;

  contactForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email,Validators.required]),
    contactNo: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
    isRead: new FormControl(false)
  });

  ngOnInit(): void {
    
  }

  scroll() {
    const element = document.getElementById('contact')as HTMLElement ;

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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

  addContactDetails(e: Event) {
    this.http.post(environment.firebaseConfig.databaseURL+'/contact.json', this.contactForm.value).subscribe(
      (response: any) => {
        console.log(response)
        this.contactForm.reset();
        this.showSuccessMessage = true;
      }
    )

    e.preventDefault();

    emailjs
      .sendForm('service_ydq0bkz', 'template_8f0gqmq', e.target as HTMLFormElement, {
        publicKey: 'GgsWzIi7JqBGcIcrg',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', (error as EmailJSResponseStatus).text);
        },
      );
  }
}
