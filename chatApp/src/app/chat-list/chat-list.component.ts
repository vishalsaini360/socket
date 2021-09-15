import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { SocketioService } from '../socketio.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  id: any;
  name:any;
  inputMessage:any;
  roomData;
  allSendNotificationForm: FormGroup;
  msgList=[]
  messageArray:Array<{user:String,message:String}>=[];

  constructor(public router : Router,
    private activatedRoute: ActivatedRoute,
    public service :AppService,
    private socketService: SocketioService) {
      this.socketService.newUserJoined()
      .subscribe(data=>this.messageArray.push(data))



      this.socketService.userLeftRoom()
      .subscribe(data=>this.messageArray.push(data))

      this.socketService.newMessageReceived()
      .subscribe(data=>this.messageArray.push(data))

      this.socketService.typingMessageReceived()
      .subscribe(data=>this.messageArray.push(data))

     }

  ngOnInit(): void {
    this.getId()
    // this.socketService.setupSocketConnection();
    this.allSendNotificationForm = new FormGroup({
      title: new FormControl('', [Validators.required])
    })

  }

  getId(){
    this.activatedRoute.params.subscribe(paramsId => {
      this.id = paramsId.id;
      this.name=paramsId.name;
    });
    this.roomData={
      room:this.id,
      user:this.name
    }
    this.socketService.joinTheRoom(this.roomData);
  }

  leaveRoom(){
    
    this.roomData={
      room:this.id,
      user:this.name
    }
    console.log("ssssssss",this.roomData)
    this.socketService.leaveRoom(this.roomData);
  }

  sendMessage(data){
    if (this.allSendNotificationForm.invalid) {
      return
    }
    
    this.roomData={
      room:this.id,
      user:this.name,
      message:data.title
    }
    this.socketService.sendMessage(this.roomData);
    this.allSendNotificationForm = new FormGroup({
      title: new FormControl('', [Validators.required])
    })
  }


  
}
