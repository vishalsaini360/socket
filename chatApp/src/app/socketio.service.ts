import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  timeout:any;
  constructor() { }
  private socket=io('http://localhost:3001');
  getData;
  joinTheRoom(roomId) {
     this.socket.emit('subscribe',roomId );
  }

  newUserJoined(){
    let observable = new Observable<{user:String,message:String}>(observer=>{
      this.socket.on('new user join',(data)=>{
        observer.next(data);
      });
      return  ()=>{this.socket.disconnect()}
    })
    return observable;
  }

  leaveRoom(data){
    console.log('datadata',data)
    this.socket.emit('unsubscribe',data)
  }

  userLeftRoom(){
    let observable = new Observable<{user:String,message:String}>(observer=>{
      this.socket.on('left room',(data)=>{
        observer.next(data);
      });
      return  ()=>{this.socket.disconnect()}
    })
    return observable;
  }


  sendMessage(data){
    this.socket.emit('message',data)
  }

  newMessageReceived(){
    let observable = new Observable<{user:String,message:String}>(observer=>{
      this.socket.on('new message',(data)=>{
        observer.next(data);
      });
      return  ()=>{this.socket.disconnect()}
    })
    return observable;
  }

  timeoutFunction() {
    this.socket.emit('typing',false);
  }
  userTyping(data){
    console.log('d',data)
    this.socket.emit('typing',data)
    clearTimeout(this.timeout)
    this.timeout = setTimeout(this.timeoutFunction, 2000)
  }


  typingMessageReceived(){
    let observable = new Observable<{user:String,message:String}>(observer=>{
      this.socket.on('typing',(data)=>{
        observer.next(data);
      });
      return  ()=>{this.socket.disconnect()}
    })
    return observable;
  }
  
  















  // setupSocketConnection(roomId,message) {
    
  //   this.socket.on('message', function (data) {
  //     console.log("asdasdasdasddasd" ,data);
  //     return data;
  //   });
     
  //   return this.socket.emit('send', { room: roomId, message: message });
 
  // }




  // setupSocketConnection(roomId,message) {
  //   this.socket = io(environment.SOCKET_ENDPOINT, {
  //     auth: {
  //       token: "abc"
  //     }
  //   });

  //   this.socket.on('message', function (data) {
  //     console.log("asdasdasdasddasd" ,data);
  //   });
     
  //    this.socket.emit('subscribe',roomId );
     
    
  //     //  this.socket.emit('send', { room: "1", message: "Testing Messge" });
  //      this.socket.emit('send', { room: roomId, message: message });
 
  // }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  
}
