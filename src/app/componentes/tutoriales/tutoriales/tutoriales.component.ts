import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TutorialesService } from '../tutoriales.service';
import { Observable, Subscription, of, tap } from 'rxjs';
import { tutoriales } from '../tutoriales';

@Component({
  selector: 'app-tutoriales',
  templateUrl: './tutoriales.component.html',
  styleUrls: ['./tutoriales.component.css']
})
export class TutorialesComponent implements OnInit, OnDestroy{

  tutoriales$:Observable<tutoriales[]> = of([])
  videoSource?:string = 'https://youtu.be/_3A_AYF0dUE?si=TLIB8C062udSXoUq'
  tutorialesSuscripcion?:Subscription

  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef;

  constructor(private tutorialesService:TutorialesService){

  }
  ngOnDestroy(): void {
    this.tutorialesSuscripcion?.unsubscribe()
  }

  ngOnInit(): void {
    this.tutorialesSuscripcion = this.obtenerTutoriales().subscribe()
  }

  private obtenerTutoriales(){
    return this.tutorialesService.obtenerTutoriales().pipe(
      tap(tutoriales => this.tutoriales$ = of(tutoriales))
    )
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
