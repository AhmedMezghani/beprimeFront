import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import {Room} from "../core/models/room.model";
import {RoomService} from "../core/services/room.service";
import { EventEmitter, Output } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.scss'
})
export class AddRoomComponent implements OnInit  {
  constructor(public activeModal: NgbActiveModal,    private formBuilder: FormBuilder,private roomService: RoomService
    ) {}
    @Output() roomAdded: EventEmitter<any> = new EventEmitter<any>();

  newRoom: Room = { id: 0, name: '', description: '', view: '', type: '', combinaisons: '' ,min:0,max:0};
  combinaisons:string[]=[];
  roomForm!: FormGroup;
  ngOnInit() {
    this.roomForm = this.formBuilder.group({
      name: [this.newRoom.name, [Validators.required]],
      description: [this.newRoom.description],
      view: [this.newRoom.view],
      type: [this.newRoom.type],
      min: [this.newRoom.min, [Validators.required, this.positiveValidator]],
      max: [this.newRoom.max, [Validators.required, this.positiveValidator]]
    }, { validators: this.validateMinMax });
    this.roomForm.get('min')?.valueChanges.subscribe(() => this.generateCombinations());
    this.roomForm.get('max')?.valueChanges.subscribe(() => this.generateCombinations());
  }
  validateMinMax(group: FormGroup) {
    const min = group.get('min')!.value;
    const max = group.get('max')!.value;
    return max >= min ? null : { minMaxInvalid: true };
  }
  positiveValidator(control:any) {
    const value = control.value;
    return value >= 0 ? null : { positive: true };
  }
  generateCombinations() {
    this.combinaisons = this.calculateCombinations(
      this.roomForm.get('min')!.value,
      this.roomForm.get('max')!.value
    );

  }
  private calculateCombinations(min: number, max: number): string[] {
    const combinations: string[] = [];
    for (let adults = max; adults >= 0; adults--) {
      for (let children = max - adults; children >= 0; children--) {
        const combination = `${adults}A,${children}C`;
        if(adults+children>=min)
          combinations.push(combination);
      }
    }
    return combinations;
  }
  closeModal() {
    this.activeModal.close('Modal closed');
  }
  saveChanges() {
    if (this.roomForm.valid) {
      this.newRoom = this.roomForm.value;
      this.newRoom.combinaisons = this.combinaisons.join(';');
      console.log('Saving new room:', this.newRoom);
      this.activeModal.close('Changes saved');
      this.roomService.addRoom(this.newRoom).subscribe(
        (data) => {
          console.log('Room added successfully', data);
          this.roomAdded.emit('roomAdded');
        },
        (error) => {
          console.error('Error adding room', error);
        }
      );
    }else {
      console.error('Form is not valid. Cannot save changes.');
    }
  }

}
