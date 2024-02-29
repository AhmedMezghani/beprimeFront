import { Component, OnInit } from '@angular/core';
import {Room} from "../core/models/room.model";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRoomComponent } from '../add-room/add-room.component';
import {RoomService} from "../core/services/room.service";
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-rooms',
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent implements OnInit  {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  searchValue: string = '';
  constructor(private modalService: NgbModal,private roomService: RoomService) { }
  ngOnInit(): void {
    this.fetchData();
  }
  fetchData(){
    this.roomService.getAllRooms().subscribe(
      (data: any) => {
        this.rooms = data;
        this.filteredRooms = [...this.rooms];
      },
      (error: any) => {
        console.error('Error fetching rooms', error);
      }
    );
  }
  openAddRoomModal() {
    const modalRef = this.modalService.open(AddRoomComponent, { size: 'xl' });
    modalRef.closed.subscribe((result: any) => {
      if (result === 'roomAdded') {
        this.fetchData();
      }
    });
  }
  onSearchChange(): void {
    this.filteredRooms = this.rooms.filter(room =>
      room.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      room.type.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      room.combinaisons.split(';').find(combination =>
        combination.toLowerCase().includes(this.searchValue.toLowerCase())
      ));
  }
}
