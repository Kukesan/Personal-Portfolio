import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class SkillLink {
  name: string;
  link: string;
  icon: string;
  constructor(name: string, link: string, icon: string) {
    this.name = name;
    this.link = link;
    this.icon = icon;
  }
}

export class Skill {
  name: string;
  options: string[];
  constructor(name: string, options: string[]) {
    this.name = name;
    this.options = options;
  }
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
  animations: [
    trigger('skillLinkAnimation', [
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0.95)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('hidden => visible', animate('1000ms ease-in'))
    ]),
    trigger('skillAnimation', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(10px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => visible', animate('1000ms ease-in'))
    ])
  ]
})
export class SkillsComponent implements OnInit {

  skillLinkAnimationStates: string[] = [];
  private skillLinkAnimationSubscription: Subscription | undefined;

  skillAnimationStates: string[] = [];

  skillLinks: SkillLink[] = [
    new SkillLink("Linkedin", "https://www.linkedin.com/in/kukesan/", "https://cdn1.iconfinder.com/data/icons/logotypes/32/circle-linkedin-512.png"),
    new SkillLink("Git Hub", "https://github.com/Kukesan", "https://live.staticflickr.com/65535/53054599762_6fe632260f_n.jpg"),
    new SkillLink("Hacker Rank", "https://www.hackerrank.com/K_Kukesan?hr_r=1", "https://live.staticflickr.com/65535/53055189741_4d84135af4_n.jpg"),
    new SkillLink("Pinterest", "https://www.pinterest.com/K_Kukesan/_saved/", "https://live.staticflickr.com/65535/53055190236_be696ef876.jpg")
  ]

  skills: Skill[] = []

  constructor(private http: HttpClient) {
    this.skillLinkAnimationSubscription = undefined;
  }

  ngOnInit(): void {
    this.loadSkills();
    console.log(this.skills);
    this.skillLinks.forEach(() => this.skillLinkAnimationStates.push('hidden'));
    this.skills.forEach(() => this.skillAnimationStates.push('hidden'));
  }

  ngAfterViewInit() {
    var titleUnderline = document.getElementById("title-underline") as HTMLElement;

    setTimeout(() => {
      titleUnderline.style.width = "15%";
      titleUnderline.style.opacity = "1";
      titleUnderline.style.transitionDuration = "3s";
    }, 50);

    let j = 0;
    this.skillLinkAnimationSubscription = timer(0, 250).subscribe(() => {
      if (j < this.skillLinkAnimationStates.length) {
        this.skillLinkAnimationStates[j] = 'visible';
        j++;
      } else {
        this.stopAnimation();
        for (let i = 0; i < this.skills.length; i++) {
          this.skillAnimationStates[i] = 'visible';
        }
      }
    });
  }

  loadSkills() {
    this.http.get(environment.firebaseConfig.databaseURL+'/skills.json').subscribe(
      (response: any) => {
        const keys = Object.keys(response);
        keys.forEach((key) => {
          const value = response[key];
          this.skills.push(value);
        });
      },
      (error) => {
        console.error('Error loading skills:', error);
      }
    );
  }
  

  stopAnimation(): void {
    if (this.skillLinkAnimationSubscription) {
      this.skillLinkAnimationSubscription.unsubscribe();
    }
  }

  goLink(link: string): void {
    window.open(link, "_blank");
  }
}
