import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileImageService {
  private profileImageUrlSubject = new BehaviorSubject<string | undefined>(undefined);
  profileImageUrl$ = this.profileImageUrlSubject.asObservable();

  constructor() {}

  setProfileImageUrl(profileImageUrl: string): void {
    this.profileImageUrlSubject.next(profileImageUrl);
  }
}
