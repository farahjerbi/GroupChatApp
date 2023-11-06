import { AfterViewChecked, Component, ElementRef, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { ChatService } from 'app/auth/service/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit  {
chatService = inject(ChatService)
 public loggedInUsername;
  public currentUser;
  messages:any[]=[];
  inputMessage ="";
  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
      this.loggedInUsername=user.email;
    });
  this.chatService.messages$.subscribe(res=>{
    this.messages=res;
    console.log("🚀 ~ file: chat.component.ts:30 ~ ChatComponent ~ ngOnInit ~ this.messages:", this.messages)
  })
  
  
  }



  sendMessage(){
      this.chatService.SendMessage(this.inputMessage).then(()=>{
        this.inputMessage="";
      }).catch((err)=>{
        console.log(err);
      })
  }

  leaveChat(){
    this.chatService.LeaveChat().then(()=>{
      this.router.navigate(['pages/chat']);
      setTimeout(()=>{
        location.reload();
      },0);
    }).catch((err) => {
      console.log("🚀 ~ file: chat.component.ts:54 ~ ChatComponent ~ this.chatService.LeaveChat ~ err:", err);
    })
  }



}
