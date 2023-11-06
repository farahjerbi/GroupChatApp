import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';



@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public connection: signalR.HubConnection = new signalR.HubConnectionBuilder().withUrl('http://localhost:7077/chat') // Use HTTP
  .configureLogging(signalR.LogLevel.Information)
  .build();

  public messages$ =new BehaviorSubject<any>([]);
  public connectedUsers$= new BehaviorSubject<string[]>([]);

  public messages : any[]=[];
  public users : string[]=[];

  constructor() {
    this.start();
    this.connection.on("RecieveMessage",(user:string,message:string,messageTime:string) => {
      console.log("🚀 ~ file: chat.service.ts:13 ~ ChatService ~ this.connection.on ~ messageTime:", messageTime)
      console.log("🚀 ~ file: chat.service.ts:13 ~ ChatService ~ this.connection.on ~ message:", message)
       console.log("user",user);
       this.messages = [...this.messages,{user,message,messageTime}];
       this.messages$.next(this.messages);
    	}
    )
    this.connection.on("ConnectedUser",(users:any) => {
      console.log("🚀 ~ file: chat.service.ts:19 ~ ChatService ~ constructor ~ users:", users)
      this.connectedUsers$.next(users);
    })
  }


    //start connection
  public async start(){
      try{
        await this.connection.start();
        console.log("connection is established")
      }catch(error){
        console.log("🚀 ~ file: chat.service.ts:18 ~ ChatService ~ start ~ error:", error)
        setTimeout(()=>{
          this.start();
        },5000);
      }
    }

    //Join Room

    public async JoinRoom(user:string,room:string){
      return this.connection.invoke("JoinRoom",{user,room});
    }
   
  
    //SendMessage


  
   public async SendMessage(message:string){
      return this.connection.invoke("SendMessage",message);
    }
   
  //leave 

  public async LeaveChat(){
    return this.connection.stop();

  }

}
