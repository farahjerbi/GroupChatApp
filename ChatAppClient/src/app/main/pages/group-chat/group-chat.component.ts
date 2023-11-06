import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { ChatService } from 'app/auth/service/chat.service';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.scss']
})
export class GroupChatComponent implements OnInit {
  groups = [
    { name: "MicroService", value: "166435" },
    { name: "Prepa", value: "23Y585" },
    { name: "SpringBoot", value: "313442" },
    { name: "Laravel", value: "4564747" },
    { name: "Science", value: "5356356" },
    { name: "Angular", value: "62467978" },
  ];
currentUser:any;

  constructor(private authService:AuthenticationService,private chatService:ChatService,private Route:Router) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }


  join(id:any){
    const user= this.currentUser.email
    const room=id
    this.chatService.JoinRoom(user,room).then(()=>{
      this.Route.navigate(['pages/chat/'+id])
    }).catch((err) => {
      console.log("🚀 ~ file: users.component.ts:51 ~ UsersComponent ~ this.chatService.JoinRoom ~ err:", err)
    })
  }
}
