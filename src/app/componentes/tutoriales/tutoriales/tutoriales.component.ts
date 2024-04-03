import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TutorialesService } from '../tutoriales.service';
import { Observable } from 'rxjs';
import { tutoriales } from '../tutoriales';

@Component({
  selector: 'app-tutoriales',
  templateUrl: './tutoriales.component.html',
  styleUrls: ['./tutoriales.component.css']
})
export class TutorialesComponent implements OnInit{

  tutoriales$?:Observable<tutoriales[]>
  videoSource?:string = 'https://youtu.be/_3A_AYF0dUE?si=TLIB8C062udSXoUq'

  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef;

  constructor(private tutorialesService:TutorialesService){

  }

  ngOnInit(): void {
    this.tutoriales$ = this.tutorialesService.obtenerTutoriales()
  }

  verVideo(enlace:string){
    this.pause()
    this.videoSource = enlace
    this.load();
    this.play()
  }

  play() {
    this.videoPlayerRef.nativeElement.play();
  }

  pause() {
    this.videoPlayerRef.nativeElement.pause();
  }

  load(){
    this.videoPlayerRef.nativeElement.load()
  }
}
