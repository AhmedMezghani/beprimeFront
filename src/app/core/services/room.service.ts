// room.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject ,tap} from 'rxjs';
import { URL_room } from './url';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private roomsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public rooms$: Observable<any[]> = this.roomsSubject.asObservable();
  constructor(private http: HttpClient) {
    this.loadRooms();
   }
  private loadRooms() {
    this.http.get<any[]>(`${URL_room}`).subscribe(
      (data: any[]) => {
        this.roomsSubject.next(data);
      },
      (error: any) => {
        console.error('Error fetching rooms', error);
      }
    );
  }
  getAllRooms(): Observable<any[]> {
    return this.rooms$;
  }

  addRoom(newRoom: any): Observable<any> {
    return this.http.post<any>(`${URL_room}/addRoom`, newRoom).pipe(
      // Update the roomsSubject after successfully adding a new room
      tap((addedRoom: any) => {
        const currentRooms = this.roomsSubject.getValue();
        this.roomsSubject.next([...currentRooms, addedRoom]);
      })
    );
  }
}
