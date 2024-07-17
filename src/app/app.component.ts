import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { getUsers, getUserById, addUser, deleteUser } from './users.graphql';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

export interface IUser {
  id: number;
  username: string;
  gender: string;
  birth: string;
  phone: string;
}

export interface IData {
  users: IUser[];
}

export interface IUserRecord {
  user: IUser;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatTableModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'my-angular-app';
  displayedColumns: string[] = [
    'username',
    'gender',
    'birth',
    'phone',
    'action',
  ];

  users: IUser[] = [];
  userRecord: IUser = {
    id: 0,
    username: '',
    gender: '',
    birth: '',
    phone: '',
  };
  addForm!: FormGroup;

  constructor(
    private apollo: Apollo,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      username: new FormControl(''),
      gender: new FormControl(''),
      birth: new FormControl(''),
      phone: new FormControl(''),
    });
    this.searchUser();
  }

  searchUser() {
    this.apollo
      .query({
        query: getUsers,
      })
      .subscribe({
        next: (data) => {
          const result: IData = data.data as IData;
          if (result) {
            this.users = result.users;
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  openUserAdd() {
    const addParameters = this.addForm.value;
    this.apollo
      .mutate({
        mutation: addUser,
        variables: addParameters,
      })
      .subscribe({
        next: (data) => {
            if (data) {
                this.addForm.reset();
                this.searchUser();
                console.log('successful');
            }
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  openUserView(id: number) {
    this.apollo
      .query({
        query: getUserById,
        variables: {
          id,
        },
      })
      .subscribe({
        next: (data) => {
          const result: IUserRecord = data.data as IUserRecord;
          if (result) {
            this.userRecord = result.user;
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  deleteUser(id: number) {
    this.apollo
      .mutate({
        mutation: deleteUser,
        variables: {
            id
        },
      })
      .subscribe({
        next: (data) => {
            if (data) {
                this.searchUser();
                console.log('successful');
            }
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
